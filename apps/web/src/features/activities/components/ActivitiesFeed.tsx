import type { Activity } from '../types/activities';

import { ActivityFeedItem } from './ActivityFeedItem';

type ActivitiesFeedProps = Readonly<{
  activities: Activity[];
}>;

export function ActivitiesFeed({ activities }: ActivitiesFeedProps) {
  return (
    <section className="space-y-4">
      {activities.map((activity) => (
        <ActivityFeedItem key={activity.id} activity={activity} />
      ))}
    </section>
  );
}
