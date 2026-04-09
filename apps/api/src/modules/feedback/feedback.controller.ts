import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import type { AuthUserPayload } from '../auth/interfaces/auth-user-payload.interface';
import { CreateFeedbackCommentDto } from './dto/create-feedback-comment.dto';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { ListFeedbackQueryDto } from './dto/list-feedback-query.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { CreateFeedbackCommentUseCase } from './use-cases/create-feedback-comment.use-case';
import { CreateFeedbackUseCase } from './use-cases/create-feedback.use-case';
import { GetFeedbackUseCase } from './use-cases/get-feedback.use-case';
import { ListFeedbackUseCase } from './use-cases/list-feedback.use-case';
import { UpdateFeedbackUseCase } from './use-cases/update-feedback.use-case';
import { VoteFeedbackUseCase } from './use-cases/vote-feedback.use-case';

@UseGuards(JwtAuthGuard)
@Controller('feedback')
export class FeedbackController {
  constructor(
    private readonly createFeedbackUseCase: CreateFeedbackUseCase,
    private readonly listFeedbackUseCase: ListFeedbackUseCase,
    private readonly getFeedbackUseCase: GetFeedbackUseCase,
    private readonly updateFeedbackUseCase: UpdateFeedbackUseCase,
    private readonly createFeedbackCommentUseCase: CreateFeedbackCommentUseCase,
    private readonly voteFeedbackUseCase: VoteFeedbackUseCase,
  ) {}

  @Post()
  createFeedback(
    @CurrentUser() user: AuthUserPayload,
    @Body() dto: CreateFeedbackDto,
  ) {
    return this.createFeedbackUseCase.execute(user, dto);
  }

  @Get()
  listFeedback(
    @CurrentUser() user: AuthUserPayload,
    @Query() query: ListFeedbackQueryDto,
  ) {
    return this.listFeedbackUseCase.execute(user, query);
  }

  @Get(':id')
  getFeedback(
    @CurrentUser() user: AuthUserPayload,
    @Param('id', new ParseUUIDPipe()) feedbackId: string,
  ) {
    return this.getFeedbackUseCase.execute(user.organizationId, feedbackId, user.sub);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.OWNER, UserRole.MANAGER)
  @Patch(':id')
  updateFeedback(
    @CurrentUser() user: AuthUserPayload,
    @Param('id', new ParseUUIDPipe()) feedbackId: string,
    @Body() dto: UpdateFeedbackDto,
  ) {
    return this.updateFeedbackUseCase.execute(user, feedbackId, dto);
  }

  @Post(':id/comment')
  createFeedbackComment(
    @CurrentUser() user: AuthUserPayload,
    @Param('id', new ParseUUIDPipe()) feedbackId: string,
    @Body() dto: CreateFeedbackCommentDto,
  ) {
    return this.createFeedbackCommentUseCase.execute(user, feedbackId, dto);
  }

  @Post(':id/vote')
  voteFeedback(
    @CurrentUser() user: AuthUserPayload,
    @Param('id', new ParseUUIDPipe()) feedbackId: string,
  ) {
    return this.voteFeedbackUseCase.execute(user, feedbackId);
  }
}
