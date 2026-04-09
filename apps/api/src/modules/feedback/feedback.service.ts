import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { Prisma } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';
import type { ListFeedbackQueryDto } from './dto/list-feedback-query.dto';

type FeedbackRecord = Prisma.FeedbackGetPayload<{
  include: {
    createdBy: true;
    assignedTo: true;
    comments: {
      include: {
        user: true;
      };
      orderBy: {
        createdAt: 'asc';
      };
    };
    votes: true;
  };
}>;

type FeedbackCommentRecord = Prisma.FeedbackCommentGetPayload<{
  include: {
    user: true;
  };
}>;

@Injectable()
export class FeedbackService {
  constructor(private readonly prismaService: PrismaService) {}

  async validateAssigneeWithinOrganization(
    assignedToUserId: string | null | undefined,
    organizationId: string,
  ) {
    if (!assignedToUserId) {
      return null;
    }

    const assignee = await this.prismaService.user.findFirst({
      where: {
        id: assignedToUserId,
        organizationId,
      },
    });

    if (!assignee) {
      throw new BadRequestException(
        'Assigned user must belong to the same organization.',
      );
    }

    return assignee;
  }

  async listWithinOrganization(
    organizationId: string,
    query: ListFeedbackQueryDto,
  ) {
    return this.prismaService.feedback.findMany({
      where: this.buildListWhereInput(organizationId, query),
      include: this.feedbackInclude,
      orderBy: [
        {
          createdAt: 'desc',
        },
      ],
    });
  }

  async findByIdWithinOrganization(
    id: string,
    organizationId: string,
  ) {
    return this.prismaService.feedback.findFirst({
      where: {
        id,
        organizationId,
      },
      include: this.feedbackInclude,
    });
  }

  async create(data: Prisma.FeedbackCreateInput) {
    return this.prismaService.feedback.create({
      data,
      include: this.feedbackInclude,
    });
  }

  async update(id: string, data: Prisma.FeedbackUpdateInput) {
    return this.prismaService.feedback.update({
      where: { id },
      data,
      include: this.feedbackInclude,
    });
  }

  async createComment(data: Prisma.FeedbackCommentCreateInput) {
    return this.prismaService.feedbackComment.create({
      data,
      include: {
        user: true,
      },
    });
  }

  async createVote(data: Prisma.FeedbackVoteCreateInput) {
    return this.prismaService.feedbackVote.create({
      data,
    });
  }

  async removeVote(feedbackId: string, userId: string) {
    return this.prismaService.feedbackVote.delete({
      where: {
        feedbackId_userId: {
          feedbackId,
          userId,
        },
      },
    });
  }

  ensureFeedbackExists(feedback: FeedbackRecord | null) {
    if (!feedback) {
      throw new NotFoundException('Feedback not found.');
    }

    return feedback;
  }

  serializeFeedbackSummary(feedback: FeedbackRecord, viewerUserId: string) {
    return {
      id: feedback.id,
      organizationId: feedback.organizationId,
      title: feedback.title,
      description: feedback.description,
      type: feedback.type,
      status: feedback.status,
      priority: feedback.priority,
      createdByUserId: feedback.createdByUserId,
      assignedToUserId: feedback.assignedToUserId,
      createdBy: this.serializeUserSummary(feedback.createdBy),
      assignedTo: feedback.assignedTo
        ? this.serializeUserSummary(feedback.assignedTo)
        : null,
      voteCount: feedback.votes.length,
      commentCount: feedback.comments.length,
      viewerHasVoted: feedback.votes.some((vote) => vote.userId === viewerUserId),
      createdAt: feedback.createdAt.toISOString(),
      updatedAt: feedback.updatedAt.toISOString(),
    };
  }

  serializeFeedbackDetail(feedback: FeedbackRecord, viewerUserId: string) {
    return {
      ...this.serializeFeedbackSummary(feedback, viewerUserId),
      comments: feedback.comments.map((comment) => this.serializeComment(comment)),
    };
  }

  serializeComment(comment: FeedbackCommentRecord) {
    return {
      id: comment.id,
      organizationId: comment.organizationId,
      feedbackId: comment.feedbackId,
      userId: comment.userId,
      content: comment.content,
      author: this.serializeUserSummary(comment.user),
      createdAt: comment.createdAt.toISOString(),
      updatedAt: comment.updatedAt.toISOString(),
    };
  }

  private serializeUserSummary(user: {
    id: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
  }) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    };
  }

  private buildListWhereInput(
    organizationId: string,
    query: ListFeedbackQueryDto,
  ): Prisma.FeedbackWhereInput {
    return {
      organizationId,
      ...(query.type ? { type: query.type } : {}),
      ...(query.status ? { status: query.status } : {}),
      ...(query.priority ? { priority: query.priority } : {}),
      ...(query.createdByUserId ? { createdByUserId: query.createdByUserId } : {}),
      ...(query.assignedToUserId
        ? { assignedToUserId: query.assignedToUserId }
        : {}),
    };
  }

  private readonly feedbackInclude = {
    createdBy: true,
    assignedTo: true,
    comments: {
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    },
    votes: true,
  } satisfies Prisma.FeedbackInclude;
}
