// ============================================================
// helpers.js — MigraGuide USA
// Funciones utilitarias globales
// ============================================================

/**
 * Normaliza texto para búsqueda (minúsculas, sin acentos)
 */
export const normalizeText = (text) => {
    if (!text) return '';
    return text
        .toString()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
};

/**
 * Formatea bytes a MB legible
 */
export const formatBytes = (bytes) => {
    if (!bytes || bytes === 0) return '0 KB';
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

/**
 * Formatea una fecha ISO a texto legible en español
 */
export const formatDate = (isoString) => {
    if (!isoString) return '';
    try {
        const date = new Date(isoString);
        return date.toLocaleDateString('es-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    } catch {
        return isoString;
    }
};

/**
 * Formatea una fecha relativa (hace X días)
 */
export const formatRelativeDate = (isoString) => {
    if (!isoString) return '';
    try {
        const date = new Date(isoString);
        const now = new Date();
        const diffMs = now - date;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Hoy';
        if (diffDays === 1) return 'Ayer';
        if (diffDays < 7) return `Hace ${diffDays} días`;
        if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
        return formatDate(isoString);
    } catch {
        return '';
    }
};

/**
 * Trunca texto a un número máximo de caracteres
 */
export const truncateText = (text, maxLength = 120) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
};

/**
 * Compara dos versiones semánticas (ej: "1.2.0" vs "1.3.0")
 * Retorna true si serverVersion > localVersion
 */
export const isNewerVersion = (serverVersion, localVersion) => {
    if (!serverVersion || !localVersion) return false;
    const parse = (v) => v.split('.').map(Number);
    const [sM, sm, sp] = parse(serverVersion);
    const [lM, lm, lp] = parse(localVersion);
    if (sM !== lM) return sM > lM;
    if (sm !== lm) return sm > lm;
    return sp > lp;
};
