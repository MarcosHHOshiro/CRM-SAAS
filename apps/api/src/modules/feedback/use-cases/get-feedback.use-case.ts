import { Injectable } from '@nestjs/common';

import { FeedbackService } from '../feedback.service';

@Injectable()
export class GetFeedbackUseCase {
  constructor(private readonly feedbackService: FeedbackService) {}

  async execute(organizationId: string, feedbackId: string, viewerUserId: string) {
    const feedback = this.feedbackService.ensureFeedbackExists(
      await this.feedbackService.findByIdWithinOrganization(
        feedbackId,
        organizationId,
      ),
    );

    return {
      feedback: this.feedbackService.serializeFeedbackDetail(feedback, viewerUserId),
    };
  }
}
