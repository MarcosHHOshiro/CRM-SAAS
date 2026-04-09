export type OrganizationRecord = {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
};

export type OrganizationResponse = {
  organization: OrganizationRecord;
};

export type OrganizationFormValues = {
  name: string;
};
