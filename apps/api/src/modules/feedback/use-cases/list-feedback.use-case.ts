import { Injectable } from '@nestjs/common';

import type { AuthUserPayload } from '../../auth/interfaces/auth-user-payload.interface';
import type { ListFeedbackQueryDto } from '../dto/list-feedback-query.dto';
import { FeedbackService } from '../feedback.service';

@Injectable()
export class ListFeedbackUseCase {
  constructor(private readonly feedbackService: FeedbackService) {}

  async execute(user: AuthUserPayload, query: ListFeedbackQueryDto) {
    const feedbackItems = await this.feedbackService.listWithinOrganization(
      user.organizationId,
      query,
    );

    return {
      feedback: feedbackItems.map((item) =>
        this.feedbackService.serializeFeedbackSummary(item, user.sub),
      ),
    };
  }
}
