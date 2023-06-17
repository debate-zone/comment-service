import { InputComment, OutputComment, OutputCommentList } from './types';
import { commentDbController } from './dbController';
import { createHttpError } from 'express-zod-api';

export const addComment = async (
    input: InputComment,
    debateZoneId: string,
    userId: string,
    userFullName: string,
): Promise<OutputComment> => {
    const comment = await commentDbController.create({
        userId: userId,
        userFullName: userFullName,
        debateZoneId: debateZoneId,
        ...input,
    });
    const { __v, ...rest } = comment;
    return rest;
};

export const deleteComment = async (
    commentId: string,
    userId: string,
): Promise<OutputComment> => {
    const comment = await commentDbController.delete(commentId, {
        userId: userId,
    });

    if (!comment) {
        throw createHttpError(404, 'Comment not found');
    } else {
        const { __v, ...rest } = comment;
        return rest;
    }
};

export const getComments = async (
    debateZoneId: string,
): Promise<OutputCommentList> => {
    const comments = await commentDbController.findAll(
        {
            debateZoneId: debateZoneId,
        },
        { createdAt: 'desc' },
    );

    const outputComments: OutputComment[] = [];

    comments.forEach(comment => {
        const { __v, ...rest } = comment;
        outputComments.push(rest);
    });

    return {
        comments: outputComments,
    };
};
