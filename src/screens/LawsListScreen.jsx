// ============================================================
// LawsListScreen.jsx — MigraGuide USA
// ============================================================
import React, { useEffect, useState } from 'react';
import {
    View, Text, FlatList, TouchableOpacity, StyleSheet, StatusBar, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, CATEGORIES } from '../utils/constants';
import { getLawsByCategory } from '../services/LawService';
import OfflineService from '../services/OfflineService';
import { t, localized } from '../utils/i18n';
import { useApp } from '../context/AppContext';

export default function LawsListScreen({ navigation, route }) {
    const { categoryId, categoryLabel } = route.params;
    const { language } = useApp();
    const [laws, setLaws] = useState([]);
    const [loading, setLoading] = useState(true);
    const [offlineIds, setOfflineIds] = useState([]);

    const category = CATEGORIES.find((c) => c.id === categoryId);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [lawsData, downloaded] = await Promise.all([
                getLawsByCategory(categoryId),
                OfflineService.getDownloadedLawIds(),
            ]);
            setLaws(lawsData || []);
            setOfflineIds(downloaded);
        } catch (error) {
            console.error('Error loading laws:', error);
            setLaws([]);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }) => {
        const isOffline = offlineIds.includes(item.id);
        const title = localized(item, 'title') || item.title;
        return (
            <TouchableOpacity
                style={styles.lawCard}
                onPress={() => navigation.navigate('LawDetail', { lawId: item.id, lawTitle: title })}
                activeOpacity={0.85}
            >
                <View style={styles.cardLeft}>
                    <MaterialCommunityIcons
                        name={isOffline ? 'check-circle' : 'file-document-outline'}
                        size={24}
                        color={isOffline ? COLORS.success : COLORS.primary}
                    />
                </View>
                <View style={styles.cardContent}>
                    <Text style={styles.lawTitle} numberOfLines={2}>{title}</Text>
                    <View style={styles.metaRow}>
                        {item.type && (
                            <View style={styles.tag}>
                                <Text style={styles.tagText}>{item.type}</Text>
                            </View>
                        )}
                        {item.article_count && (
                            <Text style={styles.articleCount}>
                                {item.article_count} {language === 'es' ? 'artículos' : 'articles'}
                            </Text>
                        )}
                        {isOffline && (
                            <View style={[styles.tag, styles.offlineTag]}>
                                <MaterialCommunityIcons name="wifi-off" size={10} color={COLORS.success} />
                                <Text style={[styles.tagText, { color: COLORS.success }]}>Offline</Text>
                            </View>
                        )}
                    </View>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={20} color={COLORS.textLight} />
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <View style={styles.headerTextBlock}>
                    <Text style={styles.headerTitle}>{categoryLabel}</Text>
                    {!loading && (
                        <Text style={styles.headerSub}>
                            {laws.length} {language === 'es' ? 'leyes disponibles' : 'laws available'}
                        </Text>
                    )}
                </View>
                {category && (
                    <View style={[styles.categoryIcon, { backgroundColor: category.color + '20' }]}>
                        <MaterialCommunityIcons name={category.icon} size={24} color={category.color} />
                    </View>
                )}
            </View>

            {loading ? (
                <View style={styles.loading}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    <Text style={styles.loadingText}>
                        {language === 'es' ? 'Cargando leyes...' : 'Loading laws...'}
                    </Text>
                </View>
            ) : laws.length === 0 ? (
                <View style={styles.emptyState}>
                    <MaterialCommunityIcons name="file-document-outline" size={64} color={COLORS.border} />
                    <Text style={styles.emptyTitle}>
                        {language === 'es' ? 'No hay leyes disponibles' : 'No laws available'}
                    </Text>
                    <Text style={styles.emptyText}>
                        {language === 'es'
                            ? 'Próximamente agregaremos contenido para esta categoría.'
                            : 'Content for this category will be added soon.'}
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={laws}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        gap: 12,
    },
    backBtn: { padding: 4 },
    headerTextBlock: { flex: 1 },
    headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text },
    headerSub: { fontSize: 12, color: COLORS.textSecondary, marginTop: 1 },
    categoryIcon: {
        width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center',
    },
    loading: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
    loadingText: { fontSize: 14, color: COLORS.textSecondary },
    list: { padding: 16, gap: 10 },
    lawCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        borderRadius: 14,
        padding: 14,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
    },
    cardLeft: {
        width: 44, height: 44, borderRadius: 12, backgroundColor: COLORS.surfaceVariant,
        justifyContent: 'center', alignItems: 'center', marginRight: 12,
    },
    cardContent: { flex: 1 },
    lawTitle: { fontSize: 15, fontWeight: '600', color: COLORS.text, marginBottom: 6 },
    metaRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap', alignItems: 'center' },
    tag: {
        backgroundColor: COLORS.surfaceVariant, borderRadius: 6,
        paddingHorizontal: 8, paddingVertical: 2, flexDirection: 'row', alignItems: 'center', gap: 3,
    },
    offlineTag: { backgroundColor: '#E8F5E9' },
    tagText: { fontSize: 10, color: COLORS.textSecondary, fontWeight: '600' },
    articleCount: { fontSize: 11, color: COLORS.textLight },
    emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40, gap: 12 },
    emptyTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text },
    emptyText: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center' },
});
