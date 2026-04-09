import type {
  OrganizationFormValues,
  OrganizationRecord,
} from '../types/organization-settings';

const dateTimeFormatter = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

export function formatOrganizationDate(value: string) {
  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return 'Unknown date';
  }

  return dateTimeFormatter.format(parsedDate);
}

export function getOrganizationInitialValues(
  organization: OrganizationRecord,
): OrganizationFormValues {
  return {
    name: organization.name,
  };
}

export function getOrganizationSuccessMessage(success: string | null) {
  const messages: Record<string, string> = {
    updated: 'Organization updated successfully.',
  };

  return success ? messages[success] ?? null : null;
}
