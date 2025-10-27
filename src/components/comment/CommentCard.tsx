import React from 'react';
import type { Comment } from '../../types/comment';
import { DateUtils } from '../../utils/dateUtils';
import './CommentCard.css';

const CommentCard: React.FC<{ comment: Comment, isOwner: boolean }> = ({ comment, isOwner }) => {
  console.log("Rendering CommentCard for comment:", comment);
  return (
    <div className="comment">
      <div className="comment__avatar">
        {comment.author.avatarFileName ? (
          <img 
            src={`/avatars/${comment.author.avatarFileName}`} 
            alt={comment.author.username}
          />
        ) : (
          <div className="avatar-small">
            {comment.author.username?.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      <div className="comment__content">
        <div className="comment__header">
          <span className="comment__author">{comment.author.username}</span>
          <span className="comment__date">
            {DateUtils.normalize(comment.createdAt, "timeago")}
            {comment.isEdited && <span> (ред.)</span>}
          </span>
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
            onClick={() => console.log("reply to comment", comment.id)}
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
      </div>
    </div>
  );
};

export default CommentCard;