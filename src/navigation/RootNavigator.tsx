import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { enableScreens } from 'react-native-screens';
import { Ionicons } from '@expo/vector-icons';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { ExploreScreen } from '../screens/ExploreScreen';
import { RecordScreen } from '../screens/RecordScreen';
import { TripsScreen } from '../screens/TripsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { TripDetailScreen } from '../screens/TripDetailScreen';
import { ShareDesignerScreen } from '../screens/ShareDesignerScreen';
import { useTrips } from '../context/TripsContext';
import type { RootStackParamList, TabParamList } from '../types';
import { colors } from '../theme';

if (Platform.OS === 'web') {
  enableScreens(false);
}

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.canvas,
    primary: colors.ink,
    card: colors.surface,
    text: colors.ink,
    border: colors.border,
  },
};

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.ink,
        tabBarInactiveTintColor: colors.inkFaint,
        tabBarLabelStyle: {
          fontFamily: 'SourceSans3_600SemiBold',
          fontSize: 11,
        },
        tabBarStyle: {
          borderTopColor: colors.border,
          height: Platform.OS === 'web' ? 72 : 64,
          paddingBottom: 8,
          paddingTop: 6,
          backgroundColor: colors.surface,
        },
        tabBarIcon: ({ color, size, focused }) => {
          if (route.name === 'Home') {
            return (
              <Ionicons
                name={focused ? 'home' : 'home-outline'}
                size={size}
                color={color}
              />
            );
          }
          if (route.name === 'Explore') {
            return (
              <Ionicons
                name={focused ? 'compass' : 'compass-outline'}
                size={size}
                color={color}
              />
            );
          }
          if (route.name === 'Record') {
            return (
              <View style={[styles.recordOrb, focused && styles.recordOrbActive]}>
                <Ionicons name="add" size={28} color="#fff" />
              </View>
            );
          }
          if (route.name === 'Trips') {
            return (
              <Ionicons
                name={focused ? 'map' : 'map-outline'}
                size={size}
                color={color}
              />
            );
          }
          return (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              size={size}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Explore" component={ExploreScreen} />
      <Tab.Screen
        name="Record"
        component={RecordScreen}
        options={{ tabBarLabel: '' }}
      />
      <Tab.Screen name="Trips" component={TripsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  const { onboarded, loading } = useTrips();

  if (loading) return null;

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        screenOptions={{
          cardStyle: { backgroundColor: colors.canvas },
        }}
      >
        {!onboarded ? (
          <Stack.Screen
            name="Onboarding"
            component={OnboardingScreen}
            options={{ headerShown: false }}
          />
        ) : null}
        <Stack.Screen
          name="Tabs"
          component={Tabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TripDetail"
          component={TripDetailScreen}
          options={{
            title: 'Trip Summary',
            headerTintColor: colors.ink,
            headerTitleStyle: {
              fontFamily: 'Outfit_600SemiBold',
              color: colors.ink,
            },
          }}
        />
        <Stack.Screen
          name="ShareDesigner"
          component={ShareDesignerScreen}
          options={{
            title: 'Choose a Design',
            headerTintColor: colors.ink,
            headerTitleStyle: {
              fontFamily: 'Outfit_600SemiBold',
              color: colors.ink,
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  recordOrb: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -18,
  },
  recordOrbActive: {
    backgroundColor: colors.record,
  },
});
