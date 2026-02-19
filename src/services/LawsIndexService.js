// ============================================================
// LawsIndexService.js — MigraGuide USA
// Gestiona el índice local de leyes (Local-First con Supabase)
// Costo mínimo: 1 lectura de system_metadata al día
// ============================================================
import * as FileSystem from 'expo-file-system/legacy';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../config/supabaseClient';
import { STORAGE_KEYS } from '../utils/constants';
import { normalizeText } from '../utils/helpers';

const LAWS_INDEX_FILE = `${FileSystem.documentDirectory}laws_index.json`;

const LawsIndexService = {
    /**
     * Inicializa el índice al arrancar la app.
     * Si no hay índice local → descarga completo.
     * Si hay → chequea metadata (1 lectura) para ver si hay actualizaciones.
     */
    initialize: async () => {
        try {
            const hasIndex = await LawsIndexService.hasLocalIndex();
            if (!hasIndex) {
                console.log('[Index] No local index, downloading...');
                return await LawsIndexService.downloadFullIndex();
            }

            const shouldUpdate = await LawsIndexService.shouldCheckForUpdates();
            if (shouldUpdate) {
                console.log('[Index] Checking for updates...');
                await LawsIndexService.checkAndUpdateIndex();
            }
            return true;
        } catch (error) {
            console.error('[Index] Error initializing:', error);
            return false;
        }
    },

    hasLocalIndex: async () => {
        try {
            const fileInfo = await FileSystem.getInfoAsync(LAWS_INDEX_FILE);
            return fileInfo.exists;
        } catch {
            return false;
        }
    },

    /**
     * Descarga solo los metadatos de las leyes (sin artículos).
     * Columnas: id, title, category, type, article_count, searchable_text
     */
    downloadFullIndex: async () => {
        try {
            const { data: laws, error } = await supabase
                .from('laws')
                .select('id, title, title_es, category, type, article_count, searchable_text, searchable_text_es, last_updated');

            if (error) throw error;

            const indexData = {
                version: '1.0.0',
                lastUpdated: new Date().toISOString(),
                lawCount: laws.length,
                laws: laws,
            };

            await FileSystem.writeAsStringAsync(LAWS_INDEX_FILE, JSON.stringify(indexData));
            await AsyncStorage.setItem(STORAGE_KEYS.LAWS_LAST_SYNC, new Date().toISOString());
            await AsyncStorage.setItem(STORAGE_KEYS.HAS_NEW_LAWS, 'false');

            console.log(`[Index] Downloaded: ${laws.length} laws`);
            return true;
        } catch (error) {
            console.error('[Index] Error downloading index:', error);
            return false;
        }
    },

    getAllLawsLocal: async () => {
        try {
            const fileInfo = await FileSystem.getInfoAsync(LAWS_INDEX_FILE);
            if (!fileInfo.exists) return null;
            const content = await FileSystem.readAsStringAsync(LAWS_INDEX_FILE);
            const indexData = JSON.parse(content);
            return indexData.laws || [];
        } catch (error) {
            console.error('[Index] Error reading local index:', error);
            return null;
        }
    },

    getLawsByCategoryLocal: async (category) => {
        const laws = await LawsIndexService.getAllLawsLocal();
        if (!laws) return null;
        return laws.filter((law) => law.category === category);
    },

    searchLawsLocal: async (searchText) => {
        const laws = await LawsIndexService.getAllLawsLocal();
        if (!laws) return null;
        const searchNorm = normalizeText(searchText);
        return laws.filter(
            (law) =>
                normalizeText(law.title).includes(searchNorm) ||
                normalizeText(law.title_es || '').includes(searchNorm) ||
                normalizeText(law.searchable_text).includes(searchNorm) ||
                normalizeText(law.searchable_text_es || '').includes(searchNorm)
        );
    },

    shouldCheckForUpdates: async () => {
        try {
            const lastSync = await AsyncStorage.getItem(STORAGE_KEYS.LAWS_LAST_SYNC);
            if (!lastSync) return true;
            const hoursSinceSync = (Date.now() - new Date(lastSync).getTime()) / (1000 * 60 * 60);
            return hoursSinceSync >= 24;
        } catch {
            return true;
        }
    },

    /**
     * Chequeo de actualizaciones: 1 sola lectura a system_metadata.
     * Si el timestamp del servidor difiere del local → descarga índice nuevo.
     */
    checkAndUpdateIndex: async () => {
        try {
            const { data, error } = await supabase
                .from('system_metadata')
                .select('laws_last_updated, latest_app_version, last_upload_count')
                .eq('id', 'main')
                .maybeSingle();

            if (error) {
                console.warn('[Index] No system_metadata found, skipping update check.');
                await AsyncStorage.setItem(STORAGE_KEYS.LAWS_LAST_SYNC, new Date().toISOString());
                return { hasNewLaws: false };
            }

            const serverTimestamp = data.laws_last_updated;
            const localTimestamp = await AsyncStorage.getItem(STORAGE_KEYS.LAWS_SERVER_TIMESTAMP);

            if (localTimestamp === serverTimestamp) {
                console.log('[Index] Index up to date.');
                await AsyncStorage.setItem(STORAGE_KEYS.LAWS_LAST_SYNC, new Date().toISOString());
                return { hasNewLaws: false, latestAppVersion: data.latest_app_version };
            }

            console.log('[Index] Server has updates, downloading new index...');
            await AsyncStorage.setItem(STORAGE_KEYS.HAS_NEW_LAWS, 'true');
            await LawsIndexService.downloadFullIndex();
            await AsyncStorage.setItem(STORAGE_KEYS.LAWS_SERVER_TIMESTAMP, serverTimestamp);

            return {
                hasNewLaws: true,
                newCount: data.last_upload_count || 0,
                latestAppVersion: data.latest_app_version,
            };
        } catch (error) {
            console.error('[Index] Error checking updates:', error);
            return { hasNewLaws: false, error: true };
        }
    },

    hasNewLawsNotification: async () => {
        try {
            const hasNew = await AsyncStorage.getItem(STORAGE_KEYS.HAS_NEW_LAWS);
            return hasNew === 'true';
        } catch {
            return false;
        }
    },

    clearNewLawsNotification: async () => {
        await AsyncStorage.setItem(STORAGE_KEYS.HAS_NEW_LAWS, 'false');
    },

    getLastSyncTime: async () => {
        try {
            const lastSync = await AsyncStorage.getItem(STORAGE_KEYS.LAWS_LAST_SYNC);
            return lastSync ? new Date(lastSync) : null;
        } catch {
            return null;
        }
    },

    getIndexStats: async () => {
        try {
            const fileInfo = await FileSystem.getInfoAsync(LAWS_INDEX_FILE);
            if (!fileInfo.exists) return { exists: false };
            const content = await FileSystem.readAsStringAsync(LAWS_INDEX_FILE);
            const indexData = JSON.parse(content);
            const lastSync = await LawsIndexService.getLastSyncTime();
            return {
                exists: true,
                lawCount: indexData.lawCount || indexData.laws?.length || 0,
                version: indexData.version,
                lastUpdated: indexData.lastUpdated,
                lastSync,
                fileSizeBytes: fileInfo.size,
            };
        } catch {
            return { exists: false };
        }
    },

    forceRefresh: async () => {
        return await LawsIndexService.downloadFullIndex();
    },
};

export default LawsIndexService;
