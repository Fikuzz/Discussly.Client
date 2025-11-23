import React, { useState, useEffect } from 'react';
import './CreatePostForm.css';
import type { CreatePost } from '../types/post';
import { useParams } from 'react-router-dom';
import communityService from '../services/communityService';
import postService from '../services/postService';
import type { Community } from '../types/community';
import { useNavigate } from 'react-router-dom';
import FileUpload from '../components/comment/FileUpload';

const PostSvc = new postService();
const CommunitySvc = new communityService();

const CreatePostForm : React.FC = () =>{
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [community, setCommunity] = useState<Community>();
    const { id } = useParams<{ id:string }>();

    const [media, setMedia] = useState<File[]>([]);

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      alert('Заполните заголовок и содержимое поста');
      return;
    }

    setIsSubmitting(true);
    try {
      if(community?.id){
        const post: CreatePost = {
          Title: title,
          ContentText: content,
          CommunityId: community?.id,
          MediaFiles: media
        }
        const postId = await PostSvc.createPost( post );
        navigate(`/post/${postId}`);
      }
      setTitle('');
      setContent('');
    } catch (error) {
      console.error('Ошибка создания поста:', error);
      alert('Не удалось создать пост');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (title || content) {
      if (window.confirm('У вас есть несохраненные изменения. Выйти?')) {
        setTitle('');
        setContent('');
      }
    }
    window.history.back();
  };

  useEffect(() =>{
    const fetchCommunity = async () =>{
      try{
        if(id)
        {
          const fetchedCommunity = await CommunitySvc.getCommunitiesById(id);
          setCommunity(fetchedCommunity);
        }
      }
      catch(exeption){
        console.log(exeption);
      }
    }

    fetchCommunity();
  }, [id]);

    return(
        <div className="create-post">
          <div className="create-post__header">
            <h1 className="create-post__title">Создать пост</h1>
          </div>

          <button className="btn btn--post" onClick={() => alert("Пока что не работает")}>
            <span className='btn-post-name'>{community?.displayName}</span>
            <svg height="16" width="16" fill='white' viewBox='0 0 17 15'>
              <path d='M10 13.7a.897.897 0 01-.636-.264l-4.6-4.6a.9.9 0 111.272-1.273L10 11.526l3.964-3.963a.9.9 0 011.272 1.273l-4.6 4.6A.897.897 0 0110 13.7z' />
            </svg>
          </button>
          <form onSubmit={handleSubmit} className="create-post__form">
            <div className="form-group">
              <input
                type="text"
                className="form-input form-input--title"
                placeholder="Заголовок поста"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={200}
              />
              <div className="character-count">
                {title.length}/200
              </div>
            </div>
            <div className='file-select' onClick={(e) => e.stopPropagation()}>
              <FileUpload onFilesSelect={setMedia}/>
            </div>
            <div className="form-group">
              <textarea
                className="form-textarea"
                placeholder="Напишите что-нибудь..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={10}
              />
              <div className="character-count">
                {content.length}/10000
              </div>
            </div>
          </form>

          <div className="create-post__actions">

            <div className="action-spacer"></div>

            <button 
              className="btn btn--outline"
              onClick={handleCancel}
              type="button"
            >
              Отмена
            </button>
            <button 
              className="btn btn--primary"
              onClick={handleSubmit}
              disabled={isSubmitting || !title.trim() || !content.trim()}
            >
              {isSubmitting ? 'Публикация...' : 'Опубликовать'}
            </button>
          </div>
        </div>
)};

export default CreatePostForm;