import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import './Header.css';
import AuthModal from './user/AuthModal';
import UserMenu from './user/UserMenu';
import { useNavigate } from 'react-router-dom';
import { useTokenCheck } from '../hooks/useTokenCheck';

function Header() {
  useTokenCheck();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  const handleLoginClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const navigate = useNavigate();

  return (
    <>
      <header className="header">
        <div className="header-container">
          {/* Логотип и название */}
          <div className="logo" onClick={() => navigate('/')}>
            <h1 className="logo-text">Discussly</h1>
            <span className="logo-subtitle">Ваше сообщество</span>
          </div>
          
          {/* Кнопки входа/выхода и информация о пользователе */}
          <div className="header-actions">
            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <button 
                className="login-btn"
                onClick={handleLoginClick}
              >
                Войти
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Модальное окно */}
      <AuthModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
      />
    </>
  );
}

export default Header;