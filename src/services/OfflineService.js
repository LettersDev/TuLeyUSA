// ============================================================
// OfflineService.js — MigraGuide USA
// Gestiona el almacenamiento local de leyes en el File System
// ============================================================
import * as FileSystem from 'expo-file-system/legacy';

const OFFLINE_DIR = `${FileSystem.documentDirectory}offline_laws/`;

const OfflineService = {
    init: async () => {
        const dirInfo = await FileSystem.getInfoAsync(OFFLINE_DIR);
        if (!dirInfo.exists) {
            await FileSystem.makeDirectoryAsync(OFFLINE_DIR, { intermediates: true });
        }
    },

    saveLaw: async (lawId, data) => {
        try {
            await OfflineService.init();
            const filePath = `${OFFLINE_DIR}${lawId}.json`;
            await FileSystem.writeAsStringAsync(filePath, JSON.stringify(data));
            console.log(`[Offline] Ley ${lawId} guardada.`);
            return true;
        } catch (error) {
            console.error('[Offline] Error saving law:', error);
            return false;
        }
    },

    getLaw: async (lawId) => {
        try {
            const filePath = `${OFFLINE_DIR}${lawId}.json`;
            const fileInfo = await FileSystem.getInfoAsync(filePath);
            if (fileInfo.exists) {
                const content = await FileSystem.readAsStringAsync(filePath);
                return JSON.parse(content);
            }
            return null;
        } catch (error) {
            console.error('[Offline] Error reading law:', error);
            return null;
        }
    },

    deleteLaw: async (lawId) => {
        try {
            const filePath = `${OFFLINE_DIR}${lawId}.json`;
            const fileInfo = await FileSystem.getInfoAsync(filePath);
            if (fileInfo.exists) {
                await FileSystem.deleteAsync(filePath);
            }
            return true;
        } catch (error) {
            console.error('[Offline] Error deleting law:', error);
            return false;
        }
    },

    isLawOffline: async (lawId) => {
        try {
            const filePath = `${OFFLINE_DIR}${lawId}.json`;
            const fileInfo = await FileSystem.getInfoAsync(filePath);
            return fileInfo.exists;
        } catch {
            return false;
        }
    },

    getDownloadedLawIds: async () => {
        try {
            await OfflineService.init();
            const files = await FileSystem.readDirectoryAsync(OFFLINE_DIR);
            return files.map((f) => f.replace('.json', ''));
        } catch {
            return [];
        }
    },

    getStorageStats: async () => {
        try {
            await OfflineService.init();
            const files = await FileSystem.readDirectoryAsync(OFFLINE_DIR);
            let totalSize = 0;
            for (const file of files) {
                const info = await FileSystem.getInfoAsync(`${OFFLINE_DIR}${file}`);
                if (info.exists && info.size) totalSize += info.size;
            }
            return {
                lawCount: files.length,
                totalSizeBytes: totalSize,
                totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2),
            };
        } catch {
            return { lawCount: 0, totalSizeBytes: 0, totalSizeMB: '0' };
        }
    },

    clearAllOfflineLaws: async () => {
        try {
            const files = await FileSystem.readDirectoryAsync(OFFLINE_DIR);
            for (const file of files) {
                await FileSystem.deleteAsync(`${OFFLINE_DIR}${file}`);
            }
            return true;
        } catch (error) {
            console.error('[Offline] Error clearing laws:', error);
            return false;
        }
    },
};

export default OfflineService;
