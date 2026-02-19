// ============================================================
// i18n.js — MigraGuide USA
// Simple bilingual translation system (EN/ES)
// Default language: English
// ============================================================
import AsyncStorage from '@react-native-async-storage/async-storage';

const LANGUAGE_KEY = 'app_language';

// ── Translation Dictionary ──────────────────────────────────
const translations = {
    // ── Navigation & Headers ────────────────────────────────
    'app.name': {
        en: 'MigraGuide USA',
        es: 'MigraGuide USA',
    },
    'nav.home': {
        en: 'Home',
        es: 'Inicio',
    },
    'nav.search': {
        en: 'Search',
        es: 'Buscar',
    },
    'nav.favorites': {
        en: 'Favorites',
        es: 'Favoritos',
    },

    // ── Home Screen ─────────────────────────────────────────
    'home.title': {
        en: 'Know Your Rights',
        es: 'Conoce Tus Derechos',
    },
    'home.subtitle': {
        en: 'U.S. Immigration Laws',
        es: 'Leyes de Inmigración de EE.UU.',
    },
    'home.categories': {
        en: 'Categories',
        es: 'Categorías',
    },
    'home.recent': {
        en: 'Recently Read',
        es: 'Leído Recientemente',
    },
    'home.askAI': {
        en: '🤖 Ask the AI Assistant',
        es: '🤖 Pregunta al Asistente IA',
    },
    'home.noHistory': {
        en: 'No reading history yet',
        es: 'Sin historial de lectura',
    },

    // ── Categories ──────────────────────────────────────────
    'cat.asylum': {
        en: 'Asylum',
        es: 'Asilo',
    },
    'cat.asylum.desc': {
        en: 'Protection for persecuted individuals',
        es: 'Protección para personas perseguidas',
    },
    'cat.visas': {
        en: 'Visas',
        es: 'Visas',
    },
    'cat.visas.desc': {
        en: 'Visa types and requirements',
        es: 'Tipos de visas y requisitos',
    },
    'cat.tps': {
        en: 'TPS',
        es: 'TPS',
    },
    'cat.tps.desc': {
        en: 'Temporary Protected Status',
        es: 'Estatus de Protección Temporal',
    },
    'cat.citizenship': {
        en: 'Citizenship',
        es: 'Ciudadanía',
    },
    'cat.citizenship.desc': {
        en: 'Naturalization and citizenship',
        es: 'Naturalización y ciudadanía',
    },
    'cat.daca': {
        en: 'DACA',
        es: 'DACA',
    },
    'cat.daca.desc': {
        en: 'Deferred Action for Childhood Arrivals',
        es: 'Acción Diferida para Llegados en la Infancia',
    },
    'cat.deportation': {
        en: 'Deportation',
        es: 'Deportación',
    },
    'cat.deportation.desc': {
        en: 'Rights and removal proceedings',
        es: 'Derechos y procesos de remoción',
    },
    'cat.work': {
        en: 'Work',
        es: 'Trabajo',
    },
    'cat.work.desc': {
        en: 'Employment authorization',
        es: 'Autorización de empleo',
    },
    'cat.family': {
        en: 'Family',
        es: 'Familia',
    },
    'cat.family.desc': {
        en: 'Family petitions and reunification',
        es: 'Peticiones familiares y reunificación',
    },
    'cat.updates': {
        en: 'Updates',
        es: 'Actualizaciones',
    },
    'cat.updates.desc': {
        en: 'Latest immigration news and changes',
        es: 'Últimas noticias y cambios migratorios',
    },

    // ── Search Screen ───────────────────────────────────────
    'search.placeholder': {
        en: 'Search laws...',
        es: 'Buscar leyes...',
    },
    'search.askAI': {
        en: 'Ask the AI',
        es: 'Preguntar a la IA',
    },
    'search.aiPlaceholder': {
        en: 'Ask any immigration question...',
        es: 'Pregunta cualquier duda migratoria...',
    },
    'search.noResults': {
        en: 'No results found',
        es: 'Sin resultados',
    },
    'search.aiRemaining': {
        en: 'AI queries remaining today',
        es: 'Consultas IA restantes hoy',
    },

    // ── Law Detail Screen ───────────────────────────────────
    'detail.explainAI': {
        en: '🤖 Explain with AI',
        es: '🤖 Explicar con IA',
    },
    'detail.download': {
        en: 'Download for Offline',
        es: 'Descargar para Offline',
    },
    'detail.downloaded': {
        en: '✅ Available Offline',
        es: '✅ Disponible Offline',
    },
    'detail.articles': {
        en: 'Articles',
        es: 'Artículos',
    },
    'detail.noArticles': {
        en: 'No articles available',
        es: 'No hay artículos disponibles',
    },

    // ── Favorites Screen ────────────────────────────────────
    'fav.title': {
        en: 'My Favorites',
        es: 'Mis Favoritos',
    },
    'fav.empty': {
        en: 'No favorites saved yet.\nTap ❤️ on any law to save it here.',
        es: 'No tienes favoritos guardados.\nToca ❤️ en cualquier ley para guardarla aquí.',
    },

    // ── AI / Gemini ─────────────────────────────────────────
    'ai.loading': {
        en: 'The AI is thinking...',
        es: 'La IA está pensando...',
    },
    'ai.limitReached': {
        en: 'You have reached the daily limit of 10 AI queries. Try again tomorrow.',
        es: 'Has alcanzado el límite de 10 consultas por día. Vuelve mañana.',
    },
    'ai.error': {
        en: 'Error connecting to AI. Please try again.',
        es: 'Error al conectar con la IA. Intenta de nuevo.',
    },
    'ai.limitAlert.title': {
        en: 'Limit Reached',
        es: 'Límite alcanzado',
    },
    'ai.limitAlert.msg': {
        en: 'You have used your 10 daily AI queries. Come back tomorrow.',
        es: 'Has usado tus 10 consultas diarias de IA. Vuelve mañana.',
    },

    // ── Onboarding ──────────────────────────────────────────
    'onboarding.welcome': {
        en: 'Welcome to MigraGuide USA',
        es: 'Bienvenido a MigraGuide USA',
    },
    'onboarding.subtitle': {
        en: 'Know your immigration rights',
        es: 'Conoce tus derechos migratorios',
    },
    'onboarding.start': {
        en: 'Get Started',
        es: 'Comenzar',
    },

    // ── Disclaimer ──────────────────────────────────────────
    'disclaimer': {
        en: 'MigraGuide USA is an informational tool. We are not lawyers and do not represent the U.S. government. This information does not constitute legal advice. Always consult a certified immigration attorney for your specific case.',
        es: 'MigraGuide USA es una herramienta informativa. No somos abogados ni representamos al gobierno de EE.UU. Esta información no constituye asesoría legal. Consulta siempre a un abogado de inmigración certificado para tu caso específico.',
    },

    // ── General ─────────────────────────────────────────────
    'general.ok': {
        en: 'OK',
        es: 'OK',
    },
    'general.cancel': {
        en: 'Cancel',
        es: 'Cancelar',
    },
    'general.close': {
        en: 'Close',
        es: 'Cerrar',
    },
    'general.retry': {
        en: 'Retry',
        es: 'Reintentar',
    },
    'general.send': {
        en: 'Send',
        es: 'Enviar',
    },
    'general.language': {
        en: 'ES',  // Shows the OTHER language to switch to
        es: 'EN',
    },
};

// ── Current Language State ───────────────────────────────────
let currentLanguage = 'en'; // Default to English

// ── Public API ───────────────────────────────────────────────

/**
 * Translate a key to the current language
 */
export const t = (key) => {
    const entry = translations[key];
    if (!entry) return key;
    return entry[currentLanguage] || entry['en'] || key;
};

/**
 * Get the current language code
 */
export const getLanguage = () => currentLanguage;

/**
 * Set the current language and persist it
 */
export const setLanguage = async (lang) => {
    currentLanguage = lang;
    await AsyncStorage.setItem(LANGUAGE_KEY, lang);
};

/**
 * Load the saved language preference (call on app start)
 */
export const loadLanguage = async () => {
    try {
        const saved = await AsyncStorage.getItem(LANGUAGE_KEY);
        if (saved === 'en' || saved === 'es') {
            currentLanguage = saved;
        }
    } catch {
        currentLanguage = 'en';
    }
    return currentLanguage;
};

/**
 * Helper: get the correct field based on language
 * Usage: localized(item, 'title') → returns item.title or item.title_es
 */
export const localized = (item, field) => {
    if (!item) return '';
    if (currentLanguage === 'es') {
        const esField = `${field}_es`;
        return item[esField] || item[field] || '';
    }
    return item[field] || '';
};

export default { t, getLanguage, setLanguage, loadLanguage, localized };
