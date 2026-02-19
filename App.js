// ============================================================
// App.js — MigraGuide USA
// Entry point — inicialización Local-First con Supabase
// ============================================================
import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { MD3LightTheme, Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

import AppNavigator from './src/navigation/AppNavigator';
import { AppProvider } from './src/context/AppContext';
import LawsIndexService from './src/services/LawsIndexService';
import OfflineService from './src/services/OfflineService';
import { downloadLawContent } from './src/services/LawService';
import { COLORS, STORAGE_KEYS } from './src/utils/constants';
import { isNewerVersion } from './src/utils/helpers';

const theme = {
    ...MD3LightTheme,
    colors: {
        ...MD3LightTheme.colors,
        primary: COLORS.primary,
        secondary: COLORS.accent,
        error: COLORS.error,
    },
};

export default function App() {
    const [isInitializing, setIsInitializing] = useState(true);
    const [initStatus, setInitStatus] = useState('Iniciando...');
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [appContextReady, setAppContextReady] = useState({
        hasNewLaws: false,
        newAppVersion: null,
    });

    useEffect(() => {
        initializeApp();
    }, []);

    const initializeApp = async () => {
        try {
            // 1. ¿Primera vez?
            const onboardingDone = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_DONE);
            if (!onboardingDone) {
                setShowOnboarding(true);
                await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_DONE, 'true');
            }

            // 2. ¿Tiene índice local?
            const hasIndex = await LawsIndexService.hasLocalIndex();
            if (!hasIndex) {
                setInitStatus('Descargando índice de leyes...');
                await LawsIndexService.downloadFullIndex();
            } else {
                setInitStatus('Verificando actualizaciones...');
                // Chequeo en background — 1 sola lectura a system_metadata
                LawsIndexService.checkAndUpdateIndex()
                    .then((result) => {
                        if (result.hasNewLaws) {
                            setAppContextReady((prev) => ({ ...prev, hasNewLaws: true }));
                        }
                        // Verificar versión de la app
                        const localVersion = Constants.expoConfig?.version || '1.0.0';
                        if (result.latestAppVersion && isNewerVersion(result.latestAppVersion, localVersion)) {
                            setAppContextReady((prev) => ({ ...prev, newAppVersion: result.latestAppVersion }));
                        }
                    })
                    .catch((err) => console.error('Background check error:', err));
            }

            // 3. Descarga prioritaria (solo si no está offline ya)
            setInitStatus('Preparando contenido esencial...');
            ensureEssentialLawsDownloaded();

            setIsInitializing(false);
        } catch (error) {
            console.error('App init error:', error);
            setIsInitializing(false);
        }
    };

    const ensureEssentialLawsDownloaded = async () => {
        try {
            // Solo descarga la Constitución automáticamente (como AppLeyes)
            const essentialLawId = 'us_constitution';
            const isAlreadyOffline = await OfflineService.isLawOffline(essentialLawId);
            if (!isAlreadyOffline) {
                console.log('[App] Background download: US Constitution');
                await downloadLawContent(essentialLawId);
            }
        } catch (error) {
            console.log('[App] Could not download essential law:', error.message);
        }
    };

    if (isInitializing) {
        return (
            <SafeAreaProvider>
                <PaperProvider theme={theme}>
                    <View style={styles.loadingContainer}>
                        <Text style={styles.loadingLogo}>🇺🇸</Text>
                        <Text style={styles.loadingAppName}>MigraGuide USA</Text>
                        <ActivityIndicator size="large" color={COLORS.accent} style={{ marginTop: 24 }} />
                        <Text style={styles.loadingText}>{initStatus}</Text>
                        <Text style={styles.loadingSubtext}>Solo ocurre la primera vez</Text>
                    </View>
                </PaperProvider>
            </SafeAreaProvider>
        );
    }

    return (
        <SafeAreaProvider>
            <AppProvider initialHasNewLaws={appContextReady.hasNewLaws} initialNewVersion={appContextReady.newAppVersion}>
                <PaperProvider theme={theme}>
                    <AppNavigator showOnboarding={showOnboarding} />
                </PaperProvider>
            </AppProvider>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.primaryDark,
        padding: 24,
    },
    loadingLogo: { fontSize: 64 },
    loadingAppName: {
        fontSize: 28,
        fontWeight: '800',
        color: '#FFF',
        marginTop: 12,
        letterSpacing: 0.5,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 15,
        color: COLORS.accent,
        fontWeight: '600',
    },
    loadingSubtext: {
        marginTop: 6,
        fontSize: 12,
        color: 'rgba(255,255,255,0.5)',
    },
});
