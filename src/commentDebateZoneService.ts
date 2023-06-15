import { InputComment, OutputComment, OutputCommentList } from './types';
import { commentDbController } from './commentDbController';
import { createHttpError } from 'express-zod-api';

export const addComment = async (
    input: InputComment,
    userId: string,
    userFirstName: string,
): Promise<OutputComment> => {
    const comment = await commentDbController.create({
        userId: userId,
        userFirstName: userFirstName,
        ...input,
    });
    const { __v, ...rest } = comment;
    return rest;
};

export const deleteComment = async (
    commentId: string,
    userId: string,
): Promise<OutputComment> => {
    const comment = await commentDbController.delete(commentId);
    if (!comment) {
        throw createHttpError(404, 'Comment not found');
    } else if (comment.userId.toString() !== userId) {
        throw createHttpError(403, 'User not allowed to delete comment');
    } else {
        const { __v, ...rest } = comment;
        return rest;
    }
};

export const getComments = async (
    debateZoneId: string,
    userId: string,
): Promise<OutputCommentList> => {
    return {
        comments: [
            {
                _id: '1',
                userId: '1',
                userFirstName: 'John',
                debateZoneId: '1',
                createdAt: new Date(),
                text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                updatedAt: new Date(),
                isDeleted: false,
            },
            {
                _id: '2',
                userId: '2',
                userFirstName: 'Jane',
                debateZoneId: '1',
                createdAt: new Date(),
                updatedAt: new Date(),
                isDeleted: false,
                text: 'Lorem ipsum dolor sit amet...',
            },
        ],
    };

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
