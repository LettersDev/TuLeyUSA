// ============================================================
// AppContext.js — MigraGuide USA
// Global state: favorites, history, language, notifications
// ============================================================
import React, { createContext, useContext, useState, useEffect } from 'react';
import FavoritesService from '../services/FavoritesService';
import HistoryService from '../services/HistoryService';
import { loadLanguage, setLanguage as setLang, getLanguage } from '../utils/i18n';

const AppContext = createContext(null);

export const AppProvider = ({ children, initialHasNewLaws = false, initialNewVersion = null }) => {
    const [favorites, setFavorites] = useState([]);
    const [history, setHistory] = useState([]);
    const [hasNewLaws, setHasNewLaws] = useState(initialHasNewLaws);
    const [newAppVersion, setNewAppVersion] = useState(initialNewVersion);
    const [language, setLanguageState] = useState('en');

    useEffect(() => {
        loadInitialData();
    }, []);

    // Sync state if props change (useful during app init/re-init)
    useEffect(() => {
        if (initialHasNewLaws) setHasNewLaws(true);
        if (initialNewVersion) setNewAppVersion(initialNewVersion);
    }, [initialHasNewLaws, initialNewVersion]);

    const loadInitialData = async () => {
        try {
            const [favs, hist] = await Promise.all([
                FavoritesService.getAll(),
                HistoryService.getAll(),
            ]);
            setFavorites(favs);
            setHistory(hist);

            // Load saved language preference
            const savedLang = await loadLanguage();
            setLanguageState(savedLang);

            // Check local has_new_laws flag if not already set by props
            if (!hasNewLaws) {
                const localHasNew = await AsyncStorage.getItem('has_new_laws');
                if (localHasNew === 'true') setHasNewLaws(true);
            }
        } catch (error) {
            console.error('[AppContext] Error loading initial data:', error);
            // Gracefully continue with defaults to avoid crashing the app
        }
    };

    const toggleFavorite = async (item) => {
        const { favorites: updated, isFavorite } = await FavoritesService.toggle(item);
        setFavorites(updated);
        return isFavorite;
    };

    const isFavorite = (itemId) => favorites.some((f) => f.id === itemId);

    const addToHistory = async (item) => {
        const updated = await HistoryService.addEntry(item);
        setHistory(updated);
    };

    const removeFromHistory = async (id) => {
        const updated = await HistoryService.removeEntry(id);
        setHistory(updated);
    };

    const clearHistory = async () => {
        await HistoryService.clearAll();
        setHistory([]);
    };

    const markUpdatesAsSeen = async () => {
        await AsyncStorage.setItem('has_new_laws', 'false');
        setHasNewLaws(false);
    };

    const setLanguage = async (lang) => {
        await setLang(lang);
        setLanguageState(lang);
    };

    const toggleLanguage = async () => {
        const newLang = language === 'en' ? 'es' : 'en';
        await setLanguage(newLang);
    };

    return (
        <AppContext.Provider
            value={{
                favorites,
                history,
                hasNewLaws,
                setHasNewLaws,
                markUpdatesAsSeen,
                newAppVersion,
                setNewAppVersion,
                toggleFavorite,
                isFavorite,
                addToHistory,
                removeFromHistory,
                clearHistory,
                language,
                setLanguage,
                toggleLanguage,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error('useApp must be used within AppProvider');
    return ctx;
};
