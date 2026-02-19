// ============================================================
// FavoritesService.js — MigraGuide USA
// Gestiona favoritos en AsyncStorage
// ============================================================
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../utils/constants';

const FavoritesService = {
    getAll: async () => {
        try {
            const data = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITES);
            return data ? JSON.parse(data) : [];
        } catch {
            return [];
        }
    },

    add: async (item) => {
        try {
            const favorites = await FavoritesService.getAll();
            const exists = favorites.some((f) => f.id === item.id);
            if (exists) return favorites;
            const updated = [{ ...item, savedAt: new Date().toISOString() }, ...favorites];
            await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(updated));
            return updated;
        } catch (error) {
            console.error('[Favorites] Error adding:', error);
            return [];
        }
    },

    remove: async (itemId) => {
        try {
            const favorites = await FavoritesService.getAll();
            const updated = favorites.filter((f) => f.id !== itemId);
            await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(updated));
            return updated;
        } catch (error) {
            console.error('[Favorites] Error removing:', error);
            return [];
        }
    },

    isFavorite: async (itemId) => {
        try {
            const favorites = await FavoritesService.getAll();
            return favorites.some((f) => f.id === itemId);
        } catch {
            return false;
        }
    },

    toggle: async (item) => {
        const isFav = await FavoritesService.isFavorite(item.id);
        if (isFav) {
            return { favorites: await FavoritesService.remove(item.id), isFavorite: false };
        } else {
            return { favorites: await FavoritesService.add(item), isFavorite: true };
        }
    },
};

export default FavoritesService;
