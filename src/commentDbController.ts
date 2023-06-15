import { BaseDbController } from '../../debate-zone-micro-service-common-library/src/mongoose/baseDbController';
import { Comment } from './types';
import { commentMongooseModel } from './commentMongooseSchema';

class CommentDbController extends BaseDbController<Comment> {}

export const commentDbController = new CommentDbController(
    commentMongooseModel,
);
