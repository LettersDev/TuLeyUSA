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
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const SLEEP_BETWEEN_CALLS = 15000; // 15s to be safe on free tier

async function callGemini(prompt, retries = 3) {
    if (!GEMINI_API_KEY) return null;

    for (let i = 0; i <= retries; i++) {
        try {
            const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        temperature: 0.1,
                        maxOutputTokens: 2500,
                        responseMimeType: 'application/json',
                    },
                }),
            });

            if (response.status === 429) {
                const wait = (i + 1) * 20000; // Exponential: 20s, 40s, 60s
                console.warn(`⚠️ Gemini rate limit (429). Waiting ${wait / 1000}s... (Attempt ${i + 1}/${retries + 1})`);
                await new Promise(r => setTimeout(r, wait));
                continue;
            }

            if (!response.ok) {
                console.warn(`⚠️ Gemini call failed (${response.status})`);
                return null;
            }

            const data = await response.json();
            return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || null;
        } catch (error) {
            console.warn('⚠️ Gemini error:', error.message);
            if (i < retries) {
                await new Promise(r => setTimeout(r, 10000));
                continue;
            }
        }
    }
    return null;
}

/**
 * Combines law matching and translation into a single Gemini call.
 */
async function processDocumentWithAI(doc, laws) {
    if (!GEMINI_API_KEY) {
        return { matchedLawId: 'NONE', titleEs: doc.title, abstractEs: doc.abstract };
    }

    const lawsListString = laws.map(l => `- ID: ${l.id}, Title: ${l.title}`).join('\n');

    const prompt = `You are a legal assistant for TuLey-USA. 
Process this US immigration update and return a JSON object.

Update Title: ${doc.title}
Update Abstract: ${doc.abstract || doc.title}

Tasks:
1. matchedLawId: Does this update provide a significant amendment to any of these existing laws? 
   Existing Topics:
   ${lawsListString}
   Return the Law ID if it's a CLEAR MATCH, otherwise "NONE".

2. titleEs: Translate the document title to Spanish accurately for a legal mobile app.
3. abstractEs: Translate the document abstract to Spanish.

Return ONLY a JSON object:
{
  "matchedLawId": "ID or NONE",
  "titleEs": "Spanish Title",
  "abstractEs": "Spanish Abstract"
}`;

    const result = await callGemini(prompt);
    if (!result) return null;

    try {
        const jsonStr = result.replace(/```json|```/g, '').trim();
        return JSON.parse(jsonStr);
    } catch (e) {
        console.warn('⚠️ Failed to parse Gemini JSON:', e.message);
        return null;
    }
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
    let newCount = 0;

    for (const doc of docs) {
        const docId = `fr-${doc.document_number}`;
        const existingDoc = existingDocsMap.get(docId);

        // Skip only if it exists AND has a Spanish title that is actually different from English
        if (existingDoc && existingDoc.title_es &&
            existingDoc.title_es !== existingDoc.title &&
            !existingDoc.title_es.includes('[English Only]')) {
            console.log(`  ⏭️ Skipping ${docId} (already exists and translated)`);
            continue;
        }

        const title = doc.title || 'Untitled Document';
        const abstract = doc.abstract || doc.title || '';
        const typeLabel = TYPE_LABELS[doc.type] || doc.type || 'Document';
        const pubDate = doc.publication_date || new Date().toISOString().split('T')[0];

        console.log(`\n📄 Processing: ${title.substring(0, 80)}...`);

        if (DRY_RUN) {
            console.log(`  🔍 [DRY RUN] Would process: ${docId}`);
            newCount++;
            continue;
        }

        // --- COMBINED AI CALL (Match + Translate) ---
        console.log(`  🧠 AI: Matching & Translating...`);
        const aiResult = await processDocumentWithAI(doc, consolidatedLaws);

        if (!aiResult || !aiResult.titleEs) {
            console.warn(`  ⚠️ AI processing failed for ${docId}. Skipping to avoid poor content.`);
            continue;
        }

        const matchedLawId = aiResult.matchedLawId !== 'NONE' ? aiResult.matchedLawId : null;
        const titleEs = aiResult.titleEs;
        const abstractEs = aiResult.abstractEs;

        let targetLawId = docId;
        let isAmendment = false;

        if (matchedLawId) {
            console.log(`  🎯 MATCHED existing law: ${matchedLawId}`);
            targetLawId = matchedLawId;
            isAmendment = true;
        }

        // Wait between documents to respect the global rate limit (15s)
        console.log(`  ⏳ Waiting ${SLEEP_BETWEEN_CALLS / 1000}s for Gemini quota...`);
        await new Promise(r => setTimeout(r, SLEEP_BETWEEN_CALLS));

        if (!isAmendment) {
            // Insert as a new law in 'updates' category
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
                console.error(`  ❌ Error inserting law: ${lawError.message}`);
                continue;
            }
        }

        // Build article text
        const articleText = `${abstract}\n\nPublished: ${pubDate}\nDocument Number: ${doc.document_number}\nSource: ${doc.html_url || 'Federal Register'}`;
        const articleTextEs = abstractEs
            ? `${abstractEs}\n\nPublicado: ${pubDate}\nNúmero de Documento: ${doc.document_number}\nFuente: ${doc.html_url || 'Federal Register'}`
            : null;

        // Insert law item
        // If it's an amendment, we use a different ID scheme or just let it append
        const itemId = isAmendment ? `${targetLawId}-up-${doc.document_number}` : `${targetLawId}-1`;

        // For amendments, we want to know the last index to append correctly
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
                number: isAmendment ? null : 1, // Amendments don't usually have a sequence number in the same way
                title: isAmendment ? `UPDATE: ${pubDate}` : typeLabel,
                title_es: isAmendment ? `ACTUALIZACIÓN: ${pubDate}` : typeLabel,
                text: articleText,
                text_es: articleTextEs,
            }, { onConflict: 'id' });

        if (itemError) {
            console.error(`  ❌ Error inserting item: ${itemError.message}`);
            continue;
        }

        // If it's an amendment, update the article count and date of the parent law
        if (isAmendment) {
            await supabase.rpc('increment_article_count', { law_id_param: targetLawId });
            await supabase
                .from('laws')
                .update({ last_updated: pubDate })
                .eq('id', targetLawId);
        }

        if (abstractEs) {
            console.log(`  ✅ Successfully ${isAmendment ? 'MERGED' : 'UPLOADED'}: ${docId}`);
        } else {
            console.log(`  ⚠️ Uploaded ${docId} WITHOUT full translation.`);
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
