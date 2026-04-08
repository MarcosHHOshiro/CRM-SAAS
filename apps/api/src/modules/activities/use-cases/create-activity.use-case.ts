import { Injectable } from '@nestjs/common';

import type { AuthUserPayload } from '../../auth/interfaces/auth-user-payload.interface';
import type { CreateActivityDto } from '../dto/create-activity.dto';
import { ActivitiesService } from '../activities.service';

@Injectable()
export class CreateActivityUseCase {
  constructor(private readonly activitiesService: ActivitiesService) {}

  async execute(user: AuthUserPayload, dto: CreateActivityDto) {
    const relations = await this.activitiesService.resolveRelatedEntities(
      user.organizationId,
      dto,
    );

    const activity = await this.activitiesService.create({
      organization: {
        connect: {
          id: user.organizationId,
        },
      },
      user: {
        connect: {
          id: user.sub,
        },
      },
      ...(relations.leadId
        ? {
            lead: {
              connect: {
                id: relations.leadId,
              },
            },
          }
        : {}),
      ...(relations.clientId
        ? {
            client: {
              connect: {
                id: relations.clientId,
              },
            },
          }
        : {}),
      ...(relations.opportunityId
        ? {
            opportunity: {
              connect: {
                id: relations.opportunityId,
              },
            },
          }
        : {}),
      type: dto.type,
      title: this.activitiesService.buildTitle(dto.type),
      description: dto.description,
    });

    return {
      activity: this.activitiesService.serializeActivity(activity),
    };
  }
}
