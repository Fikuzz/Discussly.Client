import React, { useEffect } from 'react';
import './HomePage.css'; // или HomePage.css
import type { CommunityDTO } from '../types/community';
import CommunityCard from '../components/community/CommunityCard';
import communityService from '../services/communityService';
import { useNavigate } from 'react-router-dom';

const communitySvc = new communityService();

const CommunityList: React.FC = () => {
  const [communities, setCommunities] = React.useState<CommunityDTO[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const navigate = useNavigate();

  const handleCommunityClick = (community: CommunityDTO) => {
    navigate(`/community/${community.id}`);
  };

  useEffect(() => {
    const loadCommunities = async () => {
        try {
            const data = await communitySvc.getCommunities();
            setCommunities(data);
        } catch (error) {
            console.error("Failed to fetch communities:", error);
        } finally {
            setLoading(false);
        }
    };

    loadCommunities();
  }, []);

  if (loading) {
    return <div>Загрузка сообществ...</div>;
  }
    return (
        <div className="community-list">
            {communities.length === 0 && <div>Сообществ пока нет.</div>}
            {communities.map(community => (
                <CommunityCard 
                    key={community.id}
                    community={community}
                    onClick={() => handleCommunityClick(community)}
                />
            ))}
        </div>
    );
};

const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      {/* Хедер */}
      <header className="home-page__header">
        <div className="home-page__header-content">
          <h1 className="home-page__title">Сообщества</h1>
          <div className="home-page__actions">
            {/* Здесь будут кнопки создания, поиска и т.д. */}
          </div>
        </div>
      </header>

      {/* Основной контент */}
      <main className="home-page__main">
        <div className="home-page__container">
          {/* Сайдбар (опционально) */}
          <aside className="home-page__sidebar">
            {/* Фильтры, категории, навигация */}
            <div className="home-page__sidebar-section">
              <h3>Фильтры</h3>
              {/* Здесь будут фильтры */}
            </div>
          </aside>

          {/* Основная сетка с карточками */}
          <section className="home-page__content">
            {/* Заголовок секции */}
            <div className="home-page__content-header">
              <h2>Все сообщества</h2>
              <div className="home-page__sorting">
                {/* Сортировка */}
              </div>
            </div>

            {/* Сетка карточек */}
            <div className="home-page__grid">
                <CommunityList />
            </div>

            {/* Пагинация */}
            <div className="home-page__pagination">
              {/* Здесь будет пагинация */}
            </div>
          </section>
        </div>
      </main>

      {/* Футер */}
      <footer className="home-page__footer">
        <div className="home-page__footer-content">
          <p>&copy; 2024 Ваше приложение</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;