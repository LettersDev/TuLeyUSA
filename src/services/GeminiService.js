// ============================================================
// GeminiService.js — MigraGuide USA
// Integración con Google Gemini API
// Límite: 10 consultas por día por dispositivo (AsyncStorage)
// ============================================================
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS, GEMINI_DAILY_LIMIT } from '../utils/constants';

const GEMINI_API_URL =
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent';

const getApiKey = () => process.env.EXPO_PUBLIC_GEMINI_API_KEY;

// ── System instructions per language ─────────────────────────

const SYSTEM_INSTRUCTIONS = {
    en: 'You are a legal assistant specializing in U.S. immigration law. Always respond in English, clearly and helpfully. Avoid unnecessarily complex legal jargon. At the end of each important response, briefly note that this information is educational and does not constitute legal advice.',
    es: 'Eres un asistente legal experto en inmigración de EE.UU. Responde siempre en español, de forma clara, directa y servicial. No uses lenguaje innecesariamente complejo. Al final de cada respuesta importante, incluye siempre un breve aviso de que la información es educativa y no constituye asesoría legal.',
};

// ── Gestión del límite diario ────────────────────────────────

const getUsageData = async () => {
    try {
        const data = await AsyncStorage.getItem(STORAGE_KEYS.GEMINI_USAGE);
        if (!data) return { count: 0, date: new Date().toDateString() };
        return JSON.parse(data);
    } catch {
        return { count: 0, date: new Date().toDateString() };
    }
};

const incrementUsage = async () => {
    const usage = await getUsageData();
    const today = new Date().toDateString();
    const newCount = usage.date === today ? usage.count + 1 : 1;
    await AsyncStorage.setItem(
        STORAGE_KEYS.GEMINI_USAGE,
        JSON.stringify({ count: newCount, date: today })
    );
    return newCount;
};

const getRemainingQueries = async () => {
    const usage = await getUsageData();
    const today = new Date().toDateString();
    if (usage.date !== today) return GEMINI_DAILY_LIMIT;
    return Math.max(0, GEMINI_DAILY_LIMIT - usage.count);
};

// ── Llamada a la API ─────────────────────────────────────────

const callGemini = async (prompt, lang = 'en') => {
    const apiKey = getApiKey();
    if (!apiKey || apiKey === 'PASTE_YOUR_GEMINI_KEY_HERE') {
        throw new Error('GEMINI_KEY_NOT_SET');
    }

    const remaining = await getRemainingQueries();
    if (remaining <= 0) {
        throw new Error('DAILY_LIMIT_REACHED');
    }

    const fetchUrl = `${GEMINI_API_URL}?key=${apiKey}`;
    const systemText = SYSTEM_INSTRUCTIONS[lang] || SYSTEM_INSTRUCTIONS['en'];

    const response = await fetch(fetchUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            system_instruction: {
                parts: [{ text: systemText }]
            },
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
                temperature: 0.3,
                maxOutputTokens: 1500,
                topP: 0.8,
                topK: 40
            },
        }),
    });

    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error?.message || 'Gemini API error');
    }

    const data = await response.json();
    await incrementUsage();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || (lang === 'es' ? 'Sin respuesta.' : 'No response.');
};

// ── Funciones públicas ───────────────────────────────────────

const GeminiService = {
    /**
     * Explains a legal article in simple language
     * @param {string} articleTitle
     * @param {string} articleText
     * @param {string} lang - 'en' or 'es'
     */
    explainArticle: async (articleTitle, articleText, lang = 'en') => {
        const prompt = lang === 'es'
            ? `Explica este artículo legal para alguien sin conocimientos legales:\nArtículo: ${articleTitle || 'Sin título'}\nTexto: ${articleText}`
            : `Explain this legal article for someone without legal knowledge:\nArticle: ${articleTitle || 'No title'}\nText: ${articleText}`;

        return await callGemini(prompt, lang);
    },

    /**
     * Answers a general U.S. immigration question
     * @param {string} question
     * @param {string} lang - 'en' or 'es'
     */
    askGeneralQuestion: async (question, lang = 'en') => {
        return await callGemini(question, lang);
    },

    getRemainingQueries,

    getUsageData,
};

export default GeminiService;
