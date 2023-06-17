import { BaseDbController } from '../../debate-zone-micro-service-common-library/src/mongoose/baseDbController';
import { Comment } from './types';
import { commentMongooseModel } from './mongooseSchema';

class DbController extends BaseDbController<Comment> {}

export const commentDbController = new DbController(commentMongooseModel);
