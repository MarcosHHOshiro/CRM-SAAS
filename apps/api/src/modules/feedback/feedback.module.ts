import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackCommentUseCase } from './use-cases/create-feedback-comment.use-case';
import { CreateFeedbackUseCase } from './use-cases/create-feedback.use-case';
import { GetFeedbackUseCase } from './use-cases/get-feedback.use-case';
import { ListFeedbackUseCase } from './use-cases/list-feedback.use-case';
import { UpdateFeedbackUseCase } from './use-cases/update-feedback.use-case';
import { VoteFeedbackUseCase } from './use-cases/vote-feedback.use-case';

@Module({
  imports: [AuthModule],
  controllers: [FeedbackController],
  providers: [
    FeedbackService,
    CreateFeedbackUseCase,
    ListFeedbackUseCase,
    GetFeedbackUseCase,
    UpdateFeedbackUseCase,
    CreateFeedbackCommentUseCase,
    VoteFeedbackUseCase,
  ],
})
export class FeedbackModule {}
