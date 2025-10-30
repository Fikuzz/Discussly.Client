import { useState, FormEvent, ChangeEvent } from 'react';
import type { CreateCommunity } from '../../types/community';
import './NewCommunityModal.css';

interface CreateCommunityModalProps{
    isOpen: boolean;
    onClose: () => void;
    onCreate: (data: CreateCommunity) => void;
}

const CreateCommunityModal: React.FC<CreateCommunityModalProps> = ({ 
  isOpen, 
  onClose, 
  onCreate 
}) => {
  const [formData, setFormData] = useState<CreateCommunity>({
    name: '',
    description: '',
    isPublic: true
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    
    onCreate(formData);
    setFormData({ name: '', description: '', isPublic: true });
    onClose();
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Создать сообщество</h2>
          <button 
            className="modal-close" 
            onClick={onClose}
            type="button"
            aria-label="Закрыть"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="name">Название сообщества *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Придумайте название"
              required
              maxLength={50}
            />
            <span className="char-count">{formData.name.length}/50</span>
          </div>

          <div className="form-group">
            <label htmlFor="description">Описание</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Расскажите о вашем сообществе"
              rows={3}
              maxLength={500}
            />
            <span className="char-count">{formData.description.length}/500</span>
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isPublic"
                checked={formData.isPublic}
                onChange={handleChange}
              />
              <span className="checkmark"></span>
              Публичное сообщество
            </label>
            <p className="checkbox-help">
              {formData.isPublic 
                ? 'Все пользователи смогут видеть и присоединяться к сообществу' 
                : 'Только приглашенные пользователи смогут видеть контент'
              }
            </p>
          </div>

          <div className="modal-actions">
            <button 
              type="button" 
              className="btn-cancel" 
              onClick={onClose}
            >
              Отмена
            </button>
            <button 
              type="submit" 
              className="btn-create"
              disabled={!formData.name.trim()}
            >
              Создать сообщество
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCommunityModal;