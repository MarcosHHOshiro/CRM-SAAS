import { useTranslation } from '@/i18n/use-translation';

type UserStatusBadgeProps = Readonly<{
  isActive: boolean;
}>;

export function UserStatusBadge({ isActive }: UserStatusBadgeProps) {
  const { messages } = useTranslation();

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
      }`}
    >
      {isActive ? messages.users.table.active : messages.users.table.inactive}
    </span>
  );
}
