import {Routing} from "express-zod-api"
import {getCommentListEndpoint} from "./endpoint"

export const routing: Routing = {
    v1: {
        comments: {
            list: getCommentListEndpoint
        }
    }
}
