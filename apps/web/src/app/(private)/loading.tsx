import { LoadingScreen } from '@/components/LoadingScreen';
import { getRequestI18n } from '@/i18n/request';

export default async function PrivateLoadingPage() {
  const { messages } = await getRequestI18n();

  return (
    <LoadingScreen
      description={messages.common.loading.privateDescription}
      title={messages.common.loading.privateTitle}
    />
  );
}
