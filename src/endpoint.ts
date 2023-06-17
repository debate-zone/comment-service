import { createMiddleware, defaultEndpointsFactory } from 'express-zod-api';
import { getComments } from './commentService';
import { z } from 'zod';
import { inputCommentListSchema, outputCommentListSchema } from './zodSchema';

export const authMiddleware = createMiddleware({
    input: z.object({}),
    middleware: async ({ input: {}, request, logger }) => {
        const userId = request.headers['x-user-id'] as string;
        const userRole = request.headers['x-user-role'] as string;

        return {
            userId,
            userRole,
        };
    },
});

export const endpointsFactory =
    defaultEndpointsFactory.addMiddleware(authMiddleware);

export const getCommentListEndpoint = endpointsFactory.build({
    method: 'get',
    shortDescription: 'Get comment list',
    description: 'Get comment list',
    input: inputCommentListSchema,
    output: outputCommentListSchema,
    handler: async ({ input, options, logger }) => {
        logger.debug('Options:', options);
        return await getComments(input.debateZoneId);
    },
});
