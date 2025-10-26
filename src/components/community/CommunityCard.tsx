import React from 'react';
import './CommunityCard.css';
import type { CommunityDTO } from '../../types/community';

interface CommunityCardProps {
  community: CommunityDTO;
  onClick?: (community: CommunityDTO) => void;
}

const CommunityCard: React.FC<CommunityCardProps> = ({ community, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(community);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div 
      className={`community-card ${onClick ? 'clickable' : ''}`}
      onClick={handleClick}
    >
      <div className="community-card__header">
        <div className="community-card__avatar">
          {community.avatarFileName ? (
            <img 
              src={`/avatars/${community.avatarFileName}`} 
              alt={`${community.displayName} avatar`}
              className="community-card__avatar-img"
            />
          ) : (
            <div className="community-card__avatar-placeholder">
              {community.displayName?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        
        <div className="community-card__info">
          <h3 className="community-card__title">{community.displayName}</h3>
          <span className="community-card__date">
            Создано: {formatDate(community.createdAt)}
          </span>
        </div>
      </div>

      <div className="community-card__body">
        <p className="community-card__description">
          {community.description || 'Описание сообщества отсутствует'}
        </p>
      </div>

      <div className="community-card__footer">
        <div className="community-card__id">ID: {community.id}</div>
      </div>
    </div>
  );
};

export default CommunityCard;