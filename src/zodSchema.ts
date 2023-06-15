import { z } from 'zod';
import {
    baseZodSchema,
    idObjectIdsSchema,
} from '../../debate-zone-micro-service-common-library/src/zod/baseZodSchema';

export const commentSchema = baseZodSchema.extend({
    debateZoneId: idObjectIdsSchema,
    userId: idObjectIdsSchema,
    userFirstName: z.string(),
    parentId: idObjectIdsSchema.optional(),
    toUserId: idObjectIdsSchema.optional(),
    toUserFirstName: z.string().optional(),
    text: z.string(),
});

export const inputCommentSchema = commentSchema.omit({
    _id: true,
    __v: true,
    createdAt: true,
    updatedAt: true,
    userId: true,
    userFirstName: true,
    isDeleted: true,
});

export const outputCommentSchema = commentSchema.omit({
    __v: true,
});

export const deleteCommentSchema = z.object({
    id: idObjectIdsSchema,
});

export const inputCommentListSchema = z.object({
    debateZoneId: idObjectIdsSchema,
});

export const outputCommentListSchema = z.object({
    comments: z.array(outputCommentSchema),
});
