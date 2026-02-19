// ============================================================
// HomeScreen.jsx — MigraGuide USA
// ============================================================
import React, { useEffect, useState } from 'react';
import {
    View, Text, ScrollView, TouchableOpacity, StyleSheet,
    StatusBar, FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { COLORS, CATEGORIES } from '../utils/constants';
import { formatRelativeDate } from '../utils/helpers';
import { t } from '../utils/i18n';

export default function HomeScreen({ navigation }) {
    const { history, hasNewLaws, newAppVersion, language, toggleLanguage } = useApp();
    const recentHistory = history.slice(0, 6);

    const handleCategoryPress = (category) => {
        const label = language === 'es' ? category.label : (category.labelEn || category.label);
        navigation.navigate('LawsList', { categoryId: category.id, categoryLabel: label });
    };

    const handleHistoryItem = (item) => {
        navigation.navigate('LawDetail', { lawId: item.id, lawTitle: item.title });
    };

    const getCategoryLabel = (category) => {
        return language === 'es' ? category.label : (category.labelEn || category.label);
    };

    const renderCategory = (category) => (
        <TouchableOpacity
            key={category.id}
            style={styles.categoryCard}
            onPress={() => handleCategoryPress(category)}
            activeOpacity={0.85}
        >
            <LinearGradient colors={category.gradient} style={styles.categoryGradient}>
                <MaterialCommunityIcons name={category.icon} size={28} color="#FFF" />
                <Text style={styles.categoryLabel}>{getCategoryLabel(category)}</Text>
            </LinearGradient>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} />

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <LinearGradient
                    colors={[COLORS.primaryDark, COLORS.primary]}
                    style={styles.header}
                >
                    <View style={styles.headerRow}>
                        <View>
                            <Text style={styles.headerGreeting}>{t('home.title')}</Text>
                            <Text style={styles.headerTitle}>MigraGuide USA 🇺🇸</Text>
                        </View>
                        <View style={styles.headerButtons}>
                            {/* Language Toggle */}
                            <TouchableOpacity
                                style={styles.langButton}
                                onPress={toggleLanguage}
                            >
                                <Text style={styles.langButtonText}>{t('general.language')}</Text>
                            </TouchableOpacity>
                            {/* AI Button */}
                            <TouchableOpacity
                                style={styles.aiButton}
                                onPress={() => navigation.navigate('Search')}
                            >
                                <MaterialCommunityIcons name="robot" size={22} color={COLORS.accent} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <Text style={styles.headerSub}>{t('home.subtitle')}</Text>
                </LinearGradient>

                {/* New version available */}
                {newAppVersion && (
                    <View style={styles.updateBanner}>
                        <MaterialCommunityIcons name="update" size={18} color={COLORS.accent} />
                        <Text style={styles.updateText}>
                            {language === 'es'
                                ? `Nueva versión ${newAppVersion} disponible en la tienda`
                                : `New version ${newAppVersion} available in the store`}
                        </Text>
                    </View>
                )}

                {/* New laws available */}
                {hasNewLaws && (
                    <View style={styles.newLawsBanner}>
                        <MaterialCommunityIcons name="new-box" size={18} color={COLORS.success} />
                        <Text style={styles.newLawsText}>
                            {language === 'es'
                                ? 'Hay nuevas leyes disponibles — abre una categoría para verlas'
                                : 'New laws are available — open a category to view them'}
                        </Text>
                    </View>
                )}

                {/* Categories */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('home.categories')}</Text>
                    <View style={styles.categoriesGrid}>
                        {CATEGORIES.map(renderCategory)}
                    </View>
                </View>

                {/* Recent history */}
                {recentHistory.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{t('home.recent')}</Text>
                        {recentHistory.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                style={styles.historyCard}
                                onPress={() => handleHistoryItem(item)}
                                activeOpacity={0.85}
                            >
                                <MaterialCommunityIcons name="book-open-variant" size={20} color={COLORS.primary} />
                                <View style={styles.historyContent}>
                                    <Text style={styles.historyTitle} numberOfLines={1}>{item.title}</Text>
                                    <Text style={styles.historyDate}>{formatRelativeDate(item.readAt)}</Text>
                                </View>
                                <MaterialCommunityIcons name="chevron-right" size={18} color={COLORS.textLight} />
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                {/* Disclaimer */}
                <View style={styles.disclaimerCard}>
                    <MaterialCommunityIcons name="information-outline" size={16} color={COLORS.textLight} />
                    <Text style={styles.disclaimerText}>{t('disclaimer')}</Text>
                </View>

                <View style={{ height: 24 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    header: {
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 28,
    },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    headerGreeting: { fontSize: 13, color: 'rgba(255,255,255,0.65)', marginBottom: 2 },
    headerTitle: { fontSize: 22, fontWeight: '800', color: '#FFF' },
    headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 6 },
    headerButtons: { flexDirection: 'row', gap: 8, alignItems: 'center' },
    langButton: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 10,
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    langButtonText: {
        color: '#FFF',
        fontSize: 13,
        fontWeight: '700',
    },
    aiButton: {
        width: 42,
        height: 42,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.12)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(201,168,76,0.4)',
    },
    updateBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#FFF8E1',
        marginHorizontal: 16,
        marginTop: 12,
        padding: 12,
        borderRadius: 10,
        borderLeftWidth: 3,
        borderLeftColor: COLORS.accent,
    },
    updateText: { fontSize: 13, color: '#5D4037', flex: 1 },
    newLawsBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#E8F5E9',
        marginHorizontal: 16,
        marginTop: 8,
        padding: 12,
        borderRadius: 10,
        borderLeftWidth: 3,
        borderLeftColor: COLORS.success,
    },
    newLawsText: { fontSize: 13, color: '#1B5E20', flex: 1 },
    section: { paddingHorizontal: 16, marginTop: 20 },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: 14,
    },
    categoriesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    categoryCard: {
        width: '47%',
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
    },
    categoryGradient: {
        paddingVertical: 20,
        paddingHorizontal: 14,
        alignItems: 'flex-start',
        gap: 10,
        minHeight: 90,
    },
    categoryLabel: {
        fontSize: 15,
        fontWeight: '700',
        color: '#FFF',
    },
    historyCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        borderRadius: 12,
        padding: 14,
        marginBottom: 8,
        gap: 12,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
    },
    historyContent: { flex: 1 },
    historyTitle: { fontSize: 14, fontWeight: '600', color: COLORS.text },
    historyDate: { fontSize: 11, color: COLORS.textLight, marginTop: 2 },
    disclaimerCard: {
        flexDirection: 'row',
        gap: 8,
        marginHorizontal: 16,
        marginTop: 16,
        padding: 12,
        backgroundColor: COLORS.surfaceVariant,
        borderRadius: 10,
    },
    disclaimerText: {
        flex: 1,
        fontSize: 11,
        color: COLORS.textSecondary,
        lineHeight: 17,
    },
});
