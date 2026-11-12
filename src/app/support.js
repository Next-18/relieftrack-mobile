import React, { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import MemberLayout from '../components/MemberLayout';
import { EmptyState, ErrorState } from '../components/ScreenState';
import { useAuth } from '../contexts/AuthContext';
import { useBeneficiaryData } from '../contexts/BeneficiaryDataContext';
import { getSupportTickets } from '../services/api';
import { getCachedResource, saveCachedResource } from '../services/offlineStore';
import colors from '../styles/colors';

const TYPES = [
  { value: 'operational', label: 'Relief or pickup' },
  { value: 'technical', label: 'Account help' },
  { value: 'system-bug', label: 'App problem' },
  { value: 'other', label: 'Other concern' },
];

const STATUS_LABELS = { open: 'Submitted', in_progress: 'In progress', resolved: 'Resolved', queued: 'Waiting to sync' };

function formatDate(value) {
  if (!value) return 'Recently submitted';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? String(value).slice(0, 10)
    : date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function SupportScreen() {
  const { session } = useAuth();
  const { pendingActions, queueSupportTicket, syncPendingActions } = useBeneficiaryData();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('operational');
  const [description, setDescription] = useState('');

  const loadTickets = useCallback(async (pullToRefresh = false) => {
    if (!session?.token) return;
    if (pullToRefresh) setRefreshing(true);
    else setLoading(true);
    setLoadError('');
    const cached = await getCachedResource(session.beneficiaryId, 'supportTickets').catch(() => null);
    if (cached?.value) setTickets(cached.value);
    try {
      await syncPendingActions();
      const latest = await getSupportTickets(session.token);
      setTickets(latest);
      await saveCachedResource(session.beneficiaryId, 'supportTickets', latest).catch(() => {});
    } catch (error) {
      setLoadError(cached?.value ? '' : (error.message || 'Your requests could not be loaded.'));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [session, syncPendingActions]);

  const pendingTickets = pendingActions
    .filter((action) => action.kind === 'support_ticket')
    .map((action) => ({
      id: `offline-${action.id}`,
      title: action.payload.title,
      type: action.payload.type,
      description: action.payload.description,
      status: 'queued',
      created_at: action.createdAt,
    }));
  const visibleTickets = [...pendingTickets, ...tickets];

  useFocusEffect(useCallback(() => {
    loadTickets();
  }, [loadTickets]));

  const handleSubmit = async () => {
    setSubmitError('');
    setSuccess('');
    if (title.trim().length < 3) {
      setSubmitError('Enter a short title for your concern.');
      return;
    }
    if (description.trim().length < 10) {
      setSubmitError('Please describe your concern in at least 10 characters.');
      return;
    }

    setSubmitting(true);
    try {
      const result = await queueSupportTicket({
        title: title.trim(),
        type,
        description: description.trim(),
      });
      setTitle('');
      setDescription('');
      setSuccess(result.queued
        ? 'Your request is saved on this phone and will be sent when a connection is available.'
        : 'Your request was sent to the Barangay Administrator.');
      await loadTickets(true);
    } catch (error) {
      setSubmitError(error.message || 'Your request could not be sent. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MemberLayout title="Contact support" onRefresh={() => loadTickets(true)} refreshing={refreshing}>
      <View style={styles.introCard}>
        <Text style={styles.introTitle}>Send a support request</Text>
        <Text style={styles.introText}>The Barangay Administrator will review your concern and reply here. This is not live chat.</Text>
      </View>

      <View style={styles.formCard}>
        <Text style={styles.label}>Concern</Text>
        <TextInput
          accessibilityLabel="Concern title"
          value={title}
          onChangeText={setTitle}
          placeholder="e.g. I need help with my pickup schedule"
          placeholderTextColor={colors.placeholder}
          maxLength={160}
          style={styles.input}
        />

        <Text style={styles.label}>What is this about?</Text>
        <View style={styles.typeList}>
          {TYPES.map((item) => {
            const selected = type === item.value;
            return (
              <TouchableOpacity
                key={item.value}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => setType(item.value)}
                style={[styles.typeChip, selected && styles.typeChipSelected]}
              >
                <Text style={[styles.typeChipText, selected && styles.typeChipTextSelected]}>{item.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.label}>Details</Text>
        <TextInput
          accessibilityLabel="Describe your concern"
          value={description}
          onChangeText={setDescription}
          placeholder="Tell us what happened and how we can help. Please don't include your password."
          placeholderTextColor={colors.placeholder}
          multiline
          textAlignVertical="top"
          maxLength={5000}
          style={[styles.input, styles.textArea]}
        />
        <Text style={styles.characterCount}>{description.length}/5000</Text>

        {submitError ? <Text accessibilityRole="alert" style={styles.errorText}>{submitError}</Text> : null}
        {success ? <Text accessibilityRole="alert" style={styles.successText}>{success}</Text> : null}

        <TouchableOpacity
          accessibilityRole="button"
          disabled={submitting}
          onPress={handleSubmit}
          style={[styles.submitButton, submitting && styles.buttonDisabled]}
        >
          {submitting ? <ActivityIndicator color={colors.white} /> : <Text style={styles.submitText}>Send request</Text>}
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Your requests</Text>
      {loadError ? <ErrorState message={loadError} onRetry={() => loadTickets()} /> : null}
      {loading ? <View style={styles.loading}><ActivityIndicator color={colors.primary} /><Text style={styles.loadingText}>Loading your requests…</Text></View> : null}
      {!loading && !loadError && visibleTickets.length === 0 ? (
        <EmptyState title="No support requests yet" message="Requests you send and replies from the Barangay Administrator will appear here." />
      ) : null}
      {!loading && !loadError ? visibleTickets.map((ticket) => {
        const statusStyle = ticket.status === 'resolved'
          ? styles.statusResolved
          : ticket.status === 'in_progress' ? styles.statusProgress : styles.statusOpen;
        return (
          <View key={ticket.id} style={styles.ticketCard}>
            <View style={styles.ticketHeader}>
              <Text style={styles.ticketTitle}>{ticket.title}</Text>
              <Text style={[styles.statusBadge, statusStyle]}>{STATUS_LABELS[ticket.status] || ticket.status}</Text>
            </View>
            <Text style={styles.ticketDate}>Request #{ticket.id} · {formatDate(ticket.created_at)}</Text>
            <Text style={styles.ticketDescription}>{ticket.description}</Text>
            {ticket.admin_response ? (
              <View style={styles.replyBox}>
                <Text style={styles.replyTitle}>Reply from the Barangay Administrator</Text>
                <Text style={styles.replyText}>{ticket.admin_response}</Text>
              </View>
            ) : (
              <Text style={styles.waitingText}>Waiting for an administrator response</Text>
            )}
          </View>
        );
      }) : null}
    </MemberLayout>
  );
}

const styles = StyleSheet.create({
  introCard: { backgroundColor: colors.blueLight, borderRadius: 14, padding: 16, marginBottom: 12 },
  introTitle: { color: colors.text, fontSize: 16, fontWeight: '700' },
  introText: { color: colors.text, fontSize: 13, lineHeight: 19, marginTop: 5 },
  formCard: { backgroundColor: colors.white, borderRadius: 14, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: colors.border },
  label: { color: colors.text, fontSize: 13, fontWeight: '700', marginBottom: 7, marginTop: 4 },
  input: { minHeight: 46, borderColor: colors.border, borderWidth: 1, borderRadius: 9, paddingHorizontal: 12, paddingVertical: 10, color: colors.text, fontSize: 14, marginBottom: 14, backgroundColor: colors.white },
  textArea: { minHeight: 112 },
  typeList: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  typeChip: { borderWidth: 1, borderColor: colors.border, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: colors.white },
  typeChipSelected: { borderColor: colors.primary, backgroundColor: colors.greenLight },
  typeChipText: { color: colors.muted, fontSize: 12, fontWeight: '600' },
  typeChipTextSelected: { color: colors.primaryDark },
  characterCount: { color: colors.muted, fontSize: 11, textAlign: 'right', marginTop: -10, marginBottom: 12 },
  submitButton: { minHeight: 46, alignItems: 'center', justifyContent: 'center', borderRadius: 9, backgroundColor: colors.primary, marginTop: 4 },
  submitText: { color: colors.white, fontSize: 14, fontWeight: '700' },
  buttonDisabled: { opacity: 0.65 },
  errorText: { color: colors.error, fontSize: 12, marginBottom: 10, lineHeight: 17 },
  successText: { color: colors.primaryDark, fontSize: 12, marginBottom: 10, lineHeight: 17 },
  sectionTitle: { color: colors.text, fontSize: 16, fontWeight: '700', marginBottom: 10 },
  loading: { minHeight: 90, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  loadingText: { color: colors.muted, fontSize: 13 },
  ticketCard: { backgroundColor: colors.white, borderColor: colors.border, borderWidth: 1, borderRadius: 14, padding: 14, marginBottom: 10 },
  ticketHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 },
  ticketTitle: { color: colors.text, fontSize: 14, fontWeight: '700', flex: 1 },
  statusBadge: { overflow: 'hidden', borderRadius: 20, paddingHorizontal: 9, paddingVertical: 4, fontSize: 10, fontWeight: '700' },
  statusOpen: { backgroundColor: colors.warningBackground, color: colors.warningText },
  statusProgress: { backgroundColor: colors.blueLight, color: colors.blueDark },
  statusResolved: { backgroundColor: colors.successBackground, color: colors.primaryDark },
  ticketDate: { color: colors.muted, fontSize: 11, marginTop: 6 },
  ticketDescription: { color: colors.text, fontSize: 13, lineHeight: 19, marginTop: 10 },
  replyBox: { backgroundColor: colors.greenLight, borderRadius: 9, padding: 11, marginTop: 12 },
  replyTitle: { color: colors.primaryDark, fontSize: 12, fontWeight: '700', marginBottom: 5 },
  replyText: { color: colors.text, fontSize: 13, lineHeight: 19 },
  waitingText: { color: colors.muted, fontSize: 11, marginTop: 12 },
});
