import { LoadingScreen } from '@/components/LoadingScreen';
import { getRequestI18n } from '@/i18n/request';

export default async function GlobalLoading() {
  const { messages } = await getRequestI18n();

  return (
    <LoadingScreen
      description={messages.common.loading.description}
      title={messages.common.loading.title}
    />
  );
}
