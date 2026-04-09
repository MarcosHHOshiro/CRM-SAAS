import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from '@/features/auth/constants/auth-cookies';
import { DEFAULT_PRIVATE_ROUTE } from '@/lib/routes';

export default async function HomePage() {
  const cookieStore = await cookies();
  const hasSession =
    cookieStore.has(ACCESS_TOKEN_COOKIE) || cookieStore.has(REFRESH_TOKEN_COOKIE);

  redirect(hasSession ? DEFAULT_PRIVATE_ROUTE : '/login');
}
