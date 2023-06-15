import {createServer} from "express-zod-api"
import {config} from "./config"
import {routing} from "./route"
import {initCommentSocket} from "./sockets/commentSocket";

createServer(config, routing)

initCommentSocket();

