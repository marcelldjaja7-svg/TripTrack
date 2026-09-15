import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { HomeScreen } from '../screens/HomeScreen';
import { RecordScreen } from '../screens/RecordScreen';
import { YouScreen } from '../screens/YouScreen';
import { TripDetailScreen } from '../screens/TripDetailScreen';
import { ShareDesignerScreen } from '../screens/ShareDesignerScreen';
import type { RootStackParamList, TabParamList } from '../types';
import { colors } from '../theme';

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.canvas,
    primary: colors.primary,
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
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.inkFaint,
        tabBarLabelStyle: {
          fontFamily: 'SourceSans3_600SemiBold',
          fontSize: 11,
        },
        tabBarStyle: {
          borderTopColor: colors.border,
          height: 64,
          paddingBottom: 8,
          paddingTop: 6,
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
          if (route.name === 'Record') {
            return (
              <View style={[styles.recordOrb, focused && styles.recordOrbActive]}>
                <Ionicons name="radio-button-on" size={28} color={colors.primary} />
              </View>
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
      <Tab.Screen
        name="Record"
        component={RecordScreen}
        options={{ tabBarLabel: 'Record' }}
      />
      <Tab.Screen name="You" component={YouScreen} />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator>
        <Stack.Screen
          name="Tabs"
          component={Tabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TripDetail"
          component={TripDetailScreen}
          options={{
            title: 'Trip',
            headerTintColor: colors.primary,
            headerTitleStyle: { fontFamily: 'Outfit_600SemiBold', color: colors.ink },
          }}
        />
        <Stack.Screen
          name="ShareDesigner"
          component={ShareDesignerScreen}
          options={{
            title: 'Share design',
            headerTintColor: colors.primary,
            headerTitleStyle: { fontFamily: 'Outfit_600SemiBold', color: colors.ink },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  recordOrb: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 3,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -8,
    backgroundColor: colors.surface,
  },
  recordOrbActive: {
    backgroundColor: colors.primarySoft,
  },
});
