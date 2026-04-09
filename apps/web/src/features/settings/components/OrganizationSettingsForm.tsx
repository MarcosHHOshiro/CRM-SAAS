'use client';

import { useEffect, useState } from 'react';

import { UserRole } from '@crm-saas/types';

import { InlineBanner } from '@/components/InlineBanner';
import { TextField } from '@/components/TextField';

import { getOrganizationInitialValues } from '../lib/organization-settings-format';
import { organizationSettingsSchema } from '../schemas/organization-settings-schema';
import type {
  OrganizationFormValues,
  OrganizationRecord,
} from '../types/organization-settings';

type OrganizationSettingsFormProps = Readonly<{
  actorRole: UserRole;
  errorMessage?: string | null;
  isSubmitting: boolean;
  onSubmit: (values: OrganizationFormValues) => Promise<void>;
  organization: OrganizationRecord;
}>;

type OrganizationSettingsFormErrors = Partial<Record<keyof OrganizationFormValues, string>>;

export function OrganizationSettingsForm({
  actorRole,
  errorMessage,
  isSubmitting,
  onSubmit,
  organization,
}: OrganizationSettingsFormProps) {
  const [values, setValues] = useState<OrganizationFormValues>(() =>
    getOrganizationInitialValues(organization),
  );
  const [fieldErrors, setFieldErrors] = useState<OrganizationSettingsFormErrors>({});
  const canEdit = actorRole === UserRole.OWNER;

  useEffect(() => {
    setValues(getOrganizationInitialValues(organization));
    setFieldErrors({});
  }, [organization]);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));
    setFieldErrors((currentErrors) => ({
      ...currentErrors,
      [name]: undefined,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canEdit) {
      return;
    }

    const result = organizationSettingsSchema.safeParse(values);

    if (!result.success) {
      const flattened = result.error.flatten().fieldErrors;

      setFieldErrors({
        name: flattened.name?.[0],
      });

      return;
    }

    await onSubmit(result.data);
  }

  return (
    <form
      className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-soft)]"
      onSubmit={handleSubmit}
    >
      <div className="grid gap-5 md:grid-cols-2">
        <TextField
          disabled={!canEdit}
          error={fieldErrors.name}
          label="Nome da organizacao"
          name="name"
          onChange={handleChange}
          placeholder="Northwind Sales"
          value={values.name}
        />
        <div className="rounded-[1.5rem] border border-[var(--border)] bg-white/60 px-4 py-3 text-sm leading-6 text-[var(--foreground-muted)]">
          <p className="font-semibold text-[var(--foreground)]">Slug da organizacao</p>
          <p className="mt-2">{organization.slug}</p>
        </div>
      </div>

      {!canEdit ? (
        <div className="mt-5">
          <InlineBanner tone="info">
            Somente owners podem atualizar as configuracoes da organizacao.
          </InlineBanner>
        </div>
      ) : null}

      {errorMessage ? (
        <div className="mt-5">
          <InlineBanner tone="error">{errorMessage}</InlineBanner>
        </div>
      ) : null}

      <div className="mt-6">
        <button
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--accent)] px-5 text-sm font-semibold text-white hover:bg-[var(--accent-strong)] disabled:cursor-not-allowed disabled:opacity-70"
          disabled={!canEdit || isSubmitting}
          type="submit"
        >
          {isSubmitting ? 'Salvando...' : 'Atualizar organizacao'}
        </button>
      </div>
    </form>
  );
}
