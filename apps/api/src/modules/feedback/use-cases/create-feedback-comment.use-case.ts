import { Injectable } from '@nestjs/common';

import type { AuthUserPayload } from '../../auth/interfaces/auth-user-payload.interface';
import type { CreateFeedbackCommentDto } from '../dto/create-feedback-comment.dto';
import { FeedbackService } from '../feedback.service';

@Injectable()
export class CreateFeedbackCommentUseCase {
  constructor(private readonly feedbackService: FeedbackService) {}

  async execute(
    user: AuthUserPayload,
    feedbackId: string,
    dto: CreateFeedbackCommentDto,
  ) {
    const feedback = this.feedbackService.ensureFeedbackExists(
      await this.feedbackService.findByIdWithinOrganization(
        feedbackId,
        user.organizationId,
      ),
    );

    const comment = await this.feedbackService.createComment({
      organization: {
        connect: {
          id: user.organizationId,
        },
      },
      feedback: {
        connect: {
          id: feedback.id,
        },
      },
      user: {
        connect: {
          id: user.sub,
        },
      },
      content: dto.content,
    });

    return {
      comment: this.feedbackService.serializeComment(comment),
    };
  }
}
