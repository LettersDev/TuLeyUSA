// ============================================================
// OnboardingScreen.jsx — MigraGuide USA
// ============================================================
import React from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../utils/constants';
import { t } from '../utils/i18n';

const FEATURES_EN = [
    { icon: 'shield-account', title: 'Asylum & Protection', desc: 'Learn your rights under U.S. asylum laws.' },
    { icon: 'card-account-details', title: 'Visa Types', desc: 'Understand the differences between work, family, and other visas.' },
    { icon: 'robot', title: 'AI Explanations', desc: 'AI explains any legal article in simple language.' },
    { icon: 'wifi-off', title: 'Works Offline', desc: 'Download laws and access them offline when you need them most.' },
];

const FEATURES_ES = [
    { icon: 'shield-account', title: 'Asilo y Protección', desc: 'Aprende tus derechos bajo las leyes de asilo de EE.UU.' },
    { icon: 'card-account-details', title: 'Tipos de Visas', desc: 'Entiende las diferencias entre visas de trabajo, familia y más.' },
    { icon: 'robot', title: 'IA Explicativa', desc: 'La IA explica cualquier artículo en lenguaje simple.' },
    { icon: 'wifi-off', title: 'Funciona Sin Internet', desc: 'Descarga leyes y accede offline cuando más lo necesites.' },
];

export default function OnboardingScreen({ navigation }) {
    const handleStart = () => {
        navigation.replace('MainTabs');
    };

    // Use English features by default (the i18n module defaults to 'en')
    const features = FEATURES_EN;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.primaryDark }}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} />
            <ScrollView contentContainerStyle={styles.container} bounces={false}>
                {/* Hero */}
                <LinearGradient
                    colors={[COLORS.primaryDark, COLORS.primary]}
                    style={styles.hero}
                >
                    <MaterialCommunityIcons name="flag-variant" size={64} color={COLORS.accent} />
                    <Text style={styles.appName}>MigraGuide USA</Text>
                    <Text style={styles.tagline}>{t('home.subtitle')}</Text>
                </LinearGradient>

                {/* Features */}
                <View style={styles.featuresContainer}>
                    {features.map((f, i) => (
                        <View key={i} style={styles.featureRow}>
                            <View style={styles.featureIcon}>
                                <MaterialCommunityIcons name={f.icon} size={26} color={COLORS.accent} />
                            </View>
                            <View style={styles.featureText}>
                                <Text style={styles.featureTitle}>{f.title}</Text>
                                <Text style={styles.featureDesc}>{f.desc}</Text>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Disclaimer */}
                <View style={styles.disclaimerBox}>
                    <MaterialCommunityIcons name="information-outline" size={18} color={COLORS.warning} />
                    <Text style={styles.disclaimerText}>{t('disclaimer')}</Text>
                </View>

                {/* CTA */}
                <TouchableOpacity style={styles.startButton} onPress={handleStart} activeOpacity={0.85}>
                    <LinearGradient
                        colors={[COLORS.accent, '#B8860B']}
                        style={styles.startGradient}
                    >
                        <Text style={styles.startText}>{t('onboarding.start')}</Text>
                        <MaterialCommunityIcons name="arrow-right" size={22} color="#FFF" />
                    </LinearGradient>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flexGrow: 1 },
    hero: {
        alignItems: 'center',
        paddingVertical: 48,
        paddingHorizontal: 24,
        gap: 12,
    },
    appName: {
        fontSize: 32,
        fontWeight: '800',
        color: '#FFF',
        letterSpacing: 0.5,
        marginTop: 8,
    },
    tagline: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.75)',
        textAlign: 'center',
    },
    featuresContainer: {
        padding: 24,
        gap: 20,
        backgroundColor: COLORS.background,
    },
    featureRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 16,
    },
    featureIcon: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: COLORS.primaryDark,
        justifyContent: 'center',
        alignItems: 'center',
    },
    featureText: { flex: 1 },
    featureTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: 2,
    },
    featureDesc: {
        fontSize: 13,
        color: COLORS.textSecondary,
        lineHeight: 19,
    },
    disclaimerBox: {
        flexDirection: 'row',
        gap: 10,
        backgroundColor: '#FFF8E1',
        marginHorizontal: 24,
        marginVertical: 16,
        padding: 14,
        borderRadius: 12,
        borderLeftWidth: 3,
        borderLeftColor: COLORS.warning,
    },
    disclaimerText: {
        flex: 1,
        fontSize: 12,
        color: '#5D4037',
        lineHeight: 18,
    },
    startButton: {
        marginHorizontal: 24,
        marginBottom: 32,
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 4,
    },
    startGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        gap: 10,
    },
    startText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFF',
    },
});
