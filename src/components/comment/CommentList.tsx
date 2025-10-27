import React from 'react';
import './CommentList.css';
import commentService from '../../services/commentService';
import postService from '../../services/postService';
import CommentCard from './CommentCard';
import type { Comment } from '../../types/comment';

const commentSvc = new commentService();
const postSvc = new postService();

const CommentList: React.FC<{ parentId: string, isSubCom:boolean}> = ({ parentId, isSubCom }) => {

    const[comments, setComments] = React.useState<Comment[]>([]);
    const [loading, setLoading] = React.useState<boolean>(true);

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
    <div className="comment-list">
      {/* Заголовок с количеством комментариев */}
      {comments.length < 0 && (
        <div className="comment-list__header">
          <h3 className="comment-list__title">
            Комментарии {comments.length > 0 && `(${comments.length})`}
          </h3>
        </div>
      )}
      
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
  );
};

export default CommentList;