// ============================================================
// scraper.js — TuLey-USA Federal Register Scraper
// Fetches immigration-related documents from the Federal Register API,
// translates to Spanish via Gemini, and uploads to Supabase.
// Usage: node scraper.js [--dry-run]
// ============================================================

import { createClient } from '@supabase/supabase-js';

// ─── Configuration ──────────────────────────────────────────
const FEDERAL_REGISTER_API = 'https://www.federalregister.gov/api/v1';

const IMMIGRATION_AGENCIES = [
    'homeland-security-department',
    'u-s-citizenship-and-immigration-services',
    'u-s-immigration-and-customs-enforcement',
    'u-s-customs-and-border-protection',
    'executive-office-for-immigration-review',
    'state-department',
];

const IMMIGRATION_KEYWORDS = [
    'immigration', 'immigrant', 'visa', 'asylum', 'refugee',
    'deportation', 'removal', 'naturalization', 'citizenship',
    'DACA', 'TPS', 'parole', 'inadmissibility', 'green card',
    'alien', 'noncitizen', 'border', 'USCIS', 'ICE',
];

const DOCUMENT_TYPES = ['presidential_document', 'rule', 'proposed_rule', 'notice'];

const TYPE_LABELS = {
    presidential_document: 'Executive Order',
    rule: 'Final Rule',
    proposed_rule: 'Proposed Rule',
    notice: 'Notice',
};

const DRY_RUN = process.argv.includes('--dry-run');

// ─── Supabase Client ────────────────────────────────────────
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// ─── Gemini Translation ─────────────────────────────────────
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

async function translateToSpanish(text, retries = 2) {
    if (!GEMINI_API_KEY || !text) return '';

    for (let i = 0; i <= retries; i++) {
        try {
            const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `Translate the following US immigration legal text to Spanish. 
Keep legal terminology accurate. Return ONLY the translation, nothing else.

Text: ${text}`
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.1,
                        maxOutputTokens: 2000,
                    },
                }),
            });

            if (response.status === 429) {
                const wait = (i + 1) * 5000;
                console.warn(`⚠️ Gemini rate limit (429). Waiting ${wait / 1000}s... (Attempt ${i + 1}/${retries + 1})`);
                await new Promise(r => setTimeout(r, wait));
                continue;
            }

            if (!response.ok) {
                console.warn('⚠️ Gemini translation failed:', response.status);
                return '';
            }

            const data = await response.json();
            return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
        } catch (error) {
            console.warn('⚠️ Translation error:', error.message);
            if (i < retries) {
                await new Promise(r => setTimeout(r, 2000));
                continue;
            }
            return '';
        }
    }
    return '';
}

// ─── Federal Register API ───────────────────────────────────

/**
 * Fetch recent immigration documents from the Federal Register
 * @param {number} daysBack - How many days back to search
 */
async function fetchFederalRegisterDocs(daysBack = 7) {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000)
        .toISOString().split('T')[0];

    console.log(`📡 Fetching Federal Register docs from ${startDate} to ${endDate}...`);

    const allDocs = [];

    for (const agency of IMMIGRATION_AGENCIES) {
        try {
            const params = new URLSearchParams({
                'conditions[agencies][]': agency,
                'conditions[publication_date][gte]': startDate,
                'conditions[publication_date][lte]': endDate,
                'per_page': '20',
                'order': 'newest',
            });

            // Append each field individually as the API expects fields[]=... multiple times
            const fields = ['title', 'abstract', 'document_number', 'type', 'publication_date', 'html_url', 'agencies', 'action'];
            fields.forEach(f => params.append('fields[]', f));

            const url = `${FEDERAL_REGISTER_API}/documents.json?${params}`;
            const response = await fetch(url);

            if (!response.ok) {
                console.warn(`⚠️ Failed to fetch from agency ${agency}: ${response.status}`);
                continue;
            }

            const data = await response.json();
            const results = data.results || [];

            // Filter for immigration relevance
            const relevant = results.filter(doc => {
                const text = `${doc.title} ${doc.abstract || ''}`.toLowerCase();
                return IMMIGRATION_KEYWORDS.some(kw => text.includes(kw.toLowerCase()));
            });

            if (relevant.length > 0) {
                console.log(`  ✅ ${agency}: ${relevant.length} relevant docs`);
                allDocs.push(...relevant);
            }
        } catch (error) {
            console.warn(`⚠️ Error fetching ${agency}:`, error.message);
        }
    }

    // Deduplicate by document_number
    const seen = new Set();
    const unique = allDocs.filter(doc => {
        if (seen.has(doc.document_number)) return false;
        seen.add(doc.document_number);
        return true;
    });

    console.log(`📋 Total unique relevant documents: ${unique.length}`);
    return unique;
}

// ─── Check for Existing Documents ───────────────────────────
async function getExistingDocsMap() {
    const { data, error } = await supabase
        .from('laws')
        .select('id, title_es')
        .like('id', 'fr-%');

    if (error) {
        console.warn('⚠️ Error fetching existing docs:', error.message);
        return new Map();
    }

    const map = new Map();
    (data || []).forEach(d => map.set(d.id, d));
    return map;
}

// ─── Process & Upload ───────────────────────────────────────
async function processAndUpload(docs) {
    const existingDocsMap = await getExistingDocsMap();
    let newCount = 0;

    for (const doc of docs) {
        const docId = `fr-${doc.document_number}`;
        const existingDoc = existingDocsMap.get(docId);

        // Skip only if it exists AND has a Spanish title (meaning it was fully processed)
        if (existingDoc && existingDoc.title_es && existingDoc.title_es !== existingDoc.title) {
            console.log(`  ⏭️ Skipping ${docId} (already exists and translated)`);
            continue;
        }

        if (existingDoc) {
            console.log(`  🔄 Re-processing ${docId} (missing or incomplete translation)...`);
        }

        const title = doc.title || 'Untitled Document';
        const abstract = doc.abstract || doc.title || '';
        const typeLabel = TYPE_LABELS[doc.type] || doc.type || 'Document';
        const pubDate = doc.publication_date || new Date().toISOString().split('T')[0];

        console.log(`\n📄 Processing: ${title.substring(0, 80)}...`);

        if (DRY_RUN) {
            console.log(`  🔍 [DRY RUN] Would upload: ${docId}`);
            newCount++;
            continue;
        }

        // Translate title and abstract
        console.log(`  🌐 Translating...`);
        const titleEs = await translateToSpanish(title);
        const abstractEs = await translateToSpanish(abstract);

        // Rate limit - wait between Gemini calls
        await new Promise(r => setTimeout(r, 1000));

        // Insert law
        const { error: lawError } = await supabase
            .from('laws')
            .upsert({
                id: docId,
                title: title,
                title_es: titleEs || title,
                category: 'updates',
                type: typeLabel,
                article_count: 1,
                searchable_text: `${title} ${abstract}`.substring(0, 500),
                searchable_text_es: `${titleEs} ${abstractEs}`.substring(0, 500) || null,
                last_updated: pubDate,
            }, { onConflict: 'id' });

        if (lawError) {
            console.error(`  ❌ Error inserting law: ${lawError.message}`);
            continue;
        }

        // Build article text with source link
        const articleText = `${abstract}\n\nPublished: ${pubDate}\nDocument Number: ${doc.document_number}\nSource: ${doc.html_url || 'Federal Register'}`;
        const articleTextEs = abstractEs
            ? `${abstractEs}\n\nPublicado: ${pubDate}\nNúmero de Documento: ${doc.document_number}\nFuente: ${doc.html_url || 'Federal Register'}`
            : '';

        // Insert law item
        const { error: itemError } = await supabase
            .from('law_items')
            .upsert({
                id: `${docId}-1`,
                law_id: docId,
                index: 0,
                number: 1,
                title: typeLabel,
                title_es: typeLabel,
                text: articleText,
                text_es: articleTextEs || articleText,
            }, { onConflict: 'id' });

        if (itemError) {
            console.error(`  ❌ Error inserting item: ${itemError.message}`);
            continue;
        }

        console.log(`  ✅ Uploaded: ${docId}`);
        newCount++;
    }

    return newCount;
}

// ─── Update System Metadata ─────────────────────────────────
async function updateMetadata(count) {
    if (DRY_RUN || count === 0) return;

    const { error } = await supabase
        .from('system_metadata')
        .update({
            laws_last_updated: new Date().toISOString(),
            last_upload_count: count,
        })
        .eq('id', 'main');

    if (error) {
        console.error('❌ Error updating metadata:', error.message);
    } else {
        console.log(`\n📊 Updated system_metadata: ${count} new documents`);
    }
}

// ─── Main ───────────────────────────────────────────────────
async function main() {
    console.log('🚀 TuLey-USA Federal Register Scraper');
    console.log(`📅 ${new Date().toISOString()}`);
    if (DRY_RUN) console.log('🔍 Running in DRY RUN mode (no database changes)\n');

    try {
        // Fetch last 7 days of documents
        const docs = await fetchFederalRegisterDocs(7);

        if (docs.length === 0) {
            console.log('\n✅ No new immigration documents found this week.');
            return;
        }

        // Process and upload
        const newCount = await processAndUpload(docs);

        // Update metadata to trigger app sync
        await updateMetadata(newCount);

        console.log(`\n🎉 Done! ${newCount} new documents processed.`);
    } catch (error) {
        console.error('❌ Fatal error:', error);
        process.exit(1);
    }
}

main();
