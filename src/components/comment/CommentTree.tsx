import React, { useState } from 'react';
import type { Comment } from '../../types/comment';
import commentService from '../../services/commentService';
import './CommentTree.css';
import CommentForm from './CommentForm';
import UserInfo from '../user/UserInfo';
import Vote from './Vote';
import { useAuth } from '../../hooks/useAuth';

const commentSvc = new commentService();

interface CommentTreeProps {
  comment: Comment;
  isOwner?: boolean;
  depth?: number;
  isRoot?: boolean;
}

const CommentTree: React.FC<CommentTreeProps> = ({ 
  comment,
  isOwner = false,
  depth = 0,
  isRoot = false
}) => {
  
  const {user} = useAuth();
  const [userVote, setUserVote] = useState(0);
  const [commentScore, setCommentScore] = useState(0); 
  const [subComments, setSubComments] = React.useState<Comment[]>([]);
  const [loadingSubComms, setLoadingSubComms] = React.useState<boolean>(true);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleReplyForm = () => setShowReplyForm(!showReplyForm);

  const handleReplyAdded = (newComment: Comment) => {
    setSubComments(prev => [newComment, ...prev]);
  }

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  const handleVote = async(vote: number) => {
    if(user){
      vote = userVote == vote ? 0 : vote;
      await commentSvc.sendUserVote(comment.id, vote);
      setCommentScore(commentScore - userVote + vote);
      setUserVote(vote);
    }
  }

  const handleLineClick = () => {
    if (hasChildren) {
      setIsCollapsed(!isCollapsed);
    }
  };

  const hasChildren = subComments && subComments.length > 0;
  const childCount = subComments?.length || 0;

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
    
    setCommentScore(comment.score);
    loadSubComments();
  }, [comment]);

  React.useEffect(() => {
    const getUserVote = async() => {
      try{
        if(user)
        {
          const userVote = await commentSvc.getUserVote(comment.id);
          setUserVote(userVote);
        }
      }
      catch(exeption){
        console.log(exeption);
      }
    }

    getUserVote();
  }, [comment.id, user])

  return (
    <div className={`comment-node ${isRoot ? 'comment-node--root' : ''}`}>
      <div className="comment-card">
        <div className="comment-header">
          <div className="comment-meta">
            <UserInfo
              user = {comment.author}
              createdAt= {comment.createdAt}/>
          </div>

          {hasChildren && (
            <button 
              className="collapse-btn"
              onClick={toggleCollapse}
              title={isCollapsed ? 'Развернуть' : 'Свернуть'}
            >
              <span className={`collapse-btn__icon ${isCollapsed ? 'collapse-btn__icon--collapsed' : ''}`}>
                ▼
              </span>
              <span className="reply-count">
                {childCount}
              </span>
            </button>
          )}
          </div>
          {comment.mediaFileName &&
          <div className='comment-media'>
            <img className='comment-media-image' src={`/media/${comment.mediaFileName}`}/>
          </div>
          }

          <div className="comment__text">
            <p className='comment-text'>{comment.text}</p>
          </div>

          <div className="comment-actions">
            <Vote 
              userVote={userVote} 
              score={commentScore} 
              handleVote={handleVote}
            />

            <button 
              className="comment-action"
              onClick={toggleReplyForm}
            >
              💬 Ответить
            </button>

            {isOwner && (
            <>
              <button 
                className="comment-action"
                onClick={() => console.log("edit comment", comment.id)}
              >
                ✏️
              </button>
              
              <button 
                className="comment-action comment-action--danger"
                onClick={() => console.log("delete comment", comment.id)}
              >
                🗑️
              </button>
            </>
            )}
          </div>
          {showReplyForm &&
            <div className='comment-reply-form'>
              <CommentForm
                postId={comment.postId}
                parentCommentId={comment.id}
                onCommentAdded={handleReplyAdded}
                onCancel={() => setShowReplyForm(false)}/>
            </div>
          }
      </div>
        {hasChildren && (
          <>
            {loadingSubComms ? (
              <>Загрузка...</>
            ):(
              <>

                <div 
                  className={isCollapsed ? "collapsed-indicator" : "collapsed"}
                  onClick={toggleCollapse}
                >
                  <span>▶</span>
                  <span>Показать {childCount} ответов</span>
                </div>

              <div className={isCollapsed ? "collapsed" : ""}>

                {subComments.map(child => (
                  <div className='comment-children'>
                    <div className='comment-children-line'>
                      {/* Вертикальная линия */}
                      {hasChildren && (
                        <div 
                          className="comment-connector"
                          onClick={handleLineClick}
                          title="Свернуть ветку"
                        />
                      )}
                      
                      {/* Горизонтальная линия */}
                      <div 
                        className="comment-connector-horizontal"
                        onClick={handleLineClick}
                        title="Свернуть ветку"
                      />
                    </div>
                    <CommentTree
                      key={child.id}
                      comment={child}
                      depth={depth + 1}
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default CommentTree;