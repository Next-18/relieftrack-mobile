import React from 'react';
import MemberLayout from '../components/MemberLayout';
import { PageHeading, PendingAssignmentNotice } from '../components/MemberComponents';
import { DistributionCard } from '../components/RecordCards';
import { EmptyState, ErrorState, LoadingState } from '../components/ScreenState';
import { useBeneficiaryData } from '../contexts/BeneficiaryDataContext';

export default function DistributionsScreen() {
  const { data, loading, refreshing, errors, refresh } = useBeneficiaryData();
  const distributions = data.distributions;
  const isLoading = loading.distributions;
  const isRefreshing = refreshing.distributions;
  const error = errors.distributions;
  const pendingAssignments = distributions?.filter((item) => item.status === 'Pending') ?? [];

  return (
    <MemberLayout onRefresh={() => refresh('distributions')} refreshing={isRefreshing}>
      <PageHeading
        title="My relief history"
        subtitle="See packages assigned to you and your completed relief history."
      />

      <PendingAssignmentNotice assignments={pendingAssignments} />
      {error ? <ErrorState message={error} onRetry={() => refresh('distributions')} /> : null}
      {isLoading && !distributions ? <LoadingState message="Loading your distribution history…" /> : null}

      {distributions?.length ? distributions.map((item) => (
        <DistributionCard key={item.id} distribution={item} />
      )) : null}

      {distributions && distributions.length === 0 ? (
        <EmptyState
          title="No distributions recorded yet"
          message="Packages assigned to you will appear here as pending. Staff will mark them released when you collect them."
        />
      ) : null}
    </MemberLayout>
  );
}
