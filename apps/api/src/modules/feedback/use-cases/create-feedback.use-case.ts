import { Injectable } from '@nestjs/common';
import {
  FeedbackPriority,
  FeedbackStatus,
} from '@prisma/client';

import type { AuthUserPayload } from '../../auth/interfaces/auth-user-payload.interface';
import type { CreateFeedbackDto } from '../dto/create-feedback.dto';
import { FeedbackService } from '../feedback.service';

@Injectable()
export class CreateFeedbackUseCase {
  constructor(private readonly feedbackService: FeedbackService) {}

  async execute(user: AuthUserPayload, dto: CreateFeedbackDto) {
    await this.feedbackService.validateAssigneeWithinOrganization(
      dto.assignedToUserId,
      user.organizationId,
    );

    const feedback = await this.feedbackService.create({
      organization: {
        connect: {
          id: user.organizationId,
        },
      },
      createdBy: {
        connect: {
          id: user.sub,
        },
      },
      ...(dto.assignedToUserId
        ? {
            assignedTo: {
              connect: {
                id: dto.assignedToUserId,
              },
            },
          }
        : {}),
      title: dto.title,
      description: dto.description,
      type: dto.type,
      status: dto.status ?? FeedbackStatus.BACKLOG,
      priority: dto.priority ?? FeedbackPriority.MEDIUM,
    });

    return {
      feedback: this.feedbackService.serializeFeedbackSummary(feedback, user.sub),
    };
  }
}
