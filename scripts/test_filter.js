
async function test() {
    try {
        const IMMIGRATION_KEYWORDS = [
            'immigration', 'immigrant', 'visa', 'asylum', 'refugee',
            'deportation', 'removal', 'naturalization', 'citizenship',
            'DACA', 'TPS', 'parole', 'inadmissibility', 'green card',
            'alien', 'noncitizen', 'border', 'USCIS', 'ICE',
        ];

        const params = new URLSearchParams({
            'conditions[agencies][]': 'homeland-security-department',
            'per_page': '50',
            'order': 'newest'
        });
        const fields = ['title', 'abstract', 'document_number', 'agencies'];
        fields.forEach(f => params.append('fields[]', f));

        const url = 'https://www.federalregister.gov/api/v1/documents.json?' + params.toString();
        const res = await fetch(url);
        const data = await res.json();

        const relevant = data.results.filter(doc => {
            const text = `${doc.title} ${doc.abstract || ''}`.toLowerCase();
            const hit = IMMIGRATION_KEYWORDS.find(kw => text.includes(kw.toLowerCase()));
            if (hit) doc._hit = hit;
            return !!hit;
        });

        console.log('--- RELEVANT DOCS FOUND ---');
        console.log(JSON.stringify(relevant.map(r => ({
            id: r.document_number,
            title: r.title,
            keyword: r._hit
        })), null, 2));
    } catch (e) {
        console.error(e);
    }
}
test();
