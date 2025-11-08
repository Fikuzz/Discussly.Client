import React, { useState } from 'react';
import type { Comment } from '../../types/comment';
import commentService from '../../services/commentService';
import './CommentCard.css';
import CommentForm from './CommentForm';
import UserInfo from '../user/UserInfo';

const commentSvc = new commentService();

const CommentCard: React.FC<{ comment: Comment, isOwner: boolean }> = ({ comment, isOwner }) => {
  
  const [subCommnts, setSubComments] = React.useState<Comment[]>([]);
  const [loadingSubComms, setLoadingSubComms] = React.useState<boolean>(true);
  const [commenting, setCommenting] = useState(false);

  const onCommentingCancel = () => {
    setCommenting(false);
  }; 

  const onCommentingStart = () => {
    setCommenting(true);
  }

  React.useEffect(() => {
    const loadSubComments = async () => {
      try {
        const data = await commentSvc.getSubComments(comment.id);
        setSubComments(data);
      } catch (error) {
        console.error("Failed to fetch sub-comments:", error);
      }finally {
        setLoadingSubComms(false);
      }
    };

    loadSubComments();
  }, [comment.id]);

  return (
    <div className="comment_card">
      <div className="comment">
        <div className="comment__content">
          <div className="comment__header">
            <UserInfo
              user = {comment.author}
              createdAt= {comment.createdAt}/>
          </div>

          <div className="comment__text">
            <p>{comment.text}</p>
          </div>

          <div className="comment__actions">
            <button 
              className="comment__action"
              onClick={() => console.log("like comment", comment.id)}
            >
              👍 null
            </button>

            <button 
              className="comment__action"
              onClick={() => onCommentingStart()}
            >
              💬 Ответить
            </button>

            {isOwner && (
            <>
              <button 
                className="comment__action"
                onClick={() => console.log("edit comment", comment.id)}
              >
                ✏️
              </button>
              
              <button 
                className="comment__action comment__action--danger"
                onClick={() => console.log("delete comment", comment.id)}
              >
                🗑️
              </button>
            </>
            )}
          </div>
          {commenting &&
            <CommentForm key={comment.id} onCancel={onCommentingCancel} post={comment.postId} comment={comment.id}/>
          }
        </div>
        {/* Подкомментарии */}
        <div className="comment__subcomments">
          {loadingSubComms ? (
            <div>Загрузка подкомментариев...</div>
          ) : (
            subCommnts.map((subComment) => (
              <CommentCard 
                key={subComment.id} 
                comment={subComment}
                isOwner={false}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentCard;