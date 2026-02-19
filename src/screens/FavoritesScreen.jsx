// ============================================================
// FavoritesScreen.jsx — MigraGuide USA
// ============================================================
import React from 'react';
import {
    View, Text, FlatList, TouchableOpacity, StyleSheet, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { COLORS } from '../utils/constants';
import { formatRelativeDate } from '../utils/helpers';
import { t } from '../utils/i18n';

export default function FavoritesScreen({ navigation }) {
    const { favorites, toggleFavorite, language } = useApp();

    const handlePress = (item) => {
        navigation.navigate('LawDetail', { lawId: item.lawId || item.id, lawTitle: item.title });
    };

    const handleRemove = async (item) => {
        await toggleFavorite(item);
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.card} onPress={() => handlePress(item)} activeOpacity={0.85}>
            <View style={styles.cardLeft}>
                <MaterialCommunityIcons name="bookmark" size={22} color={COLORS.accent} />
            </View>
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
                {item.category && (
                    <View style={styles.tagRow}>
                        <View style={styles.tag}>
                            <Text style={styles.tagText}>{item.category}</Text>
                        </View>
                    </View>
                )}
                <Text style={styles.cardDate}>{formatRelativeDate(item.savedAt)}</Text>
            </View>
            <TouchableOpacity onPress={() => handleRemove(item)} style={styles.removeBtn}>
                <MaterialCommunityIcons name="bookmark-remove" size={22} color={COLORS.textLight} />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} />

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>{t('fav.title')}</Text>
                <Text style={styles.headerSub}>
                    {favorites.length} {language === 'es' ? 'guardados' : 'saved'}
                </Text>
            </View>

            {favorites.length === 0 ? (
                <View style={styles.emptyState}>
                    <MaterialCommunityIcons name="bookmark-outline" size={72} color={COLORS.border} />
                    <Text style={styles.emptyTitle}>
                        {language === 'es' ? 'Sin favoritos aún' : 'No favorites yet'}
                    </Text>
                    <Text style={styles.emptyText}>{t('fav.empty')}</Text>
                </View>
            ) : (
                <FlatList
                    data={favorites}
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
        backgroundColor: COLORS.surface,
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    headerTitle: { fontSize: 24, fontWeight: '800', color: COLORS.text },
    headerSub: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
    list: { padding: 16, gap: 10 },
    card: {
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
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: '#FFF8E1',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    cardContent: { flex: 1 },
    cardTitle: { fontSize: 15, fontWeight: '600', color: COLORS.text, marginBottom: 6 },
    tagRow: { flexDirection: 'row', marginBottom: 4 },
    tag: {
        backgroundColor: COLORS.surfaceVariant,
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 2,
    },
    tagText: { fontSize: 11, color: COLORS.textSecondary, fontWeight: '600' },
    cardDate: { fontSize: 11, color: COLORS.textLight },
    removeBtn: { padding: 8 },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
        gap: 12,
    },
    emptyTitle: { fontSize: 20, fontWeight: '700', color: COLORS.text },
    emptyText: {
        fontSize: 14,
        color: COLORS.textSecondary,
        textAlign: 'center',
        lineHeight: 20,
    },
});
