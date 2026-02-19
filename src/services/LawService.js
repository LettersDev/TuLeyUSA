// ============================================================
// LawService.js — MigraGuide USA
// Servicio de leyes con patrón Local-First (Supabase)
// ============================================================
import { supabase } from '../config/supabaseClient';
import OfflineService from './OfflineService';
import LawsIndexService from './LawsIndexService';
import { normalizeText } from '../utils/helpers';

/**
 * Obtener todas las leyes — LOCAL FIRST
 */
export const getAllLaws = async () => {
    const localLaws = await LawsIndexService.getAllLawsLocal();
    if (localLaws && localLaws.length > 0) return localLaws;

    const { data, error } = await supabase
        .from('laws')
        .select('id, title, title_es, category, type, article_count, searchable_text, searchable_text_es');
    if (error) throw error;
    return data;
};

/**
 * Obtener leyes por categoría — LOCAL FIRST
 */
export const getLawsByCategory = async (category) => {
    const localLaws = await LawsIndexService.getLawsByCategoryLocal(category);
    if (localLaws && localLaws.length > 0) return localLaws;

    const { data, error } = await supabase
        .from('laws')
        .select('id, title, title_es, category, type, article_count, searchable_text, searchable_text_es')
        .eq('category', category);
    if (error) throw error;
    return data;
};

/**
 * Obtener metadata de una ley — LOCAL FIRST
 */
export const getLawById = async (lawId) => {
    // Intentar desde el índice local primero
    const allLaws = await LawsIndexService.getAllLawsLocal();
    if (allLaws) {
        const found = allLaws.find((l) => l.id === lawId);
        if (found) return found;
    }

    const { data, error } = await supabase
        .from('laws')
        .select('*')
        .eq('id', lawId)
        .maybeSingle();
    if (error) throw error;
    return data;
};

/**
 * Obtener artículos de una ley — LOCAL FIRST con paginación
 */
export const getLawItems = async (lawId, lastIndex = -1, pageSize = 50) => {
    // Intentar desde el File System
    const offlineLaw = await OfflineService.getLaw(lawId);
    if (offlineLaw && offlineLaw.items) {
        return offlineLaw.items
            .filter((item) => item.index > lastIndex)
            .slice(0, pageSize);
    }

    // Fallback a Supabase
    const { data, error } = await supabase
        .from('law_items')
        .select('id, index, number, title, title_es, text, text_es')
        .eq('law_id', lawId)
        .gt('index', lastIndex)
        .order('index', { ascending: true })
        .limit(pageSize);

    if (error) throw error;
    return data;
};

/**
 * Descargar todos los artículos de una ley para uso offline
 */
export const downloadLawContent = async (lawId) => {
    try {
        const metadata = await getLawById(lawId);

        const { data: items, error } = await supabase
            .from('law_items')
            .select('id, index, number, title, title_es, text, text_es')
            .eq('law_id', lawId)
            .order('index', { ascending: true });

        if (error) throw error;

        const fullData = {
            metadata,
            items,
            downloadedAt: new Date().toISOString(),
        };

        return await OfflineService.saveLaw(lawId, fullData);
    } catch (error) {
        console.error('[LawService] Error downloading law:', error);
        return false;
    }
};

/**
 * Búsqueda global de artículos — Full Text Search en Supabase (PostgreSQL)
 */
export const searchLawsGlobal = async (query) => {
    try {
        const { data, error } = await supabase.rpc('search_laws', { query });
        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('[LawService] Error in global search:', error);
        return [];
    }
};

/**
 * Búsqueda en el índice local (instantánea, 0 lecturas de Supabase)
 */
export const searchLawsLocal = async (searchText) => {
    return await LawsIndexService.searchLawsLocal(searchText);
};

/**
 * Buscar artículos dentro de una ley descargada
 */
export const searchLawItemsLocal = async (lawId, searchText) => {
    const offlineLaw = await OfflineService.getLaw(lawId);
    if (!offlineLaw || !offlineLaw.items) return [];

    const searchNorm = normalizeText(searchText);
    return offlineLaw.items
        .filter(
            (item) =>
                normalizeText(item.text).includes(searchNorm) ||
                normalizeText(item.title).includes(searchNorm) ||
                normalizeText(item.text_es || '').includes(searchNorm) ||
                normalizeText(item.title_es || '').includes(searchNorm)
        )
        .slice(0, 50);
};
