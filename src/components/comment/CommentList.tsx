import React, { useState } from 'react';
import './CommentList.css';
import commentService from '../../services/commentService';
import postService from '../../services/postService';
import CommentCard from './CommentCard';
import type { Comment } from '../../types/comment';
import CommentForm from './CommentForm';

const commentSvc = new commentService();
const postSvc = new postService();

const CommentList: React.FC<{ parentId: string, isSubCom:boolean}> = ({ parentId, isSubCom }) => {

    const [comments, setComments] = React.useState<Comment[]>([]);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [commenting, setCommenting] = useState(false);
    
    const onCommentingCancel = () => {
      setCommenting(false)
    }

    const onCommentAdd = (comment: Comment) => {
      setComments(prev => [comment, ...prev]);
    }

    React.useEffect(() => {
        const loadComments = async () => {
            try {
                let data: Comment[] = [];
                if (isSubCom) {
                    data = await commentSvc.getSubComments(parentId);
                } else {
                    data = await postSvc.getPostComment(parentId);
                }
                setComments(data);
            } catch (error) {
                console.error("Failed to fetch comments:", error);
            }
            finally {
                setLoading(false);
            }
        };

        loadComments();
    }, [parentId, isSubCom]);

    if (loading) {
        return <div>Загрузка комментариев...</div>;
    }

  return (
    <div>
      {commenting ? (
        <CommentForm post={parentId} addComment={onCommentAdd} onCancel={onCommentingCancel} comment={undefined}/>
      ):(
        <button className="comment-button"
          onClick={() => setCommenting(!commenting)}>
            Оставить комментарий
        </button>
      )}
      <div className="comment-list__header">
        <h2 className="comment-list__title">
          Комментарии
        </h2>
      </div>
      <div className="comment-list">
       {/* Список комментариев */}
       <div className="comment-list__content">
         {comments.length === 0 ? (
           <div className="comment-list__empty">Комментариев пока нет.</div>
         ) : (
             comments.map((comment) => (
                 <CommentCard key={comment.id} comment={comment} isOwner={false} />
             ))
         )}
        </div>
      </div>
    </div>
  );
};

export default CommentList;