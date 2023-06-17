import { createServer } from 'express-zod-api';
import { config } from './config';
import { routing } from './route';
import { initCommentSocket } from './commentSocket';

createServer(config, routing);

initCommentSocket();
