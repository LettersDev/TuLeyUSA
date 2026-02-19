// ============================================================
// LawDetailScreen.jsx — MigraGuide USA
// ============================================================
import React, { useEffect, useState, useCallback } from 'react';
import {
    View, Text, FlatList, TouchableOpacity, StyleSheet, StatusBar,
    ActivityIndicator, Modal, ScrollView, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../utils/constants';
import { getLawById, getLawItems, downloadLawContent } from '../services/LawService';
import OfflineService from '../services/OfflineService';
import GeminiService from '../services/GeminiService';
import { useApp } from '../context/AppContext';
import { t, localized } from '../utils/i18n';

const PAGE_SIZE = 50;

export default function LawDetailScreen({ navigation, route }) {
    const { lawId, lawTitle } = route.params;
    const { toggleFavorite, isFavorite, addToHistory, language } = useApp();

    const [law, setLaw] = useState(null);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [isOffline, setIsOffline] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [lastIndex, setLastIndex] = useState(-1);
    const [hasMore, setHasMore] = useState(true);
    const [fav, setFav] = useState(false);

    // AI
    const [aiModal, setAiModal] = useState(false);
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [aiResponse, setAiResponse] = useState('');
    const [aiLoading, setAiLoading] = useState(false);
    const [aiRemaining, setAiRemaining] = useState(null);

    useEffect(() => {
        loadLaw();
    }, []);

    const loadLaw = async () => {
        try {
            setLoading(true);
            const [lawData, offline, favStatus, remaining] = await Promise.all([
                getLawById(lawId),
                OfflineService.isLawOffline(lawId),
                isFavorite(lawId),
                GeminiService.getRemainingQueries(),
            ]);
            setLaw(lawData);
            setIsOffline(offline);
            setFav(favStatus);
            setAiRemaining(remaining);
            await loadItems(-1, true);
            await addToHistory({ id: lawId, title: lawTitle || lawData?.title, category: lawData?.category });
        } catch (error) {
            console.warn('[LawDetail] Info: Law not offline/unavailable.', error.message);
        } finally {
            setLoading(false);
        }
    };

    const loadItems = async (fromIndex = lastIndex, reset = false) => {
        try {
            const newItems = await getLawItems(lawId, fromIndex, PAGE_SIZE);
            if (reset) {
                setItems(newItems);
            } else {
                setItems((prev) => [...prev, ...newItems]);
            }
            if (newItems && newItems.length > 0) {
                setLastIndex(newItems[newItems.length - 1].index);
                setHasMore(newItems.length === PAGE_SIZE);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            // Silencio para evitar alertas rojas en Expo durante uso normal offline
            console.log('[LawDetail] No internet or items unavailable.');
            setHasMore(false);
        }
    };

    const handleLoadMore = async () => {
        if (loadingMore || !hasMore) return;
        setLoadingMore(true);
        await loadItems(lastIndex);
        setLoadingMore(false);
    };

    const handleDownload = async () => {
        if (downloading) return;
        setDownloading(true);
        try {
            const success = await downloadLawContent(lawId);
            if (success) {
                setIsOffline(true);
                Alert.alert(
                    language === 'es' ? '✅ Descargado' : '✅ Downloaded',
                    language === 'es'
                        ? `"${lawTitle}" ya está disponible sin internet.`
                        : `"${lawTitle}" is now available offline.`
                );
            } else {
                Alert.alert(
                    'Error',
                    language === 'es' ? 'No se pudo descargar. Verifica tu conexión.' : 'Could not download. Check your connection.'
                );
            }
        } catch {
            Alert.alert('Error', language === 'es' ? 'Error al descargar la ley.' : 'Error downloading the law.');
        } finally {
            setDownloading(false);
        }
    };

    const handleFavorite = async () => {
        const result = await toggleFavorite({ id: lawId, title: lawTitle, category: law?.category });
        setFav(result);
    };

    const handleDeleteDownload = async () => {
        Alert.alert(
            language === 'es' ? 'Eliminar descarga' : 'Delete Download',
            language === 'es'
                ? '¿Estás seguro de que quieres eliminar este contenido offline?'
                : 'Are you sure you want to delete this offline content?',
            [
                { text: t('general.cancel'), style: 'cancel' },
                {
                    text: language === 'es' ? 'Eliminar' : 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        const success = await OfflineService.deleteLaw(lawId);
                        if (success) {
                            setIsOffline(false);
                        }
                    },
                },
            ]
        );
    };

    const handleExplainArticle = async (article) => {
        if (aiRemaining <= 0) {
            Alert.alert(t('ai.limitAlert.title'), t('ai.limitAlert.msg'));
            return;
        }
        setSelectedArticle(article);
        setAiResponse('');
        setAiModal(true);
        setAiLoading(true);
        try {
            const articleTitle = localized(article, 'title') || article.title;
            const articleText = localized(article, 'text') || article.text;
            const response = await GeminiService.explainArticle(articleTitle, articleText, language);
            setAiResponse(response);
            setAiRemaining((prev) => Math.max(0, (prev || 1) - 1));
        } catch (error) {
            if (error.message === 'DAILY_LIMIT_REACHED') {
                setAiResponse(t('ai.limitReached'));
            } else {
                setAiResponse(t('ai.error'));
            }
        } finally {
            setAiLoading(false);
        }
    };

    // Get the localized text for an article item
    const getItemTitle = (item) => localized(item, 'title') || item.title;
    const getItemText = (item) => localized(item, 'text') || item.text;

    const renderItem = useCallback(({ item }) => (
        <View style={styles.articleCard}>
            {item.title && (
                <Text style={styles.articleTitle}>{getItemTitle(item)}</Text>
            )}
            {item.number && (
                <Text style={styles.articleNumber}>
                    {language === 'es' ? 'Art.' : 'Art.'} {item.number}
                </Text>
            )}
            <Text style={styles.articleText}>{getItemText(item)}</Text>
            <TouchableOpacity
                style={styles.explainBtn}
                onPress={() => handleExplainArticle(item)}
                activeOpacity={0.8}
            >
                <MaterialCommunityIcons name="robot" size={14} color={COLORS.accent} />
                <Text style={styles.explainBtnText}>
                    {language === 'es' ? 'Explicar con IA' : 'Explain with AI'}
                </Text>
                {aiRemaining !== null && (
                    <Text style={styles.explainBtnCount}>
                        ({aiRemaining} {language === 'es' ? 'restantes' : 'left'})
                    </Text>
                )}
            </TouchableOpacity>
        </View>
    ), [aiRemaining, language]);

    if (loading) {
        return (
            <SafeAreaView style={[styles.container, styles.centered]}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>{t('detail.loading')}</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} />

            {/* Header */}
            <LinearGradient colors={[COLORS.primaryDark, COLORS.primary]} style={styles.header}>
                <View style={styles.headerRow}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <MaterialCommunityIcons name="arrow-left" size={22} color="#FFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle} numberOfLines={2}>{lawTitle}</Text>
                    <TouchableOpacity onPress={handleFavorite} style={styles.favBtn}>
                        <MaterialCommunityIcons
                            name={fav ? 'bookmark' : 'bookmark-outline'}
                            size={22}
                            color={fav ? COLORS.accent : '#FFF'}
                        />
                    </TouchableOpacity>
                </View>
                {law?.type && (
                    <View style={styles.lawType}>
                        <Text style={styles.lawTypeText}>{law.type}</Text>
                    </View>
                )}
            </LinearGradient>

            {/* Offline Banner */}
            {!isOffline && (
                <TouchableOpacity
                    style={styles.offlineBanner}
                    onPress={handleDownload}
                    disabled={downloading}
                    activeOpacity={0.85}
                >
                    <MaterialCommunityIcons name="cloud-download" size={18} color={COLORS.primary} />
                    <Text style={styles.offlineBannerText}>
                        {downloading
                            ? (language === 'es' ? 'Descargando...' : 'Downloading...')
                            : (language === 'es' ? 'Descargar para usar sin internet' : 'Download for offline use')}
                    </Text>
                    {downloading ? (
                        <ActivityIndicator size="small" color={COLORS.primary} />
                    ) : (
                        <MaterialCommunityIcons name="arrow-right" size={16} color={COLORS.primary} />
                    )}
                </TouchableOpacity>
            )}

            {isOffline && (
                <View style={styles.offlineReady}>
                    <View style={styles.offlineReadyLeft}>
                        <MaterialCommunityIcons name="check-circle" size={16} color={COLORS.success} />
                        <Text style={styles.offlineReadyText}>{t('detail.downloaded')}</Text>
                    </View>
                    <TouchableOpacity onPress={handleDeleteDownload} style={styles.deleteBtn}>
                        <MaterialCommunityIcons name="trash-can-outline" size={18} color={COLORS.error} />
                        <Text style={styles.deleteBtnText}>{language === 'es' ? 'Eliminar' : 'Delete'}</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Articles */}
            <FlatList
                data={items}
                renderItem={renderItem}
                keyExtractor={(item) => item.id || String(item.index)}
                contentContainerStyle={styles.list}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.3}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={
                    loadingMore ? (
                        <View style={styles.loadMoreRow}>
                            <ActivityIndicator size="small" color={COLORS.primary} />
                            <Text style={styles.loadMoreText}>
                                {language === 'es' ? 'Cargando más artículos...' : 'Loading more articles...'}
                            </Text>
                        </View>
                    ) : null
                }
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <MaterialCommunityIcons
                            name={isOffline ? "book-open-outline" : "wifi-off"}
                            size={48}
                            color={COLORS.border}
                        />
                        <Text style={styles.emptyText}>
                            {!isOffline && items.length === 0
                                ? (language === 'es' ? 'No se pudo conectar al servidor' : 'Could not connect to server')
                                : t('detail.noArticles')}
                        </Text>
                        {!isOffline && (
                            <TouchableOpacity style={styles.retryBtn} onPress={loadLaw}>
                                <Text style={styles.retryText}>{t('general.retry')}</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                }
            />

            {/* AI Modal */}
            <Modal visible={aiModal} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <View style={styles.modalTitleRow}>
                                <MaterialCommunityIcons name="robot" size={20} color={COLORS.accent} />
                                <Text style={styles.modalTitle}>
                                    {language === 'es' ? 'Explicación con IA' : 'AI Explanation'}
                                </Text>
                            </View>
                            <TouchableOpacity onPress={() => setAiModal(false)}>
                                <MaterialCommunityIcons name="close" size={22} color={COLORS.textSecondary} />
                            </TouchableOpacity>
                        </View>

                        {selectedArticle?.title && (
                            <Text style={styles.modalArticleTitle}>{getItemTitle(selectedArticle)}</Text>
                        )}

                        <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
                            {aiLoading ? (
                                <View style={styles.aiLoadingBox}>
                                    <ActivityIndicator size="large" color={COLORS.accent} />
                                    <Text style={styles.aiLoadingText}>{t('ai.loading')}</Text>
                                </View>
                            ) : (
                                <View style={styles.aiResponseBox}>
                                    <Text style={styles.aiResponseText}>{aiResponse}</Text>
                                </View>
                            )}
                        </ScrollView>

                        <Text style={styles.modalDisclaimer}>
                            {language === 'es'
                                ? '⚠️ Esta explicación es informativa y no constituye asesoría legal.'
                                : '⚠️ This explanation is informational and does not constitute legal advice.'}
                        </Text>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    centered: { justifyContent: 'center', alignItems: 'center', gap: 12 },
    loadingText: { fontSize: 14, color: COLORS.textSecondary },
    header: { paddingHorizontal: 16, paddingVertical: 14 },
    headerRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    backBtn: { padding: 4 },
    favBtn: { padding: 4 },
    headerTitle: { flex: 1, fontSize: 16, fontWeight: '700', color: '#FFF' },
    lawType: {
        alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 8, paddingHorizontal: 10, paddingVertical: 3, marginTop: 8,
    },
    lawTypeText: { fontSize: 11, color: 'rgba(255,255,255,0.85)', fontWeight: '600' },
    offlineBanner: {
        flexDirection: 'row', alignItems: 'center', gap: 10,
        backgroundColor: '#EEF5FF', padding: 12, paddingHorizontal: 16,
        borderBottomWidth: 1, borderBottomColor: COLORS.border,
    },
    offlineBannerText: { flex: 1, fontSize: 13, color: COLORS.primary, fontWeight: '600' },
    offlineReady: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        backgroundColor: '#E8F5E9', padding: 10, paddingHorizontal: 16,
    },
    offlineReadyLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    offlineReadyText: { fontSize: 12, color: COLORS.success, fontWeight: '600' },
    deleteBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 4, paddingHorizontal: 8 },
    deleteBtnText: { fontSize: 12, color: COLORS.error, fontWeight: '600' },
    list: { padding: 16, gap: 12 },
    articleCard: {
        backgroundColor: COLORS.surface, borderRadius: 14, padding: 16,
        elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06, shadowRadius: 4,
    },
    articleNumber: { fontSize: 11, fontWeight: '700', color: COLORS.primary, marginBottom: 4 },
    articleTitle: { fontSize: 14, fontWeight: '700', color: COLORS.text, marginBottom: 6 },
    articleText: { fontSize: 14, color: COLORS.text, lineHeight: 22 },
    explainBtn: {
        flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 12, alignSelf: 'flex-start',
        backgroundColor: '#FFF8E1', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6,
        borderWidth: 1, borderColor: COLORS.accent + '40',
    },
    explainBtnText: { fontSize: 12, fontWeight: '600', color: COLORS.accent },
    explainBtnCount: { fontSize: 10, color: COLORS.textLight },
    loadMoreRow: { flexDirection: 'row', justifyContent: 'center', gap: 8, padding: 16, alignItems: 'center' },
    loadMoreText: { fontSize: 13, color: COLORS.textSecondary },
    emptyState: { alignItems: 'center', gap: 10, paddingTop: 48, paddingHorizontal: 20 },
    emptyText: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center' },
    retryBtn: {
        marginTop: 10, paddingHorizontal: 20, paddingVertical: 8,
        backgroundColor: COLORS.primary, borderRadius: 8
    },
    retryText: { color: '#FFF', fontSize: 14, fontWeight: '600' },
    // Modal
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: {
        backgroundColor: COLORS.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24,
        paddingTop: 20, paddingHorizontal: 20, paddingBottom: 32, maxHeight: '85%',
    },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    modalTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    modalTitle: { fontSize: 17, fontWeight: '700', color: COLORS.text },
    modalArticleTitle: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 14, fontStyle: 'italic' },
    modalScroll: { maxHeight: 380 },
    aiLoadingBox: { alignItems: 'center', padding: 32, gap: 12 },
    aiLoadingText: { fontSize: 14, color: COLORS.textSecondary },
    aiResponseBox: { backgroundColor: '#F0F4FF', borderRadius: 12, padding: 14 },
    aiResponseText: { fontSize: 14, color: COLORS.text, lineHeight: 22 },
    modalDisclaimer: { fontSize: 11, color: COLORS.textSecondary, marginTop: 12, fontStyle: 'italic', textAlign: 'center' },
});
