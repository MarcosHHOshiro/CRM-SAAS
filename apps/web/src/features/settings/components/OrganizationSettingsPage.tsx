'use client';

import { UserRole } from '@crm-saas/types';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { PageIntro } from '@/components/PageIntro';
import { useToast } from '@/components/ToastProvider';
import { useCurrentSessionQuery } from '@/features/auth/hooks/use-auth';
import { useQueryFeedbackToast } from '@/hooks/use-query-feedback-toast';
import { getApiErrorMessage } from '@/services/api/api-error';

import {
  useOrganizationSettingsQuery,
  useUpdateOrganizationSettingsMutation,
} from '../hooks/use-organization-settings';
import {
  formatOrganizationDate,
  getOrganizationSuccessMessage,
} from '../lib/organization-settings-format';
import type { OrganizationFormValues } from '../types/organization-settings';
import { OrganizationSettingsErrorState } from './OrganizationSettingsErrorState';
import { OrganizationSettingsForm } from './OrganizationSettingsForm';
import { OrganizationSettingsSkeleton } from './OrganizationSettingsSkeleton';

function getRoleLabel(role: UserRole) {
  const labels: Record<UserRole, string> = {
    [UserRole.MANAGER]: 'Manager',
    [UserRole.OWNER]: 'Owner',
    [UserRole.SALES_REP]: 'Sales rep',
  };

  return labels[role];
}

export function OrganizationSettingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSessionQuery = useCurrentSessionQuery();
  const organizationQuery = useOrganizationSettingsQuery();
  const updateOrganizationMutation = useUpdateOrganizationSettingsMutation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { showToast } = useToast();
  const successMessage = getOrganizationSuccessMessage(searchParams.get('success'));

  useQueryFeedbackToast(successMessage);

  async function handleSubmit(values: OrganizationFormValues) {
    setErrorMessage(null);

    try {
      await updateOrganizationMutation.mutateAsync(values);
      router.replace('/settings?success=updated');
    } catch (error) {
      const message = getApiErrorMessage(error, 'Unable to update the organization right now.');

      setErrorMessage(message);
      showToast({ message, tone: 'error' });
    }
  }

  if (currentSessionQuery.isPending || organizationQuery.isPending) {
    return <OrganizationSettingsSkeleton />;
  }

  if (currentSessionQuery.isError) {
    return (
      <div className="space-y-6">
        <PageIntro
          description="Review the current workspace identity and update the organization name when ownership changes require it."
          eyebrow="Settings"
          title="Organization settings"
        />
        <OrganizationSettingsErrorState
          message={getApiErrorMessage(
            currentSessionQuery.error,
            'Unable to load your current access context.',
          )}
        />
      </div>
    );
  }

  if (organizationQuery.isError) {
    return (
      <div className="space-y-6">
        <PageIntro
          description="Review the current workspace identity and update the organization name when ownership changes require it."
          eyebrow="Settings"
          title="Organization settings"
        />
        <OrganizationSettingsErrorState
          message={getApiErrorMessage(
            organizationQuery.error,
            'Please try loading the organization settings again.',
          )}
          onRetry={() => {
            void organizationQuery.refetch();
          }}
        />
      </div>
    );
  }

  const organization = organizationQuery.data.organization;
  const actor = currentSessionQuery.data.user;

  return (
    <div className="space-y-6">
      <PageIntro
        description="Review the current workspace identity and update the organization name when ownership changes require it."
        eyebrow="Settings"
        title="Organization settings"
      />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <OrganizationSettingsForm
          actorRole={actor.role}
          errorMessage={errorMessage}
          isSubmitting={updateOrganizationMutation.isPending}
          onSubmit={handleSubmit}
          organization={organization}
        />

        <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-soft)]">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
            Workspace snapshot
          </p>
          <div className="mt-6 space-y-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--foreground-muted)]">
                Current name
              </p>
              <p className="mt-2 text-base font-semibold text-[var(--foreground)]">
                {organization.name}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--foreground-muted)]">
                Slug
              </p>
              <p className="mt-2 text-base text-[var(--foreground)]">{organization.slug}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--foreground-muted)]">
                Your access
              </p>
              <p className="mt-2 text-base text-[var(--foreground)]">{getRoleLabel(actor.role)}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--foreground-muted)]">
                Created
              </p>
              <p className="mt-2 text-base text-[var(--foreground)]">
                {formatOrganizationDate(organization.createdAt)}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--foreground-muted)]">
                Last updated
              </p>
              <p className="mt-2 text-base text-[var(--foreground)]">
                {formatOrganizationDate(organization.updatedAt)}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
