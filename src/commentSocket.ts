import { Server } from 'socket.io';
import { addComment, deleteComment, getComments } from './commentService';
import { DeleteComment, InputComment, InputCommentList } from './types';
import 'dotenv/config';

export const initCommentSocket = () => {
    return new Server({
        cors: {
            origin: '*',
        },
    })
        .listen(Number(process.env.SOCKET_PORT || 3000))
        .of('/comment')
        .use((socket, next) => {
            // const token = socket.handshake.auth.token;
            // if (token) {
            //     todo check token
            next();
            // } else {
            //     next(new Error('Authentication error'));
            // }
        })
        .on('connection', socket => {
            const deviceName = socket.handshake.query.deviceName as string;
            const debateZoneId = socket.handshake.query.debateZoneId as string;
            // todo get from token
            const userId = socket.handshake.query.userId as string;
            const userFullName = socket.handshake.query.userFullName as string;

            if (!debateZoneId) {
                throw new Error(
                    `Can't join to debateZoneId ${debateZoneId}. Not found in query params`,
                );
            } else {
                socket.join(debateZoneId);
                console.info(
                    `User with "${socket.id}"(socketId) & ${userId}(userId) connected to room: ${debateZoneId}(debateZoneId) from: ${deviceName}(deviceName)`,
                );
            }

            socket.once('onComments', async () => {
                const commentList = await getComments(debateZoneId);
                socket.to(debateZoneId).emit('emitComments', commentList);
            });

            socket.on('onNewComment', async (msg: InputComment) => {
                const newComment = await addComment(
                    msg,
                    debateZoneId,
                    userId,
                    userFullName,
                );
                socket.to(debateZoneId).emit('emitNewComment', newComment);
                socket.broadcast
                    .to(debateZoneId)
                    .emit('broadcastEmitNewComment', newComment);
            });

            socket.on('onDeleteComment', async (msg: DeleteComment) => {
                const deletedComment = await deleteComment(msg.id, userId);

                socket
                    .to(debateZoneId)
                    .emit('emitDeletedComment', deletedComment);
                socket.broadcast
                    .to(debateZoneId)
                    .emit('broadcastEmitDeletedComment', deletedComment);
            });

            socket.on('disconnect', () => {
                socket.leave(debateZoneId);
                console.info(
                    `User with "${socket.id}"(socketId) & ${userId}(userId) disconnected from room ${debateZoneId}(debateZoneId) with ${deviceName}(deviceName)`,
                );
            });
        })
        .on('error', err => {
            console.error(err);
        });
};
