import React from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';

export default function LoginLayout({ children }) {
  const { height, width } = useWindowDimensions();
  const contentWidth = Math.min(width, 480);
  const isSmallScreen = height < 750;
  const headerHeight = isSmallScreen
    ? Math.min(Math.round(contentWidth * (460 / 576)), Math.round(height * 0.36))
    : Math.round(contentWidth * (460 / 576));
  const footerHeight = Math.round(contentWidth * (134 / 576));

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <SafeAreaView edges={['left', 'right']} style={styles.safe}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoid}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <View style={[styles.wrapper, { width: contentWidth }]}>
              {/* Top Header Illustration */}
              <Image
                source={require('../../assets/login-header.png')}
                style={{ width: contentWidth, height: headerHeight }}
                resizeMode="cover"
              />

              {/* Form Card Body */}
              <LinearGradient
                colors={['#FFFFFF', '#EEF5FD']}
                style={styles.cardBody}
              >
                {children}
              </LinearGradient>

              {/* Bottom Footer Wave */}
              <Image
                source={require('../../assets/login-footer.png')}
                style={{ width: contentWidth, height: footerHeight }}
                resizeMode="cover"
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#51C5FE',
  },
  safe: {
    flex: 1,
    backgroundColor: '#51C5FE',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: '#51C5FE',
  },
  wrapper: {
    flex: 1,
    minHeight: '100%',
    backgroundColor: '#51C5FE',
  },
  cardBody: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 8,
  },
});
