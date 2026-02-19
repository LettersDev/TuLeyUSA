// ============================================================
// cleanup_updates.js — TuLey-USA
// Removes irrelevant "update" documents from Supabase
// Usage: node scripts/cleanup_updates.js
// ============================================================

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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

const supabaseUrl = process.env.SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Keywords that indicate a document is NOT about immigration law
const IRRELEVANT_PATTERNS = [
    // English
    'barrier', 'barriers', 'fence', 'wall construction',
    'construction of roads', 'road construction', 'highway',
    'waiver of laws', 'waive certain laws', 'waive certain',
    'pilotage', 'maritime', 'vessel', 'coast guard',
    'safety zone', 'fireworks', 'navigation',
    'electronic bond transmission',
    'expeditious construction',
    // Spanish
    'barrera', 'barreras', 'construcción rápida', 'carreteras',
    'frontera terrestre',
];

async function cleanup() {
    console.log('🧹 TuLey-USA Update Cleanup Tool');
    console.log('================================\n');

    // Fetch all documents in the 'updates' category
    const { data: updates, error } = await supabase
        .from('laws')
        .select('id, title, title_es, searchable_text_es')
        .eq('category', 'updates');

    if (error) {
        console.error('❌ Error fetching updates:', error.message);
        return;
    }

    if (!updates || updates.length === 0) {
        console.log('✅ No updates found in database.');
        return;
    }

    console.log(`📋 Found ${updates.length} updates in database:\n`);

    const toDelete = [];

    for (const update of updates) {
        const text = `${update.title} ${update.title_es || ''} ${update.searchable_text_es || ''}`.toLowerCase();
        const isIrrelevant = IRRELEVANT_PATTERNS.some(pattern => text.includes(pattern));

        if (isIrrelevant) {
            console.log(`  ❌ IRRELEVANT: ${update.id}`);
            console.log(`     "${update.title}"\n`);
            toDelete.push(update.id);
        } else {
            console.log(`  ✅ RELEVANT: ${update.id}`);
            console.log(`     "${update.title}"\n`);
        }
    }

    if (toDelete.length === 0) {
        console.log('\n✅ All updates are relevant. Nothing to clean.');
        return;
    }

    console.log(`\n🗑️ Deleting ${toDelete.length} irrelevant documents...\n`);

    for (const id of toDelete) {
        // Delete law_items first (foreign key)
        const { error: itemError } = await supabase
            .from('law_items')
            .delete()
            .eq('law_id', id);

        if (itemError) {
            console.error(`  ❌ Error deleting items for ${id}:`, itemError.message);
            continue;
        }

        // Delete the law itself
        const { error: lawError } = await supabase
            .from('laws')
            .delete()
            .eq('id', id);

        if (lawError) {
            console.error(`  ❌ Error deleting law ${id}:`, lawError.message);
        } else {
            console.log(`  🗑️ Deleted: ${id}`);
        }
    }

    console.log(`\n🎉 Cleanup complete! Removed ${toDelete.length} irrelevant documents.`);
}

cleanup().catch(console.error);
