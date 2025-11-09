import React, { useEffect, useState } from 'react';
import './PostCard.css';
import type { Post } from '../../types/post';
import PostService from '../../services/postService';
import { useAuth } from '../../hooks/useAuth';
import UserInfo from '../user/UserInfo';
import Vote from '../comment/Vote';

const postSvc = new PostService();

const PostCard: React.FC<{ post: Post }> = ({ post }) => {
  const {user} = useAuth();
  const [userVote, setUserVote] = useState(0);
  const [postScore, setPostScore] = useState(0);

  const handleVote = async(vote: number) =>{
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
            <UserInfo 
              user = {post.author}
              createdAt = {post.createdAt}/>
            <button className="post-menu">⋯</button>
          </div>
          <div className="post-content">
            <p className="post-title">{post.title}</p>
            <p>{post.contentText}</p>
          </div>
          <div className="post-actions">
            <Vote userVote={userVote} score={postScore} handleVote={handleVote}/>
            <button className="action">💬 {post.commentCount}</button>
          </div>
        </div>
    );
};

export default PostCard;