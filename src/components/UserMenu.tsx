import { useRef, useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { signalRService } from '../services/signalRService';
import { useNavigate } from 'react-router-dom';
import './UserMenu.css';

function UserMenu() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleAvatarChanged = (newAvatarName: string) => {
      console.log('Received avatar change notification:', newAvatarName);
    };

    const handleUsernameChanged = (newUsername: string) => {
      console.log('Received username change notification:', newUsername);
    };

    signalRService.on('AvatarChanged', handleAvatarChanged);
    signalRService.on('UsernameChanged', handleUsernameChanged);

    return () => {
      signalRService.off('AvatarChanged', handleAvatarChanged);
      signalRService.off('UsernameChanged', handleUsernameChanged);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const navigate = useNavigate();

  if (!user) {
    return null;
  }

  return (
    <div className="user-menu-container" ref={menuRef}>
      {/* Кнопка-триггер */}
      <button className="user-menu-trigger" onClick={toggleMenu}>
        <div className="user-avatar">
          {user.avatarFileName ? (
            <img 
              src={`/avatars/${user.avatarFileName}?v=${Date.now()}`}
              alt="Avatar" 
              className="avatar-image"
            />
          ) : (
            <div className="avatar-placeholder">
              {user.username?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      </button>

      {/* Выпадающее меню */}
      {isOpen && (
        <div className="user-dropdown-menu">
          {/* Заголовок с информацией пользователя */}
          <div className="user-info-header">
            <div className="user-avatar-small">
              {user.avatarFileName ? (
                <img 
                  src={`/avatars/${user.avatarFileName}?v=${Date.now()}`}
                  alt="Avatar" 
                />
              ) : (
                <div className="avatar-placeholder-small">
                  {user.username?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="user-details">
              <div className="user-name">{user.username}</div>
              <div className="user-email">{user.email}</div>
              <div className="user-karma">Карма: {user.karma}</div>
            </div>
          </div>

          <div className="menu-divider"></div>

          {/* Пункты меню */}
          <nav className="menu-items">
            <button className="menu-item" onClick={() => navigate('/profile')}>
              📝 Мой профиль
            </button>
            <button className="menu-item">
              ⚙️ Настройки
            </button>
            <button className="menu-item">
              📊 Мои посты
            </button>
            <button className="menu-item">
              💬 Мои комментарии
            </button>
          </nav>

          <div className="menu-divider"></div>

          {/* Выход */}
          <button className="menu-item logout-item" onClick={handleLogout}>
            🚪 Выйти
          </button>
        </div>
      )}
    </div>
  );
}

export default UserMenu;