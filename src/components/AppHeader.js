import React from 'react';
import { Image, Text, View } from 'react-native';
import globalStyles from '../styles/globalStyles';

export default function AppHeader() {
  return (
    <View style={globalStyles.logoContainer}>
      <Image
        source={require('../../assets/logo.png')}
        style={globalStyles.logoImage}
        resizeMode="contain"
      />
      <Text style={globalStyles.appName}>
        <Text style={globalStyles.brandRelief}>Relief</Text>
        <Text style={globalStyles.brandTrack}>Track</Text>
      </Text>
      <Text style={globalStyles.subtitle}>Disaster Relief Inventory Tracker</Text>
    </View>
  );
}
