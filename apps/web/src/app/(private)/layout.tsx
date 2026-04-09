import { AuthGuard } from '@/features/auth/components/AuthGuard';

type PrivateLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function PrivateLayout({ children }: PrivateLayoutProps) {
  return <AuthGuard>{children}</AuthGuard>;
}
