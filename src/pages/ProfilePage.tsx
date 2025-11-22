import React, { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import { userService } from '../services/userService';
import './ProfilePage.css';
import type { Profile } from '../types/user';
import { useAuth } from '../hooks/useAuth';

const ProfilePage: React.FC = () => {
  const { user, loading } = useAuth();
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profileOwner, setProfileOwner] = useState(false);
  const [activeTab, setActiveTab] = useState<'view' | 'edit' | 'security'>('view');

  const OnAvatarDelete = async () => {
    try {
      await userService.deleteAvatar();
      setProfile(prevProfile => prevProfile ? { ...prevProfile, avatarFileName: undefined } : profile);
    }
    catch (error) {
      alert(`Error deleting avatar:${error}`);
    }
  }

  const OnAvatarChange = async () => {
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = async (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if(file) {
          const fileName = await userService.updateAvatar(file);
          console.log('Updated avatar file name:', fileName);
          setProfile(prevProfile => prevProfile ? { ...prevProfile, avatarFileName: fileName } : profile);
        }
      };
      input.click();
    }
    catch (error) {
      alert(`Error setting avatar:${error}`);
    }
  }

  useEffect(() => {
    const fetchUser = async () => {
      if(loading) return;
      try {
        let fetchedUser: Profile;
        if (id) {
          fetchedUser = await userService.getUserById(id);
        } else {
          fetchedUser = await userService.getCurrentUserProfile();
        }

        if (fetchedUser.id === user?.id) {
          setProfileOwner(true);
        }
        console.log('Fetched user: ', fetchedUser.username);

        setProfile(fetchedUser);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [id, loading]);

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (!profile) {
    return <div>Профиль не найден или у вас нет доступа.</div>;
  }

  return (
    <div className="profile-page">
      {/* Хедер профиля */}
      <div className="profile-header">
        <div 
            className={`profile-avatar ${profileOwner ? 'editable' : 'read-only'}`}
            onClick={profileOwner ? OnAvatarChange : undefined}>
          {profile.avatarFileName ? (
            <div>
              <img
                src={`/media/avatars/${profile.avatarFileName}`}
                alt="Avatar" 
                className="avatar-xxl"
              />
              {profileOwner && <button className='avatar-delete-btn'
                onClick={(e) =>{
                  e.stopPropagation();
                  OnAvatarDelete()
                }}/>}
            </div>
          ) : (
            <div className="avatar-placeholder-xxl">
              {profile.username?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        
        <div className="profile-info">
          <h1 className="profile-username">{profile.username}</h1>
          {profileOwner && <p className="profile-email">{profile.email}</p>}
          <div className="profile-stats">
            <div className="stat">
              <span className="stat-value">{profile.karma || 0}</span>
              <span className="stat-label">Карма</span>
            </div>
            <div className="stat">
              <span className="stat-value">{profile.postCount}</span>
              <span className="stat-label">Постов</span>
            </div>
            <div className="stat">
              <span className="stat-value">{profile.commentCount}</span>
              <span className="stat-label">Комментариев</span>
            </div>
          </div>
        </div>
        
        {profileOwner && 
        <div className="profile-actions">
          <button 
            className="edit-profile-btn"
            onClick={() => setActiveTab('edit')}
          >
            Редактировать профиль
          </button>
        </div>}
      </div>

      {/* Навигация */}
      {profileOwner &&
      <nav className="profile-nav">
        <button 
          className={`nav-btn ${activeTab === 'view' ? 'active' : ''}`}
          onClick={() => setActiveTab('view')}
        >
          👤 Профиль
        </button>
        <button 
          className={`nav-btn ${activeTab === 'edit' ? 'active' : ''}`}
          onClick={() => setActiveTab('edit')}
        >
          ✏️ Редактировать
        </button>
        <button 
          className={`nav-btn ${activeTab === 'security' ? 'active' : ''}`}
          onClick={() => setActiveTab('security')}
        >
          🔐 Безопасность
        </button>
      </nav>
      }

      {/* Контент */}
      <div className="profile-content">
        {activeTab === 'view' && <ProfileView profile={profile} />}
        {activeTab === 'edit' && <ProfileEdit profile={profile} />}
        {activeTab === 'security' && <SecuritySettings />}
      </div>
    </div>
  );
}

function ProfileView({ profile }: { profile: Profile }) {
  return (
    <div className="profile-view">
      <div className="info-section">
        <h3>Информация</h3>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Дата регистрации:</span>
            <span className="info-value">
              {new Date(profile.createdAt).toLocaleDateString('ru-RU')}
            </span>
          </div>
          <div className="info-item">
            <span className="info-label">ID пользователя:</span>
            <span className="info-value">{profile.id}</span>
          </div>
        </div>
      </div>

      <div className="activity-section">
        <h3>Активность</h3>
        <div className="activity-placeholder">
          <p>Здесь будет отображаться активность пользователя</p>
        </div>
      </div>
    </div>
  );
}

// Компонент редактирования профиля
function ProfileEdit({ profile }: { profile: Profile }) {
  const [formData, setFormData] = useState({
    username: profile.username || '',
    email: profile.email || ''
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: API call to update profile
    console.log('Update profile:', formData);
  };

  return (
    <div className="profile-edit">
      <form onSubmit={handleSubmit} className="edit-form">
        <div className="form-section">
          <h3>Основная информация</h3>
          
          <div className="form-group">
            <label>Имя пользователя</label>
            <input 
              type="text" 
              name="username"
              value={formData.username}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="save-btn">
            Сохранить изменения
          </button>
          <button type="button" className="cancel-btn">
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
}

// Компонент настроек безопасности
function SecuritySettings() {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: API call to change password
    console.log('Change password');
  };

  return (
    <div className="security-settings">
      <form onSubmit={handleSubmit} className="security-form">
        <div className="form-section">
          <h3>Смена пароля</h3>
          
          <div className="form-group">
            <label>Текущий пароль</label>
            <input 
              type="password" 
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Новый пароль</label>
            <input 
              type="password" 
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Подтвердите новый пароль</label>
            <input 
              type="password" 
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="save-btn">
            Сменить пароль
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProfilePage;