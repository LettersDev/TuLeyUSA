// ============================================================
// AppNavigator.jsx — MigraGuide USA
// ============================================================
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../utils/constants';
import { t } from '../utils/i18n';
import { useApp } from '../context/AppContext';

import OnboardingScreen from '../screens/OnboardingScreen';
import HomeScreen from '../screens/HomeScreen';
import LawsListScreen from '../screens/LawsListScreen';
import LawDetailScreen from '../screens/LawDetailScreen';
import SearchScreen from '../screens/SearchScreen';
import FavoritesScreen from '../screens/FavoritesScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const tabBarOptions = {
    activeTintColor: COLORS.primary,
    inactiveTintColor: COLORS.textLight,
    style: {
        backgroundColor: COLORS.surface,
        borderTopColor: COLORS.border,
        borderTopWidth: 1,
        elevation: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        height: 60,
        paddingBottom: 6,
        paddingTop: 4,
    },
    labelStyle: { fontSize: 11, fontWeight: '600' },
};

function MainTabs() {
    const { language } = useApp();

    return (
        <Tab.Navigator screenOptions={tabBarOptions}>
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    headerShown: false,
                    tabBarLabel: t('nav.home'),
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="home" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="Search"
                component={SearchScreen}
                options={{
                    headerShown: false,
                    tabBarLabel: t('nav.search'),
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="magnify" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="Favorites"
                component={FavoritesScreen}
                options={{
                    headerShown: false,
                    tabBarLabel: t('nav.favorites'),
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="bookmark" color={color} size={size} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

export default function AppNavigator({ showOnboarding }) {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {showOnboarding && (
                    <Stack.Screen name="Onboarding" component={OnboardingScreen} />
                )}
                <Stack.Screen name="MainTabs" component={MainTabs} />
                <Stack.Screen
                    name="LawsList"
                    component={LawsListScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="LawDetail"
                    component={LawDetailScreen}
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
