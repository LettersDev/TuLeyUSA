
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
        const [key, ...value] = line.split('=');
        if (key && value) {
            process.env[key.trim()] = value.join('=').trim();
        }
    });
}

// Fallback for names used in the app vs scraper
const supabaseUrl = process.env.SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_KEY in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanup() {
    console.log('🧹 Cleaning up "updates" category in Supabase...');

    // We target only laws starting with 'fr-' (scraped) and category 'updates'
    const { data, error } = await supabase
        .from('laws')
        .delete()
        .eq('category', 'updates')
        .like('id', 'fr-%');

    if (error) {
        console.error('❌ Error during cleanup:', error.message);
    } else {
        console.log('✅ Cleanup complete. All scraped updates have been removed.');
        console.log('🚀 You can now re-run the scraper to get clean, relevant, bilingue results.');
    }
}

cleanup();
