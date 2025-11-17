import React, { useState } from 'react';
import './CommentList.css';
import postService from '../../services/postService';
import CommentTree from './CommentTree';
import type { Comment } from '../../types/comment';
import CommentForm from './CommentForm';

const postSvc = new postService();

const CommentList: React.FC<{ parentId: string}> = ({ parentId }) => {

  const [comments, setComments] = React.useState<Comment[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [showCommentForm, setShowCommentForm] = useState(false);
  
  const onCommentAdd = (comment: Comment) => {
    setComments(prev => [comment, ...prev]);
  }
  React.useEffect(() => {
      const loadComments = async () => {
          try {
              let data: Comment[] = [];
                  data = await postSvc.getPostComment(parentId);
              setComments(data);
          } catch (error) {
              console.error("Failed to fetch comments:", error);
          }
          finally {
              setLoading(false);
          }
      };
      loadComments();
  }, [parentId]);
  if (loading) {
      return <div>Загрузка комментариев...</div>;
  }

  return (
    <div className='comment-list'>
      {showCommentForm ? (
        <CommentForm 
          postId={parentId} 
          onCommentAdded={onCommentAdd} 
          onCancel={() => setShowCommentForm(false)} 
          parentCommentId={undefined}
        />
      ):(
        <button className="comment-button"
          onClick={() => setShowCommentForm(true)}>
            Оставить комментарий
        </button>
      )}
      <div className="comment-list__header">
        <h2 className="comment-list__title">
          Комментарии
        </h2>
      </div>

      <div className="comment-tree">
         {comments.length === 0 ? (
           <div className="comment-list__empty">Комментариев пока нет.</div>
         ) : (
             comments.map((comment) => (
                 <CommentTree key={comment.id} comment={comment} isOwner={false} isRoot={true}/>
             ))
         )}
      </div>
    </div>
  );
};

export default CommentList;