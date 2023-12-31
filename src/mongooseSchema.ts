import mongoose, { Types } from 'mongoose';
import { baseSchema } from '../../debate-zone-micro-service-common-library/src/mongoose/baseSchema';
import { CollectionsEnum } from '../../debate-zone-micro-service-common-library/src/enums/collectionsEnum';
import { Comment } from './types';

export type CommentDocument = Document & Comment;

const mongooseSchema: mongoose.Schema = baseSchema.add({
    userId: {
        type: Types.ObjectId,
        ref: CollectionsEnum.USER,
        required: true,
    },
    userFullName: {
        type: String,
        required: true,
    },
    toUserId: {
        type: Types.ObjectId,
        ref: CollectionsEnum.USER,
    },
    toUserFullName: {
        type: String,
    },
    text: {
        type: String,
        required: true,
    },
    debateZoneId: {
        type: Types.ObjectId,
        ref: CollectionsEnum.DEBATE_ZONE,
        required: true,
    },
});

export const commentMongooseModel = mongoose.model<CommentDocument>(
    CollectionsEnum.COMMENT,
    mongooseSchema,
);
