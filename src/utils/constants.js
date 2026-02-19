// ============================================================
// constants.js — MigraGuide USA
// Colores, categorías y textos globales de la aplicación
// ============================================================

export const COLORS = {
    // Paleta principal: Azul marino profundo + Dorado
    primary: '#1A3A6B',        // Azul marino profundo
    primaryLight: '#2A5298',   // Azul medio
    primaryDark: '#0A1628',    // Azul muy oscuro (fondo splash)
    accent: '#C9A84C',         // Dorado
    accentLight: '#F0C96A',    // Dorado claro

    // Fondos
    background: '#F5F7FA',     // Gris muy claro
    surface: '#FFFFFF',        // Blanco
    surfaceVariant: '#EEF2F7', // Gris azulado claro
    card: '#FFFFFF',

    // Texto
    text: '#0D1B2A',           // Casi negro
    textSecondary: '#5A6A7E',  // Gris azulado
    textLight: '#8FA3B8',      // Gris claro

    // Semánticos
    success: '#2ECC71',
    warning: '#F39C12',
    error: '#E74C3C',
    info: '#3498DB',

    // Bordes
    border: '#DDE3EC',
    divider: '#EEF2F7',
};

export const CATEGORIES = [
    {
        id: 'asylum',
        label: 'Asilo',
        labelEn: 'Asylum',
        icon: 'shield-account',
        color: '#1A3A6B',
        gradient: ['#1A3A6B', '#2A5298'],
        description: 'Protección para personas perseguidas',
    },
    {
        id: 'visas',
        label: 'Visas',
        labelEn: 'Visas',
        icon: 'card-account-details',
        color: '#1565C0',
        gradient: ['#1565C0', '#1976D2'],
        description: 'Tipos de visas y requisitos',
    },
    {
        id: 'tps',
        label: 'TPS',
        labelEn: 'Temporary Protected Status',
        icon: 'home-heart',
        color: '#6A1B9A',
        gradient: ['#6A1B9A', '#8E24AA'],
        description: 'Estatus de Protección Temporal',
    },
    {
        id: 'citizenship',
        label: 'Ciudadanía',
        labelEn: 'Citizenship',
        icon: 'star-circle',
        color: '#C9A84C',
        gradient: ['#B8860B', '#C9A84C'],
        description: 'Naturalización y ciudadanía',
    },
    {
        id: 'daca',
        label: 'DACA',
        labelEn: 'DACA',
        icon: 'school',
        color: '#00695C',
        gradient: ['#00695C', '#00897B'],
        description: 'Acción Diferida para Llegados en la Infancia',
    },
    {
        id: 'deportation',
        label: 'Deportación',
        labelEn: 'Deportation',
        icon: 'alert-circle',
        color: '#B71C1C',
        gradient: ['#B71C1C', '#C62828'],
        description: 'Derechos y procesos de remoción',
    },
    {
        id: 'work',
        label: 'Trabajo',
        labelEn: 'Work Authorization',
        icon: 'briefcase',
        color: '#E65100',
        gradient: ['#E65100', '#F57C00'],
        description: 'Autorización de empleo',
    },
    {
        id: 'family',
        label: 'Familia',
        labelEn: 'Family',
        icon: 'account-group',
        color: '#2E7D32',
        gradient: ['#2E7D32', '#388E3C'],
        description: 'Peticiones familiares y reunificación',
    },
    {
        id: 'updates',
        label: 'Actualizaciones',
        labelEn: 'Updates',
        icon: 'newspaper-variant-outline',
        color: '#00838F',
        gradient: ['#00838F', '#0097A7'],
        description: 'Últimas noticias y cambios migratorios',
    },
];

export const STORAGE_KEYS = {
    ONBOARDING_DONE: 'onboarding_done',
    FAVORITES: 'favorites',
    HISTORY: 'reading_history',
    GEMINI_USAGE: 'gemini_daily_usage',
    LAWS_LAST_SYNC: 'laws_last_sync',
    LAWS_SERVER_TIMESTAMP: 'laws_server_timestamp',
    HAS_NEW_LAWS: 'has_new_laws',
};

export const GEMINI_DAILY_LIMIT = 10;

export const DISCLAIMER_TEXT =
    'MigraGuide USA is an informational tool. We are not lawyers and do not represent the U.S. government. This information does not constitute legal advice. Always consult a certified immigration attorney for your specific case.';
