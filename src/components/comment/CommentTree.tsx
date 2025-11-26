import React, { useRef, useState } from 'react';
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
  depth?: number;
  isRoot?: boolean;
  onDeleting: (comment: Comment) => void;
}

const CommentTree: React.FC<CommentTreeProps> = ({ 
  comment,
  depth = 0,
  isRoot = false,
  onDeleting
}) => {
  
  const {user} = useAuth();
  const [userVote, setUserVote] = useState(0);
  const [commentScore, setCommentScore] = useState(0); 
  const [subComments, setSubComments] = React.useState<Comment[]>([]);
  const [loadingSubComms, setLoadingSubComms] = React.useState<boolean>(true);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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

  const handleDelete = async() => {
    if(confirm(`Вы действительно хотите удалить этот комментарий: "${comment.text}"`))
    {
      try
      {
        await commentSvc.deleteComment(comment.id);
        onDeleting(comment)
      }
      catch(ex)
      {
        console.error(ex);
      }
    }
  }

  const RemoveReply = (comment: Comment) => {
    setSubComments(prev => prev.filter(c => c.id !== comment.id));
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

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen])

  return (
    <div className={`comment-node ${isRoot ? 'comment-node--root' : ''}`}>
      <div className="comment-card">
        <div className="comment-header">
          <div className="comment-meta">
            <UserInfo
              user = {comment.author}
              createdAt= {comment.createdAt}/>
            {user?.id === comment.author.id &&
            <button className='menu-btn' 
                    onFocus={() => setIsMenuOpen(!isMenuOpen)}>
              <svg fill="#888888ff" width="24px" height="24px" viewBox="0 0 32 32">
                <g id="SVGRepo_iconCarrier">
                  <path d="M13,16c0,1.654,1.346,3,3,3s3-1.346,3-3s-1.346-3-3-3S13,14.346,13,16z" id="XMLID_294_"></path>
                  <path d="M13,26c0,1.654,1.346,3,3,3s3-1.346,3-3s-1.346-3-3-3S13,24.346,13,26z" id="XMLID_295_"></path>
                  <path d="M13,6c0,1.654,1.346,3,3,3s3-1.346,3-3s-1.346-3-3-3S13,4.346,13,6z" id="XMLID_297_"></path>
                  </g>
              </svg>
            </button>
            }
            {isMenuOpen &&
              <div className='menu' ref={menuRef}>
                <button className='menu-item'>Редактировать</button>
                <button className='menu-item' onClick={handleDelete}>Удалить</button>
              </div>
            }
          </div>
          </div>
          {comment.mediaFileName &&
          <div className='comment-media'>
            <img className='comment-media-image' src={`/media/${comment.mediaFileName}`} alt='Не удалось загрузить изображение'/>
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
                      onDeleting={RemoveReply}
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