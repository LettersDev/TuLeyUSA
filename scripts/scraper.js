// ============================================================
// scraper.js — TuLey-USA Federal Register Scraper
// Fetches immigration-related documents from the Federal Register API,
// translates to Spanish via Gemini, and uploads to Supabase.
// Usage: node scraper.js [--dry-run]
// ============================================================

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ─── Configuration ──────────────────────────────────────────
const FEDERAL_REGISTER_API = 'https://www.federalregister.gov/api/v1';

// --- Manual .env loader ---
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '../.env');

if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, 'utf8');
    envFile.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length > 0) {
            process.env[key.trim()] = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
        }
    });
}

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
    'alien', 'noncitizen', 'border', 'USCIS', 'ICE', 'CBP', 'EOIR',
    'I-94', 'I-130', 'I-485', 'I-765', 'H-1B', 'L-1', 'O-1', 'F-1',
    'SIJS', 'VAWA', 'INA', 'Adjudication', 'Entry', 'Bond',
];

const EXCLUDE_KEYWORDS = [
    'pilotage', 'maritime', 'vessel', 'boat', 'navigation', 'bridge',
    'lighthouse', 'cybersecurity', 'tsa', 'aviation', 'airport',
    'fema', 'disaster', 'flood', 'radio', 'spectrum', 'telecommunications',
    'dredging', 'waterway', 'oil spill', 'pollution',
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
const supabaseUrl = process.env.SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.EXPO_PUBLIC_GEMINI_API_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_KEY (or EXPO_PUBLIC_* fallbacks)');
    process.exit(1);
}
const supabase = createClient(supabaseUrl, supabaseKey);

// ─── Free Translation (MyMemory API) ────────────────────────
// No API key needed, no rate limits. 5000 chars/day anonymous, unlimited with email.
const MYMEMORY_URL = 'https://api.mymemory.translated.net/get';

async function translateToSpanish(text, retries = 2) {
    if (!text || text.length < 3) return text;

    // MyMemory has a 500-char limit per request, so we truncate if needed
    const truncated = text.substring(0, 490);

    for (let i = 0; i <= retries; i++) {
        try {
            const params = new URLSearchParams({
                q: truncated,
                langpair: 'en|es',
            });

            const response = await fetch(`${MYMEMORY_URL}?${params}`);

            if (!response.ok) {
                console.warn(`  ⚠️ MyMemory failed (${response.status}). Retrying...`);
                await new Promise(r => setTimeout(r, 2000));
                continue;
            }

            const data = await response.json();
            const translated = data?.responseData?.translatedText;

            if (!translated || translated.includes('MYMEMORY WARNING')) {
                console.warn('  ⚠️ MyMemory returned a warning. Using original text.');
                return text;
            }

            return translated;
        } catch (error) {
            console.warn('  ⚠️ Translation error:', error.message);
            if (i < retries) {
                await new Promise(r => setTimeout(r, 2000));
                continue;
            }
        }
    }
    return text; // Fallback to original English text
}

// ─── Local Law Matching (No AI needed) ──────────────────────
/**
 * Matches a document to an existing law using keyword overlap.
 * Returns the law ID if a strong match is found, null otherwise.
 */
function matchDocumentToLaw(doc, laws) {
    const docText = `${doc.title} ${doc.abstract || ''}`.toLowerCase();

    let bestMatch = null;
    let bestScore = 0;

    for (const law of laws) {
        const lawWords = law.title.toLowerCase()
            .split(/\s+/)
            .filter(w => w.length > 3); // Only meaningful words

        let matchCount = 0;
        for (const word of lawWords) {
            if (docText.includes(word)) matchCount++;
        }

        // Score = percentage of law title words found in the document
        const score = lawWords.length > 0 ? matchCount / lawWords.length : 0;

        if (score > bestScore && score >= 0.4) { // At least 40% word overlap
            bestScore = score;
            bestMatch = law.id;
        }
    }

    return bestMatch;
}

/**
 * Processes documents: translates with MyMemory + matches locally.
 */
async function processDocuments(docs, laws) {
    const results = [];

    for (const doc of docs) {
        console.log(`  🌐 Translating: ${doc.title.substring(0, 60)}...`);

        const titleEs = await translateToSpanish(doc.title);
        // Small delay between translation calls to be respectful
        await new Promise(r => setTimeout(r, 1500));

        const abstractEs = await translateToSpanish(doc.abstract || doc.title);
        await new Promise(r => setTimeout(r, 1500));

        const matchedLawId = matchDocumentToLaw(doc, laws);

        results.push({
            document_number: doc.document_number,
            matchedLawId: matchedLawId || 'NONE',
            titleEs,
            abstractEs,
        });
    }

    return results;
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

    // Improved Regex-based keyword matching to avoid false positives (like 'ice' in 'notice')
    const regexSource = IMMIGRATION_KEYWORDS.map(kw => {
        if (kw.length <= 5 || kw === 'border' || kw === 'alien') {
            return `\\b${kw}\\b`;
        }
        return kw;
    }).join('|');
    const relevanceRegex = new RegExp(regexSource, 'i');

    // Exclusion Regex
    const excludeRegex = new RegExp(EXCLUDE_KEYWORDS.join('|'), 'i');

    for (const agency of IMMIGRATION_AGENCIES) {
        try {
            const params = new URLSearchParams({
                'conditions[agencies][]': agency,
                'conditions[publication_date][gte]': startDate,
                'conditions[publication_date][lte]': endDate,
                'per_page': '30',
                'order': 'newest',
            });

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

            // Filter for immigration relevance using Regex
            const relevant = results.filter(doc => {
                const text = `${doc.title} ${doc.abstract || ''} ${doc.action || ''}`.toLowerCase();
                // Must match immigration AND NOT match excluded topics
                return relevanceRegex.test(text) && !excludeRegex.test(text);
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
        .select('id, title_es, title')
        .like('id', 'fr-%');

    if (error) {
        console.warn('⚠️ Error fetching existing docs:', error.message);
        return new Map();
    }

    const map = new Map();
    (data || []).forEach(d => map.set(d.id, d));
    return map;
}

async function getConsolidatedLaws() {
    // Fetch laws that ARE NOT in the 'updates' category
    const { data, error } = await supabase
        .from('laws')
        .select('id, title')
        .neq('category', 'updates');

    if (error) {
        console.warn('⚠️ Error fetching consolidated laws:', error.message);
        return [];
    }
    return data || [];
}

// ─── Process & Upload ───────────────────────────────────────
async function processAndUpload(docs) {
    const existingDocsMap = await getExistingDocsMap();
    const consolidatedLaws = await getConsolidatedLaws();

    // 1. Filter docs that truly need processing
    const docsToProcess = docs.filter(doc => {
        const docId = `fr-${doc.document_number}`;
        const existingDoc = existingDocsMap.get(docId);

        if (existingDoc && existingDoc.title_es &&
            existingDoc.title_es !== existingDoc.title &&
            !existingDoc.title_es.includes('[English Only]')) {
            return false;
        }
        return true;
    });

    if (docsToProcess.length === 0) {
        console.log('✅ All fetched documents are already processed and translated.');
        return 0;
    }

    console.log(`\n📦 Processing ${docsToProcess.length} documents (MyMemory + Local Matching)...`);

    // 2. Translate and match all documents
    const results = await processDocuments(docsToProcess, consolidatedLaws);
    let newCount = 0;

    // 3. Upload each result to Supabase
    for (const result of results) {
        const doc = docsToProcess.find(d => d.document_number === result.document_number);
        if (!doc) continue;

        const docId = `fr-${doc.document_number}`;
        const title = doc.title || 'Untitled Document';
        const typeLabel = TYPE_LABELS[doc.type] || doc.type || 'Document';
        const pubDate = doc.publication_date || new Date().toISOString().split('T')[0];
        const abstract = doc.abstract || doc.title || '';

        const matchedLawId = result.matchedLawId !== 'NONE' ? result.matchedLawId : null;
        const titleEs = result.titleEs;
        const abstractEs = result.abstractEs;

        let targetLawId = docId;
        let isAmendment = false;

        if (matchedLawId) {
            console.log(`  🎯 MATCHED: ${docId} -> ${matchedLawId}`);
            targetLawId = matchedLawId;
            isAmendment = true;
        } else {
            console.log(`  🆕 NEW LAW: ${docId}`);
        }

        if (DRY_RUN) {
            console.log(`  🔍 [DRY RUN] Would upload: ${docId}`);
            console.log(`    Title ES: ${titleEs}`);
            newCount++;
            continue;
        }

        if (!isAmendment) {
            const { error: lawError } = await supabase
                .from('laws')
                .upsert({
                    id: docId,
                    title: title,
                    title_es: titleEs,
                    category: 'updates',
                    type: typeLabel,
                    article_count: 1,
                    searchable_text: `${title} ${abstract}`.substring(0, 500),
                    searchable_text_es: abstractEs ? `${titleEs} ${abstractEs}`.substring(0, 500) : titleEs,
                    last_updated: pubDate,
                }, { onConflict: 'id' });

            if (lawError) {
                console.error(`  ❌ Error inserting law ${docId}: ${lawError.message}`);
                continue;
            }
        }

        const articleText = `${abstract}\n\nPublished: ${pubDate}\nDocument Number: ${doc.document_number}\nSource: ${doc.html_url || 'Federal Register'}`;
        const articleTextEs = abstractEs
            ? `${abstractEs}\n\nPublicado: ${pubDate}\nNúmero de Documento: ${doc.document_number}\nFuente: ${doc.html_url || 'Federal Register'}`
            : null;

        const itemId = isAmendment ? `${targetLawId}-up-${doc.document_number}` : `${targetLawId}-1`;

        let nextIndex = 0;
        if (isAmendment) {
            const { data: items } = await supabase
                .from('law_items')
                .select('index')
                .eq('law_id', targetLawId)
                .order('index', { ascending: false })
                .limit(1);
            if (items && items.length > 0) nextIndex = items[0].index + 1;
        }

        const { error: itemError } = await supabase
            .from('law_items')
            .upsert({
                id: itemId,
                law_id: targetLawId,
                index: nextIndex,
                number: isAmendment ? null : 1,
                title: isAmendment ? `UPDATE: ${pubDate}` : typeLabel,
                title_es: isAmendment ? `ACTUALIZACIÓN: ${pubDate}` : typeLabel,
                text: articleText,
                text_es: articleTextEs,
            }, { onConflict: 'id' });

        if (itemError) {
            console.error(`  ❌ Error inserting item ${itemId}: ${itemError.message}`);
            continue;
        }

        if (isAmendment) {
            await supabase.rpc('increment_article_count', { law_id_param: targetLawId });
            await supabase
                .from('laws')
                .update({ last_updated: pubDate })
                .eq('id', targetLawId);
        }

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
