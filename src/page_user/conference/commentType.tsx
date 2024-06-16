import React from 'react';

// Comment 类型
export type UserComment = {
    id: number;
    userName: string;
    imageUrl: string;
    commentTime: string;
    content: string;
    category: string;
    academicId: string;
    parentId?: number;
    replys: UserComment[];
    parentComment: UserComment | null;
    parentUsername: string | null;
    parentImageUrl: string | null;
};

// 单条评论组件
export const SingleComment: React.FC<{ comment: UserComment }> = ({ comment }) => (
    <>
        <div className="comment-container">
            <div className="user-info">
                <img src={comment.imageUrl} alt="User Avatar" className="avatar" />
                <p className="user-name">{comment.userName}</p>
                <p className="comment-time">{new Date(comment.commentTime).toLocaleDateString()}</p>
            </div>
            <p className="comment-content">{comment.content}</p>
        </div>
        {/* 如果有回复的话 */}
        {comment.replys.length > 0 && (
            <ul>
                {comment.replys.map(reply => (
                    <li key={reply.id}>
                        <div>
                            <p>{reply.userName}</p>
                            <p>{reply.content}</p>
                            <p>{reply.commentTime}</p>
                        </div>
                    </li>
                ))}
            </ul>
        )}
    </>
);
