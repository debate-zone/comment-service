import { Server } from 'socket.io';
import { addComment, deleteComment, getComments } from './commentService';
import { DeleteComment, InputComment } from './types';
import 'dotenv/config';
import { verify } from '../../debate-zone-micro-service-common-library/src/auth/token';
import { OutputDecodedToken } from '../../debate-zone-micro-service-common-library/src/types/auth';

export const initCommentSocket = () => {
    return new Server({
        cors: {
            origin: '*',
        },
    })
        .listen(Number(process.env.SOCKET_PORT || 3001))
        .of('/comment')
        .on('connection', async socket => {
            let userId: string;
            let userFullName: string;
            const deviceName = socket.handshake.query.deviceName as string;
            const debateZoneId = socket.handshake.query.debateZoneId as string;

            const token = socket.handshake.auth.token;
            if (token) {
                const outputDecodedToken: OutputDecodedToken = await verify(
                    token,
                );

                userId = outputDecodedToken.userId;
                userFullName = outputDecodedToken.userFullName;
            } else {
                socket.disconnect(true);
                throw new Error('Authentication error');
            }

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
