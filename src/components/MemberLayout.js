import React from 'react';
import { Image, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import colors from '../styles/colors';

export default function MemberLayout({ children, onRefresh, refreshing = false }) {
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        refreshControl={
          onRefresh
            ? <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
            : undefined
        }
      >
        <View style={styles.topBar}>
          <View style={styles.brand}>
            <Image source={require('../../assets/logo.png')} style={styles.logo} resizeMode="contain" />
            <View>
              <Text style={styles.brandName}>ReliefTrack</Text>
              <Text style={styles.brandCaption}>BENEFICIARY PORTAL</Text>
            </View>
          </View>
          <View style={styles.notificationBadge}>
            <View style={styles.notificationDot} />
            <Text style={styles.notificationText}>Notification</Text>
          </View>
        </View>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    width: '100%',
    maxWidth: 580,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 38,
    height: 38,
    marginRight: 11,
  },
  brandName: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '400',
  },
  brandCaption: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: '400',
    marginTop: 2,
  },
  notificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 6,
  },
  notificationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.progress,
  },
  notificationText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '400',
  },
});
