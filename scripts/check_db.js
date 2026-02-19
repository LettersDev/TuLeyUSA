import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '../.env');

// Manual .env loader
if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, 'utf8');
    envFile.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length > 0) {
            process.env[key.trim()] = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
        }
    });
}

const supabase = createClient(
    process.env.EXPO_PUBLIC_SUPABASE_URL,
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
);

async function checkLaws() {
    console.log('🔍 Checking laws table...');
    const { data: laws, error } = await supabase
        .from('laws')
        .select('id, title, category');

    if (error) {
        console.error('❌ Error fetching laws:', error.message);
        return;
    }

    console.log(`📊 Found ${laws.length} laws:`);
    console.log(`📊 Found ${laws.length} laws.`);

    console.log('\n🔍 Checking items per law...');
    for (const law of laws) {
        const { count, error: cErr } = await supabase
            .from('law_items')
            .select('*', { count: 'exact', head: true })
            .eq('law_id', law.id);

        if (!cErr) {
            console.log(` - ${law.id}: ${count} items (Expected: ${law.article_count || '?'})`);
        }
    }

    const { count, error: countError } = await supabase
        .from('law_items')
        .select('*', { count: 'exact', head: true });

    if (countError) {
        console.error('❌ Error counting law_items:', countError.message);
    } else {
        console.log(`\n📑 Total law_items: ${count}`);
    }
}

checkLaws();
