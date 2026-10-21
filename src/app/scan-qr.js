import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import { recordDistribution } from '../services/api';
import colors from '../styles/colors';

function parseScannedPayload(data) {
  const trimmed = (data || '').trim();
  if (!trimmed) return null;

  try {
    const parsed = JSON.parse(trimmed);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return { raw: trimmed, fields: parsed };
    }
  } catch {
    // Not JSON — treat the contents as a plain distribution code.
  }

  return { raw: trimmed, fields: { code: trimmed } };
}

export default function ScanQRScreen() {
  const { session } = useAuth();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [recordError, setRecordError] = useState(null);
  const [recorded, setRecorded] = useState(false);

  const handleBarCodeScanned = ({ data }) => {
    if (scanned) return;
    const payload = parseScannedPayload(data);
    if (!payload) return;
    setScanned(true);
    setScannedData(payload);
    setRecordError(null);
  };

  const handleRecord = async () => {
    if (!scannedData || isRecording) return;
    setIsRecording(true);
    setRecordError(null);
    try {
      await recordDistribution(session.token, scannedData.fields);
      setRecorded(true);
    } catch (error) {
      setRecordError(error?.message || 'The distribution could not be recorded. Please try again.');
    } finally {
      setIsRecording(false);
    }
  };

  const resetScanner = () => {
    setScanned(false);
    setScannedData(null);
    setRecordError(null);
    setRecorded(false);
  };

  if (!permission) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <ActivityIndicator color={colors.accent} size="large" />
          <Text style={styles.helperText}>Checking camera permission…</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Go back">
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Scan QR code</Text>
          <View style={styles.backSpacer} />
        </View>
        <View style={styles.centered}>
          <Text style={styles.permissionTitle}>Camera access needed</Text>
          <Text style={styles.helperText}>
            ReliefTrack uses your camera to scan QR codes at distribution checkpoints.
          </Text>
          {permission.canAskAgain ? (
            <TouchableOpacity style={styles.primaryButton} onPress={requestPermission} accessibilityRole="button">
              <Text style={styles.primaryButtonText}>Allow camera access</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.helperText}>
              Camera access is turned off. Enable it for ReliefTrack in your device settings, then come back.
            </Text>
          )}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      />

      <SafeAreaView style={styles.overlay} edges={['top', 'bottom', 'left', 'right']}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Go back">
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.titleOnCamera}>Scan QR code</Text>
          <View style={styles.backSpacer} />
        </View>

        {!scanned ? (
          <View style={styles.finderArea}>
            <View style={styles.finderFrame} />
            <Text style={styles.finderHint}>Align the QR code inside the frame</Text>
          </View>
        ) : (
          <View style={styles.resultCard}>
            {recorded ? (
              <>
                <Text style={styles.resultTitle}>Distribution recorded</Text>
                <Text style={styles.helperText}>
                  The scanned code was submitted for {session.beneficiaryNo}.
                </Text>
                <TouchableOpacity style={styles.primaryButton} onPress={() => router.back()} accessibilityRole="button">
                  <Text style={styles.primaryButtonText}>Done</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.secondaryButton} onPress={resetScanner} accessibilityRole="button">
                  <Text style={styles.secondaryButtonText}>Scan another</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.resultTitle}>Code scanned</Text>
                <View style={styles.payloadBox}>
                  {Object.entries(scannedData?.fields || {}).map(([key, value]) => (
                    <View key={key} style={styles.payloadRow}>
                      <Text style={styles.payloadKey}>{key}</Text>
                      <Text style={styles.payloadValue}>{String(value)}</Text>
                    </View>
                  ))}
                </View>
                {recordError ? <Text style={styles.errorText}>{recordError}</Text> : null}
                <TouchableOpacity
                  style={[styles.primaryButton, isRecording && styles.primaryButtonDisabled]}
                  onPress={handleRecord}
                  disabled={isRecording}
                  accessibilityRole="button"
                >
                  {isRecording ? (
                    <ActivityIndicator color={colors.darkBlue} />
                  ) : (
                    <Text style={styles.primaryButtonText}>Record distribution</Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity style={styles.secondaryButton} onPress={resetScanner} disabled={isRecording} accessibilityRole="button">
                  <Text style={styles.secondaryButtonText}>Scan again</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backText: {
    color: colors.accent,
    fontSize: 16,
    fontWeight: '700',
  },
  backSpacer: {
    width: 48,
  },
  title: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '700',
  },
  titleOnCamera: {
    color: '#FFFEFB',
    fontSize: 17,
    fontWeight: '700',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 12,
  },
  permissionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  helperText: {
    color: colors.muted,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  finderArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  finderFrame: {
    width: 240,
    height: 240,
    borderColor: colors.primary,
    borderRadius: 24,
    borderWidth: 3,
  },
  finderHint: {
    color: '#FFFEFB',
    fontSize: 14,
    marginTop: 16,
    textAlign: 'center',
  },
  resultCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    margin: 20,
    padding: 20,
    shadowColor: '#3A2A1E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  resultTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  payloadBox: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    marginVertical: 12,
    padding: 12,
  },
  payloadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 4,
  },
  payloadKey: {
    color: colors.muted,
    fontSize: 13,
  },
  payloadValue: {
    color: colors.text,
    flexShrink: 1,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'right',
  },
  errorText: {
    color: colors.error,
    fontSize: 13,
    marginBottom: 8,
    textAlign: 'center',
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 14,
    justifyContent: 'center',
    marginTop: 4,
    padding: 14,
  },
  primaryButtonDisabled: {
    opacity: 0.7,
  },
  primaryButtonText: {
    color: colors.darkBlue,
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  secondaryButtonText: {
    color: colors.accent,
    fontSize: 15,
    fontWeight: '600',
  },
});
