import {
    commentSchema,
    deleteCommentSchema,
    inputCommentListSchema,
    inputCommentSchema,
    outputCommentListSchema,
    outputCommentSchema,
} from './zodSchema';
import { z } from 'zod';

export type Comment = z.infer<typeof commentSchema>;
export type InputComment = z.infer<typeof inputCommentSchema>;
export type OutputComment = z.infer<typeof outputCommentSchema>;
export type DeleteComment = z.infer<typeof deleteCommentSchema>;
export type InputCommentList = z.infer<typeof inputCommentListSchema>;
export type OutputCommentList = z.infer<typeof outputCommentListSchema>;
