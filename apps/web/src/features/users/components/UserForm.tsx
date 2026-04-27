'use client';

import Link from 'next/link';
import { UserRole } from '@crm-saas/types';
import { useEffect, useState } from 'react';

import { InlineBanner } from '@/components/InlineBanner';
import { SelectField } from '@/components/SelectField';
import { TextField } from '@/components/TextField';
import { useTranslation } from '@/i18n/use-translation';

import {
  getAvailableRoleOptions,
  getCreateUserInitialValues,
  getEditUserInitialValues,
} from '../lib/users-format';
import { createUserSchema } from '../schemas/create-user-schema';
import { editUserSchema } from '../schemas/edit-user-schema';
import type { EditUserFormValues, UserFormValues, UserRecord } from '../types/users';

type UserFormBaseProps = Readonly<{
  actorRole: UserRole;
  disableRoleField?: boolean;
  errorMessage?: string | null;
  isSubmitting: boolean;
  roleHint?: string;
  submitLabel: string;
}>;

type CreateUserFormProps = UserFormBaseProps &
  Readonly<{
    mode: 'create';
    onSubmit: (values: UserFormValues) => Promise<void>;
    user?: never;
  }>;

type EditUserFormProps = UserFormBaseProps &
  Readonly<{
    mode: 'edit';
    onSubmit: (values: EditUserFormValues) => Promise<void>;
    user: UserRecord;
  }>;

type UserFormProps = CreateUserFormProps | EditUserFormProps;

type UserFormErrors = Partial<Record<keyof UserFormValues, string>>;

export function UserForm(props: UserFormProps) {
  const {
    actorRole,
    disableRoleField = false,
    errorMessage,
    isSubmitting,
    mode,
    onSubmit,
    roleHint,
    submitLabel,
    user,
  } = props;
  const { messages } = useTranslation();
  const [createValues, setCreateValues] = useState<UserFormValues>(() =>
    getCreateUserInitialValues(),
  );
  const [editValues, setEditValues] = useState<EditUserFormValues>(() =>
    user ? getEditUserInitialValues(user) : { name: '', role: UserRole.SALES_REP },
  );
  const [fieldErrors, setFieldErrors] = useState<UserFormErrors>({});

  const roleOptions = getAvailableRoleOptions(actorRole, messages).map((option) => ({
    label: option.label,
    value: option.value,
  }));

  const values = mode === 'create' ? createValues : editValues;

  useEffect(() => {
    if (mode === 'edit' && user) {
      setEditValues(getEditUserInitialValues(user));
      setFieldErrors({});
    }
  }, [mode, user]);

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    const { name, value } = event.target;

    if (mode === 'create') {
      setCreateValues((currentValues) => ({
        ...currentValues,
        [name]: value,
      }));
    } else {
      setEditValues((currentValues) => ({
        ...currentValues,
        [name]: value,
      }));
    }

    setFieldErrors((currentErrors) => ({
      ...currentErrors,
      [name]: undefined,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (mode === 'create') {
      const result = createUserSchema(messages).safeParse(createValues);

      if (!result.success) {
        const flattened = result.error.flatten().fieldErrors;

        setFieldErrors({
          email: flattened.email?.[0],
          name: flattened.name?.[0],
          password: flattened.password?.[0],
          role: flattened.role?.[0],
        });

        return;
      }

      await onSubmit(result.data);

      return;
    }

    const result = editUserSchema(messages).safeParse(editValues);

    if (!result.success) {
      const flattened = result.error.flatten().fieldErrors;

      setFieldErrors({
        name: flattened.name?.[0],
        role: flattened.role?.[0],
      });

      return;
    }

    await onSubmit(result.data);
  }

  return (
    <form
      className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-soft)]"
      onSubmit={handleSubmit}
    >
      <div className="grid gap-5 md:grid-cols-2">
        <TextField
          error={fieldErrors.name}
          label={messages.users.form.name}
          name="name"
          onChange={handleChange}
          placeholder="Jamie Rivera"
          value={values.name}
        />
        {mode === 'create' ? (
          <TextField
            error={fieldErrors.email}
            label={messages.users.form.email}
            name="email"
            onChange={handleChange}
            placeholder="jamie@company.com"
            type="email"
            value={createValues.email}
          />
        ) : (
          <div className="rounded-lg border border-[var(--border)] bg-[var(--card-dark)] px-4 py-3 text-sm leading-6 text-[var(--foreground-muted)]">
            {messages.users.form.emailReadonly}
          </div>
        )}
        {mode === 'create' ? (
          <TextField
            error={fieldErrors.password}
            hint={messages.users.form.passwordHint}
            label={messages.users.form.password}
            name="password"
            onChange={handleChange}
            placeholder={messages.users.form.passwordPlaceholder}
            type="password"
            value={createValues.password}
          />
        ) : (
          <div className="rounded-lg border border-[var(--border)] bg-[var(--card-dark)] px-4 py-3 text-sm leading-6 text-[var(--foreground-muted)]">
            {messages.users.form.passwordReadonly}
          </div>
        )}
        <SelectField
          disabled={disableRoleField}
          error={fieldErrors.role}
          hint={disableRoleField ? roleHint : undefined}
          label={messages.users.form.role}
          name="role"
          onChange={handleChange}
          options={roleOptions}
          value={values.role}
        />
      </div>

      {errorMessage ? (
        <div className="mt-5">
          <InlineBanner tone="error">{errorMessage}</InlineBanner>
        </div>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--accent)] px-5 text-sm font-semibold text-white hover:bg-[var(--accent-strong)] disabled:cursor-not-allowed disabled:opacity-70"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? messages.common.actions.saving : submitLabel}
        </button>
        <Link
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--card-strong)] px-5 text-sm font-semibold text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
          href="/users"
        >
          {messages.common.actions.cancel}
        </Link>
      </div>
    </form>
  );
}
