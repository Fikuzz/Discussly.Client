import React from 'react';
import './CommunityPostCard.css';
import type { Post } from '../../types/post';
import { DateUtils } from '../../utils/dateUtils';

const CommunityPostCard: React.FC<{ post: Post }> = ({ post }) => {
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
              <button className="action">👍 {post.score}</button>
              <button className="action">💬 {post.commentCount}</button>
            </div>
          </div>
    );
};

export default CommunityPostCard;