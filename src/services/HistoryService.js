// ============================================================
// HistoryService.js — MigraGuide USA
// Gestiona historial de lectura en AsyncStorage (máx 50 entradas)
// ============================================================
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../utils/constants';

const MAX_HISTORY = 50;

const HistoryService = {
    getAll: async () => {
        try {
            const data = await AsyncStorage.getItem(STORAGE_KEYS.HISTORY);
            return data ? JSON.parse(data) : [];
        } catch {
            return [];
        }
    },

    addEntry: async (item) => {
        try {
            let history = await HistoryService.getAll();
            // Remover entrada duplicada si existe
            history = history.filter((h) => h.id !== item.id);
            // Agregar al inicio
            history.unshift({ ...item, readAt: new Date().toISOString() });
            // Limitar a MAX_HISTORY
            if (history.length > MAX_HISTORY) {
                history = history.slice(0, MAX_HISTORY);
            }
            await AsyncStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
            return history;
        } catch (error) {
            console.error('[History] Error adding entry:', error);
            return [];
        }
    },

    clearAll: async () => {
        try {
            await AsyncStorage.removeItem(STORAGE_KEYS.HISTORY);
            return true;
        } catch {
            return false;
        }
    },

    getRecent: async (limit = 10) => {
        const history = await HistoryService.getAll();
        return history.slice(0, limit);
    },
};

export default HistoryService;
