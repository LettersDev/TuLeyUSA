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
    const [hasNewLaws, setHasNewLaws] = useState(false);
    const [newAppVersion, setNewAppVersion] = useState(null);
    const [language, setLanguageState] = useState('en');

    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = async () => {
        const [favs, hist] = await Promise.all([
            FavoritesService.getAll(),
            HistoryService.getAll(),
        ]);
        setFavorites(favs);
        setHistory(hist);

        // Load saved language preference
        const savedLang = await loadLanguage();
        setLanguageState(savedLang);
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

    const clearHistory = async () => {
        await HistoryService.clearAll();
        setHistory([]);
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
                newAppVersion,
                setNewAppVersion,
                toggleFavorite,
                isFavorite,
                addToHistory,
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
