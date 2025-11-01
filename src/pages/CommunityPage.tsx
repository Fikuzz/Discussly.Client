import React, { useEffect, useState } from 'react';
import type { Community, Member } from '../types/community';
import './CommunityPage.css';
import { useAuth } from '../hooks/useAuth';
import { useParams } from 'react-router-dom';
import communityService from '../services/communityService';
import { DateUtils } from '../utils/dateUtils';
import PostList from '../components/post/PostList';
import { useNavigate } from 'react-router-dom';
import MembersTab from '../components/community/MembersTab';

const communitySvc = new communityService();

const CommunityPage: React.FC = () => {
    const { user, loading } = useAuth();
    const { id } = useParams<{ id : string}>();
    const [isLoading, setLoading] = useState(true);
    const [community, setCommunity] = useState<Community | null>(null);
    const [activeTab, setActiveTab] = useState<'feed' | 'about' | 'moderators' | 'members'>('feed');
    const [Member, setMember] = useState<Member | undefined>(undefined);
    const createdAt = DateUtils.normalize(community?.createdAt || 'date');

    const navigate = useNavigate();

    // Заглушки функций
    const handleJoinCommunity = async () => {
      try{
        if(user)
        {
          if(id)
          {
            const member = await communitySvc.subscribe(id);
            setMember(member);
          }
        }
      }
      catch(exeption)
      {
        console.log(exeption);
      }
    };
    const handleLeaveCommunity = async () => {
      try{
        if(user)
        {
          if(id)
          {
            await communitySvc.unsubscribe(id);
            setMember(undefined);
          }
        }
      }
      catch(exeption)
      {
        console.log(exeption);
      }
    };
    const handleCreatePost = () => navigate('submit');
    const handleEditCommunity = () => console.log('Edit community');
    const handleManageModerators = () => console.log('Manage moderators');
    useEffect(() => {
        const fetchCommunity = async () => {
            if(loading) return;
            try{
                let fetchedCommunity : Community;
                if(id){
                  fetchedCommunity = await communitySvc.getCommunitiesById(id);
                  setCommunity(fetchedCommunity);
                  const isMember = await communitySvc.checkSubscription(id);
                  setMember(isMember);
                }
            }
            catch(error){
                console.error("Failed to fetch community:", error);
            }
            finally {
                setLoading(false);
            }
        };

        fetchCommunity();
    }, [id, loading]);

  return (
    <div className="community-page">
      {/* Хедер сообщества */}
      <header className="community-header">
        <div className="community-header__background">
          {/* Баннер сообщества */}
        </div>
        
        <div className="community-header__content">
          <div className="community-header__main">
            <div className="community-avatar">
              {/* Аватар сообщества */}
              <div className="community-avatar__image">
                {community?.avatarFileName ? (
                  <img 
                    src={`/avatars/${community.avatarFileName}`} 
                    alt={community.displayName}
                  />
                ) : (
                  <div className="community-avatar__placeholder">
                    {community?.displayName?.charAt(0)}
                  </div>
                )}
              </div>
              {(Member?.role == 2 || Member?.role == 1) && (
                <button 
                  className="community-avatar__edit-btn"
                  onClick={() => console.log('Edit avatar')}
                >
                  ✎
                </button>
              )}
            </div>

            <div className="community-info">
              <h1 className="community-info__title">
                {community?.displayName || 'Название сообщества'}
              </h1>
              <p className="community-info__description">
                {community?.description || 'Описание сообщества'}
              </p>
              <div className="community-info__stats">
                <span className="stat">📅 Создано {createdAt}</span>
                <span className="stat">👥 {community?.participantCount} участников</span>
                <span className="stat">📝 {community?.postCount} постов</span>
              </div>
            </div>
          </div>

          <div className="community-header__actions">
            {(Member?.role == 2 || Member?.role == 1) && (
              <button 
                className="btn btn--secondary"
                onClick={handleEditCommunity}
              >
                ✎ Редактировать
              </button>
            )}
            
            {(Member) ? (
              <>
                <button 
                  className='btn btn--outline'
                  onClick={handleCreatePost}>
                  ➕ Создать пост
                </button>

                <button className="btn btn--outline"
                  onClick={handleLeaveCommunity}>✅ Вы участник</button>
              </>
            ) : (
              <button 
                className="btn btn--primary"
                onClick={handleJoinCommunity}
              >
                Присоединиться
              </button>
            )}
            
            <button className="btn btn--icon">⚙️</button>
          </div>
        </div>
      </header>

      {/* Основной контент */}
      <div className="community-content">
        {/* Навигация */}
        <nav className="community-tabs">
          <button 
            className={`tab ${activeTab === 'feed' ? 'tab--active' : ''}`}
            onClick={() => setActiveTab('feed')}
          >
            📝 Лента
          </button>
          <button 
            className={`tab ${activeTab === 'about' ? 'tab--active' : ''}`}
            onClick={() => setActiveTab('about')}
          >
            ℹ️ О сообществе
          </button>
          <button 
            className={`tab ${activeTab === 'moderators' ? 'tab--active' : ''}`}
            onClick={() => setActiveTab('moderators')}
          >
            🛡️ Модераторы
          </button>
          <button 
            className={`tab ${activeTab === 'members' ? 'tab--active' : ''}`}
            onClick={() => setActiveTab('members')}
          >
            👥 Участники
          </button>
        </nav>

        <div className="community-layout">
          {/* Основная колонка */}
          <main className="community-main">
            {/* Кнопка создания поста (для участников) */}
            {Member != undefined && (
              <div className="create-post-card">
                <div className="create-post-card__input">
                  <div className="avatar-small">👤</div>
                  <input 
                    type="text" 
                    placeholder="Напишите что-нибудь..."
                    onClick={handleCreatePost}
                  />
                </div>
                <div className="create-post-card__actions">
                  <button className="action-btn">📷</button>
                  <button className="action-btn">📊</button>
                  <button className="action-btn">😊</button>
                </div>
              </div>
            )}

            {/* Контент вкладок */}
            <div className="tab-content">
              {activeTab === 'feed' && (
                <PostList key={id} id = { id } />
              )}

              {activeTab === 'about' && (
                <div className="about-tab">
                  <div className="info-card">
                    <h3>Описание</h3>
                    <p>{community?.description || 'Описание сообщества'}</p>
                  </div>
                  
                  <div className="info-card">
                    <h3>Статистика</h3>
                    <div className="stats-grid">
                      <div className="stat-item">
                        <strong>{community?.participantCount}</strong>
                        <span>Участников</span>
                      </div>
                      <div className="stat-item">
                        <strong>{community?.postCount}</strong>
                        <span>Постов</span>
                      </div>
                      <div className="stat-item">
                        <strong>none</strong>
                        <span>Комментариев</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'moderators' && (
                <div className="moderators-tab">
                  <div className="section-header">
                    <h3>Модераторы сообщества</h3>
                    {(Member?.role == 2 || Member?.role == 1) && (
                      <button 
                        className="btn btn--primary btn--small"
                        onClick={handleManageModerators}
                      >
                        + Добавить модератора
                      </button>
                    )}
                  </div>
                  <div className="users-list">
                    <div className="user-card">
                      <div className="user-info">
                        <div className="avatar">👤</div>
                        <div>
                          <div className="user-name">Имя модератора</div>
                          <div className="user-role">Модератор</div>
                        </div>
                      </div>
                      {(Member?.role == 2 || Member?.role == 1) && (
                        <button className="btn btn--danger btn--small">
                          Удалить
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'members' && (
                <MembersTab key={id} isModerator={false} communityId={id}/>
              )}
            </div>
          </main>

          {/* Сайдбар */}
          <aside className="community-sidebar">
            <div className="sidebar-card">
              <h4>Информация</h4>
              <div className="sidebar-info">
                <div className="info-item">
                  <span>Создано:</span>
                  <span>{createdAt || 'no value'}</span>
                </div>
                <div className="info-item">
                  <span>Участников:</span>
                  <span>{community?.participantCount}</span>
                </div>
                <div className="info-item">
                  <span>Постов:</span>
                  <span>{community?.postCount}</span>
                </div>
              </div>
            </div>

            <div className="sidebar-card">
              <h4>Модераторы</h4>
              <div className="moderators-preview">
                {[1, 2, 3].map(i => (
                  <div key={i} className="moderator-preview">
                    <div className="avatar-small">👤</div>
                    <span>Модератор {i}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;