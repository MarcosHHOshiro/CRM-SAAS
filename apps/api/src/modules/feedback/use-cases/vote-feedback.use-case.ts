import { Injectable } from '@nestjs/common';

import type { AuthUserPayload } from '../../auth/interfaces/auth-user-payload.interface';
import { FeedbackService } from '../feedback.service';

@Injectable()
export class VoteFeedbackUseCase {
  constructor(private readonly feedbackService: FeedbackService) {}

  async execute(user: AuthUserPayload, feedbackId: string) {
    const feedback = this.feedbackService.ensureFeedbackExists(
      await this.feedbackService.findByIdWithinOrganization(
        feedbackId,
        user.organizationId,
      ),
    );

    const hasVoted = feedback.votes.some((vote) => vote.userId === user.sub);

    if (hasVoted) {
      await this.feedbackService.removeVote(feedback.id, user.sub);
    } else {
      await this.feedbackService.createVote({
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
      });
    }

    const updatedFeedback = this.feedbackService.ensureFeedbackExists(
      await this.feedbackService.findByIdWithinOrganization(
        feedbackId,
        user.organizationId,
      ),
    );

    return {
      feedback: this.feedbackService.serializeFeedbackSummary(
        updatedFeedback,
        user.sub,
      ),
    };
  }
}
