import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';

import type { AuthUserPayload } from '../../auth/interfaces/auth-user-payload.interface';
import type { UpdateFeedbackDto } from '../dto/update-feedback.dto';
import { FeedbackService } from '../feedback.service';

@Injectable()
export class UpdateFeedbackUseCase {
  constructor(private readonly feedbackService: FeedbackService) {}

  async execute(user: AuthUserPayload, feedbackId: string, dto: UpdateFeedbackDto) {
    const feedback = this.feedbackService.ensureFeedbackExists(
      await this.feedbackService.findByIdWithinOrganization(
        feedbackId,
        user.organizationId,
      ),
    );

    await this.feedbackService.validateAssigneeWithinOrganization(
      dto.assignedToUserId,
      user.organizationId,
    );

    const data: Prisma.FeedbackUpdateInput = {
      ...(dto.title !== undefined ? { title: dto.title } : {}),
      ...(dto.description !== undefined ? { description: dto.description } : {}),
      ...(dto.type !== undefined ? { type: dto.type } : {}),
      ...(dto.status !== undefined ? { status: dto.status } : {}),
      ...(dto.priority !== undefined ? { priority: dto.priority } : {}),
      ...(dto.assignedToUserId !== undefined
        ? dto.assignedToUserId
          ? {
              assignedTo: {
                connect: {
                  id: dto.assignedToUserId,
                },
              },
            }
          : {
              assignedTo: {
                disconnect: true,
              },
            }
        : {}),
    };

    const updatedFeedback = await this.feedbackService.update(feedback.id, data);

    return {
      feedback: this.feedbackService.serializeFeedbackSummary(
        updatedFeedback,
        user.sub,
      ),
    };
  }
}
