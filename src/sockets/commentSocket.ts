import { Server } from 'socket.io';
import {
    addComment,
    deleteComment,
    getComments,
} from '../commentDebateZoneService';
import { DeleteComment, InputCommentList } from '../types';

export const initCommentSocket = () => {
    return new Server({
        cors: {
            origin: '*',
        },
    })
        .listen(3000)
        .on('connection', socket => {
            console.info('a user connected');

            socket.on(
                'getComments',
                async (inputCommentList: InputCommentList) => {
                    const comments = await getComments(
                        inputCommentList.debateZoneId,
                        '',
                    );
                    console.log('comments', comments);
                    socket.emit('comments', comments);
                },
            );

            socket.on('addComment', async (msg: any) => {
                const newComment = await addComment(
                    msg,
                    msg.userId,
                    msg.userFirstName,
                );

                socket.emit('newComment', newComment);
                socket.broadcast.emit('newComment', newComment);
            });

            socket.on('deleteComment', async (msg: DeleteComment) => {
                const deletedComment = await deleteComment(msg.id, '');

                socket.emit('deletedComment', deletedComment);
                socket.broadcast.emit('deletedComment', deletedComment);
            });

            socket.on('disconnect', () => {
                console.info('user disconnected');
            });
        })
        .on('error', err => {
            console.error(err);
        });
};
