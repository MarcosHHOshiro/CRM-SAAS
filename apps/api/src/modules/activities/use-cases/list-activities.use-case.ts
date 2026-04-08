import { Injectable } from '@nestjs/common';

import type { ListActivitiesQueryDto } from '../dto/list-activities-query.dto';
import { ActivitiesService } from '../activities.service';

@Injectable()
export class ListActivitiesUseCase {
  constructor(private readonly activitiesService: ActivitiesService) {}

  async execute(organizationId: string, query: ListActivitiesQueryDto) {
    const activities = await this.activitiesService.listWithinOrganization(
      organizationId,
      query,
    );

    return {
      activities: activities.map((activity) =>
        this.activitiesService.serializeActivity(activity),
      ),
    };
  }
}
