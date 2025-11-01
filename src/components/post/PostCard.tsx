import React, { useEffect, useState } from 'react';
import './PostCard.css';
import type { Post } from '../../types/post';
import { DateUtils } from '../../utils/dateUtils';
import PostService from '../../services/postService';
import { useAuth } from '../../hooks/useAuth';

const postSvc = new PostService();

const PostCard: React.FC<{ post: Post }> = ({ post }) => {
  const {user} = useAuth();
  const [userVote, setUserVote] = useState(0);
  const [postScore, setPostScore] = useState(0);

  const handlerVote = async(vote: number, e : React.MouseEvent) =>{
    e.stopPropagation();
    if(user){
      vote = userVote == vote ? 0 : vote;
      await postSvc.sendUserVote(post.id, vote);
      setPostScore(postScore - userVote + vote)
      setUserVote(vote);
    }
  }

  useEffect(() => {
    const getVote = async () => {
      try{
        let vote = 0;
        if(user){
          vote = await postSvc.getUserVote(post.id);
          setUserVote(vote);
        }
      }
      catch(error){
          console.log(error);
      }
    }

    setPostScore(post.score);
    getVote();
  }, []);
  
  return (
      <div className="post-card">
          <div className="post-header">
            <div className="post-author">
              {post.author.avatarFileName ? (
            <img
              src={`/avatars/${post.author.avatarFileName}`}
              alt="Avatar" 
              className="avatar-small"
            />
        ) : (
          <div className="avatar-placeholder-small">
            {post.author.username?.charAt(0).toUpperCase()}
          </div>
        )}
              <div className="author-info">
                <span className="author-name">{post.author.username}</span>
                <span className="post-date">{DateUtils.normalize(post.createdAt, "timeago")}</span>
              </div>
            </div>
            <button className="post-menu">⋯</button>
          </div>
          <div className="post-content">
            <p className="post-title">{post.title}</p>
            <p>{post.contentText}</p>
          </div>
          <div className="post-actions">
            <div className='vote-action'>
              <button className={`vote upvote ${userVote > 0 ? "active" : ""}`} onClick={(e) => handlerVote(1, e)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M21 19l-9-9-9 9"/>
                </svg>
              </button>
              <span className='vote-score'>{postScore}</span>
              <button className={`vote downvote ${userVote < 0 ? "active" : ""}`} onClick={(e) => handlerVote(-1, e)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M21 11l -9 9 -9 -9"/>
                </svg>
              </button>
            </div>
            <button className="action">💬 {post.commentCount}</button>
          </div>
        </div>
    );
};

export default PostCard;