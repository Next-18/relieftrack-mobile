import React from 'react';
import { Tabs } from 'expo-router';
import Svg, { Path, Rect, Circle } from 'react-native-svg';
import { BeneficiaryDataProvider } from '../../contexts/BeneficiaryDataContext';
import colors from '../../styles/colors';

function HomeIcon({ color, focused, size = 20 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={focused ? 2.3 : 1.9} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M3 9.5L12 3l9 6.5V20a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9.5z" />
      <Path d="M9 22V12h6v10" />
    </Svg>
  );
}

function DistributionsIcon({ color, focused, size = 20 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={focused ? 2.3 : 1.9} strokeLinecap="round" strokeLinejoin="round">
      <Rect x="3" y="4" width="18" height="16" rx="3" />
      <Path d="M3 10h18" />
      <Path d="M9 16h6" />
      <Path d="M8 2v4" />
      <Path d="M16 2v4" />
    </Svg>
  );
}

function PackagesIcon({ color, focused, size = 20 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={focused ? 2.3 : 1.9} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <Path d="M3.27 6.96L12 12.01l8.73-5.05" />
      <Path d="M12 22.08V12" />
    </Svg>
  );
}

function AccountIcon({ color, focused, size = 20 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={focused ? 2.3 : 1.9} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <Circle cx="12" cy="7" r="4" />
    </Svg>
  );
}

export default function MemberTabs() {
  return (
    <BeneficiaryDataProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          freezeOnBlur: true,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.muted,
          tabBarHideOnKeyboard: true,
          tabBarStyle: {
            height: 66,
            paddingTop: 8,
            paddingBottom: 8,
            borderTopColor: colors.border,
            borderTopWidth: 1,
            backgroundColor: colors.dirtyWhite,
            elevation: 4,
            shadowColor: '#16231d',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.03,
            shadowRadius: 10,
          },
          tabBarLabelStyle: {
            fontSize: 10.5,
            fontWeight: '700',
            letterSpacing: 0.2,
            marginTop: 2,
          },
          tabBarItemStyle: {
            paddingVertical: 2,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            tabBarAccessibilityLabel: 'Home',
            tabBarIcon: ({ color, focused }) => <HomeIcon color={color} focused={focused} size={20} />,
          }}
        />
        <Tabs.Screen
          name="distributions"
          options={{
            title: 'My Relief',
            tabBarAccessibilityLabel: 'My relief history',
            tabBarIcon: ({ color, focused }) => <DistributionsIcon color={color} focused={focused} size={20} />,
          }}
        />
        <Tabs.Screen
          name="packages"
          options={{
            title: 'Packages',
            tabBarAccessibilityLabel: 'Available relief packages',
            tabBarIcon: ({ color, focused }) => <PackagesIcon color={color} focused={focused} size={20} />,
          }}
        />
        <Tabs.Screen
          name="account"
          options={{
            title: 'Account',
            tabBarAccessibilityLabel: 'My beneficiary account',
            tabBarIcon: ({ color, focused }) => <AccountIcon color={color} focused={focused} size={20} />,
          }}
        />
      </Tabs>
    </BeneficiaryDataProvider>
  );
}
