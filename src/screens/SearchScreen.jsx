// ============================================================
// SearchScreen.jsx — MigraGuide USA
// ============================================================
import React, { useState, useCallback } from 'react';
import {
    View, Text, TextInput, FlatList, TouchableOpacity,
    StyleSheet, StatusBar, ActivityIndicator, Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../utils/constants';
import { searchLawsLocal, searchLawsGlobal } from '../services/LawService';
import GeminiService from '../services/GeminiService';
import { t } from '../utils/i18n';
import { useApp } from '../context/AppContext';

export default function SearchScreen({ navigation }) {
    const { language } = useApp();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchMode, setSearchMode] = useState('local'); // 'local' | 'global'
    const [hasSearched, setHasSearched] = useState(false);

    // AI Chat
    const [aiQuery, setAiQuery] = useState('');
    const [aiResponse, setAiResponse] = useState('');
    const [aiLoading, setAiLoading] = useState(false);
    const [aiRemaining, setAiRemaining] = useState(null);
    const [showAI, setShowAI] = useState(false);

    const handleSearch = async (text) => {
        setQuery(text);
        if (text.length < 2) {
            setResults([]);
            setHasSearched(false);
            return;
        }
        setLoading(true);
        setHasSearched(true);
        try {
            const localResults = await searchLawsLocal(text);
            setResults(localResults || []);
        } catch {
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handleGlobalSearch = async () => {
        if (query.length < 3) return;
        Keyboard.dismiss();
        setLoading(true);
        setSearchMode('global');
        try {
            const globalResults = await searchLawsGlobal(query);
            setResults(globalResults || []);
        } catch {
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handleAskAI = async () => {
        if (!aiQuery.trim()) return;
        Keyboard.dismiss();
        setAiLoading(true);
        setAiResponse('');
        try {
            const remaining = await GeminiService.getRemainingQueries();
            setAiRemaining(remaining - 1);
            const response = await GeminiService.askGeneralQuestion(aiQuery, language);
            setAiResponse(response);
        } catch (error) {
            if (error.message === 'DAILY_LIMIT_REACHED') {
                setAiResponse(t('ai.limitReached'));
            } else if (error.message === 'GEMINI_KEY_NOT_SET') {
                setAiResponse(language === 'es'
                    ? 'La clave de Gemini no está configurada.'
                    : 'Gemini key is not configured.');
            } else {
                setAiResponse(t('ai.error'));
            }
        } finally {
            setAiLoading(false);
        }
    };

    const renderResult = ({ item }) => (
        <TouchableOpacity
            style={styles.resultCard}
            onPress={() => navigation.navigate('LawDetail', {
                lawId: item.law_id || item.id,
                lawTitle: item.law_title || item.title,
            })}
            activeOpacity={0.85}
        >
            <MaterialCommunityIcons name="file-find" size={20} color={COLORS.primary} />
            <View style={styles.resultContent}>
                <Text style={styles.resultLaw} numberOfLines={1}>
                    {item.law_title || item.title}
                </Text>
                {item.item_text && (
                    <Text style={styles.resultSnippet} numberOfLines={2}>
                        {item.item_text.substring(0, 100)}...
                    </Text>
                )}
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} />

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>{t('nav.search')}</Text>
            </View>

            <FlatList
                ListHeaderComponent={
                    <View>
                        {/* Search bar */}
                        <View style={styles.searchBox}>
                            <View style={styles.searchInput}>
                                <MaterialCommunityIcons name="magnify" size={20} color={COLORS.textLight} />
                                <TextInput
                                    style={styles.input}
                                    placeholder={t('search.placeholder')}
                                    placeholderTextColor={COLORS.textLight}
                                    value={query}
                                    onChangeText={handleSearch}
                                    returnKeyType="search"
                                    onSubmitEditing={handleGlobalSearch}
                                />
                                {query.length > 0 && (
                                    <TouchableOpacity onPress={() => { setQuery(''); setResults([]); setHasSearched(false); }}>
                                        <MaterialCommunityIcons name="close-circle" size={18} color={COLORS.textLight} />
                                    </TouchableOpacity>
                                )}
                            </View>
                            {query.length >= 3 && (
                                <TouchableOpacity style={styles.globalBtn} onPress={handleGlobalSearch}>
                                    <MaterialCommunityIcons name="database-search" size={16} color={COLORS.primary} />
                                    <Text style={styles.globalBtnText}>
                                        {language === 'es' ? 'Buscar en artículos' : 'Search in articles'}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        {/* Modes indicator */}
                        {hasSearched && !loading && (
                            <Text style={styles.modeLabel}>
                                {searchMode === 'global'
                                    ? (language === 'es' ? '🌐 Buscando en artículos' : '🌐 Searching in articles')
                                    : (language === 'es' ? '📱 Resultados locales' : '📱 Local results')}
                                {' — '}{results.length} {language === 'es' ? 'resultado' : 'result'}{results.length !== 1 ? 's' : ''}
                            </Text>
                        )}

                        {loading && (
                            <View style={styles.loadingRow}>
                                <ActivityIndicator size="small" color={COLORS.primary} />
                                <Text style={styles.loadingText}>
                                    {language === 'es' ? 'Buscando...' : 'Searching...'}
                                </Text>
                            </View>
                        )}

                        {/* AI Section */}
                        <TouchableOpacity
                            style={styles.aiToggle}
                            onPress={() => setShowAI(!showAI)}
                            activeOpacity={0.85}
                        >
                            <MaterialCommunityIcons name="robot" size={20} color={COLORS.accent} />
                            <Text style={styles.aiToggleText}>{t('search.askAI')}</Text>
                            <MaterialCommunityIcons
                                name={showAI ? 'chevron-up' : 'chevron-down'}
                                size={18}
                                color={COLORS.textLight}
                            />
                        </TouchableOpacity>

                        {showAI && (
                            <View style={styles.aiBox}>
                                <TextInput
                                    style={styles.aiInput}
                                    placeholder={t('search.aiPlaceholder')}
                                    placeholderTextColor={COLORS.textLight}
                                    value={aiQuery}
                                    onChangeText={setAiQuery}
                                    multiline
                                    numberOfLines={3}
                                />
                                <TouchableOpacity
                                    style={[styles.aiSendBtn, aiLoading && { opacity: 0.6 }]}
                                    onPress={handleAskAI}
                                    disabled={aiLoading}
                                >
                                    {aiLoading ? (
                                        <ActivityIndicator size="small" color="#FFF" />
                                    ) : (
                                        <>
                                            <MaterialCommunityIcons name="send" size={16} color="#FFF" />
                                            <Text style={styles.aiSendText}>{t('general.send')}</Text>
                                        </>
                                    )}
                                </TouchableOpacity>
                                {aiRemaining !== null && (
                                    <Text style={styles.aiRemaining}>
                                        {aiRemaining} {t('search.aiRemaining')}
                                    </Text>
                                )}
                                {aiResponse !== '' && (
                                    <View style={styles.aiResponse}>
                                        <Text style={styles.aiResponseLabel}>
                                            {language === 'es' ? 'Respuesta de IA:' : 'AI Response:'}
                                        </Text>
                                        <Text style={styles.aiResponseText}>{aiResponse}</Text>
                                        <Text style={styles.aiDisclaimer}>
                                            {language === 'es'
                                                ? '⚠️ Esta información es orientativa. Consulta a un abogado de inmigración.'
                                                : '⚠️ This information is guidance only. Consult an immigration attorney.'}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        )}
                    </View>
                }
                data={results}
                renderItem={renderResult}
                keyExtractor={(item, i) => item.id || `result-${i}`}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    hasSearched && !loading ? (
                        <View style={styles.emptyState}>
                            <MaterialCommunityIcons name="magnify-close" size={48} color={COLORS.border} />
                            <Text style={styles.emptyText}>{t('search.noResults')}</Text>
                            <Text style={styles.emptyHint}>
                                {language === 'es'
                                    ? 'Intenta buscar en artículos usando el botón de arriba.'
                                    : 'Try searching in articles using the button above.'}
                            </Text>
                        </View>
                    ) : null
                }
                keyboardShouldPersistTaps="handled"
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    header: {
        backgroundColor: COLORS.surface, paddingHorizontal: 20, paddingVertical: 16,
        borderBottomWidth: 1, borderBottomColor: COLORS.border,
    },
    headerTitle: { fontSize: 24, fontWeight: '800', color: COLORS.text },
    searchBox: { padding: 16, gap: 10 },
    searchInput: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface,
        borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10,
        borderWidth: 1, borderColor: COLORS.border, gap: 8,
        elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04, shadowRadius: 3,
    },
    input: { flex: 1, fontSize: 15, color: COLORS.text },
    globalBtn: {
        flexDirection: 'row', alignItems: 'center', gap: 6,
        backgroundColor: COLORS.surfaceVariant, borderRadius: 10,
        paddingHorizontal: 14, paddingVertical: 9, alignSelf: 'flex-start',
        borderWidth: 1, borderColor: COLORS.border,
    },
    globalBtnText: { fontSize: 13, color: COLORS.primary, fontWeight: '600' },
    modeLabel: { fontSize: 12, color: COLORS.textSecondary, paddingHorizontal: 16, marginBottom: 4 },
    loadingRow: { flexDirection: 'row', gap: 8, alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8 },
    loadingText: { fontSize: 13, color: COLORS.textSecondary },
    aiToggle: {
        flexDirection: 'row', alignItems: 'center', gap: 10,
        backgroundColor: COLORS.surface, marginHorizontal: 16, marginVertical: 8,
        padding: 14, borderRadius: 12, borderWidth: 1,
        borderColor: COLORS.accent + '60', elevation: 1,
    },
    aiToggleText: { flex: 1, fontSize: 15, fontWeight: '600', color: COLORS.text },
    aiBox: {
        marginHorizontal: 16, backgroundColor: COLORS.surface, borderRadius: 14,
        padding: 16, gap: 10, borderWidth: 1, borderColor: COLORS.border,
        marginBottom: 8,
    },
    aiInput: {
        backgroundColor: COLORS.surfaceVariant, borderRadius: 10, padding: 12,
        fontSize: 14, color: COLORS.text, minHeight: 70, textAlignVertical: 'top',
    },
    aiSendBtn: {
        flexDirection: 'row', alignItems: 'center', gap: 6, justifyContent: 'center',
        backgroundColor: COLORS.primary, borderRadius: 10, paddingVertical: 10,
    },
    aiSendText: { fontSize: 14, fontWeight: '700', color: '#FFF' },
    aiRemaining: { fontSize: 11, color: COLORS.textLight, textAlign: 'center' },
    aiResponse: {
        backgroundColor: '#F0F4FF', borderRadius: 10, padding: 12,
        borderLeftWidth: 3, borderLeftColor: COLORS.primary,
    },
    aiResponseLabel: { fontSize: 12, fontWeight: '700', color: COLORS.primary, marginBottom: 4 },
    aiResponseText: { fontSize: 13, color: COLORS.text, lineHeight: 20 },
    aiDisclaimer: { fontSize: 11, color: COLORS.textSecondary, marginTop: 8, fontStyle: 'italic' },
    list: { paddingHorizontal: 16, paddingBottom: 20, gap: 8 },
    resultCard: {
        flexDirection: 'row', alignItems: 'flex-start', gap: 12,
        backgroundColor: COLORS.surface, borderRadius: 12, padding: 14,
        elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05, shadowRadius: 3,
    },
    resultContent: { flex: 1 },
    resultLaw: { fontSize: 14, fontWeight: '700', color: COLORS.text, marginBottom: 3 },
    resultSnippet: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 18 },
    emptyState: { alignItems: 'center', gap: 8, paddingTop: 32, paddingHorizontal: 40 },
    emptyText: { fontSize: 16, fontWeight: '600', color: COLORS.textSecondary },
    emptyHint: { fontSize: 13, color: COLORS.textLight, textAlign: 'center' },
});
