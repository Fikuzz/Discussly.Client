import React, { useState, useRef } from 'react';
import './FileUpload.css';

interface FileUploadProps {
  onFilesSelect: (files: File[]) => void;
  maxFiles?: number;
}

const FileUpload: React.FC<FileUploadProps> = ({ 
  onFilesSelect, 
  maxFiles = 10 
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Обработчик выбора файлов
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    if (files.length + selectedFiles.length > maxFiles) {
      alert(`Максимум можно выбрать ${maxFiles} файлов`);
      return;
    }

    const newFiles = [...selectedFiles, ...files];
    setSelectedFiles(newFiles);
    
    // Создаем URL для превью
    const newUrls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newUrls]);
    
    onFilesSelect(newFiles);
  };

  // Навигация по карусели
  const nextSlide = () => {
    setCurrentIndex(prev => 
      prev === selectedFiles.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex(prev => 
      prev === 0 ? selectedFiles.length - 1 : prev - 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Удаление текущего файла
  const removeCurrentFile = () => {
    if (selectedFiles.length === 0) return;

    // Освобождаем URL
    URL.revokeObjectURL(previewUrls[currentIndex]);
    
    const newFiles = selectedFiles.filter((_, i) => i !== currentIndex);
    const newUrls = previewUrls.filter((_, i) => i !== currentIndex);
    
    setSelectedFiles(newFiles);
    setPreviewUrls(newUrls);
    
    // Корректируем текущий индекс
    if (currentIndex >= newFiles.length && newFiles.length > 0) {
      setCurrentIndex(newFiles.length - 1);
    } else if (newFiles.length === 0) {
      setCurrentIndex(0);
    }
    
    onFilesSelect(newFiles);
  };

  // Очистка всех файлов
  const clearAllFiles = () => {
    // Освобождаем все URL
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    
    setSelectedFiles([]);
    setPreviewUrls([]);
    setCurrentIndex(0);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    onFilesSelect([]);
  };

  if (selectedFiles.length === 0) {
    return (
      <div className="file-upload-empty" >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        <button
          type='button'
          className="file-select-btn"
          onClick={() => fileInputRef.current?.click()}
        >
          📁 Выбрать файлы
        </button>
      </div>
    );
  }

  return (
    <div className="file-upload-carousel">
      {/* Скрытый input для добавления новых файлов */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      {/* Карусель */}
      <div className="carousel">
        <div 
          className="carousel-track"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {selectedFiles.map((file, index) => (
            <div key={index} className="carousel-slide">
              {file.type.startsWith('image/') ? (
                <>
                  <img 
                    src={previewUrls[index]} 
                    className="carousel-background"
                    alt="Background" 
                  />
                  <img 
                    src={previewUrls[index]} 
                    className="carousel-image" 
                    alt={`Slide ${index + 1}`} 
                    onContextMenu={(e) => e.preventDefault()}
                  />
                </>
              ) : (
                <>
                  <video 
                    muted 
                    disableRemotePlayback 
                    className="carousel-background"
                  >
                    <source src={previewUrls[index]} type={file.type} />
                  </video>
                  <video controls className="carousel-video" onContextMenu={(e) => e.preventDefault()}>
                    <source src={previewUrls[index]} type={file.type} />
                  </video>
                </>
              )}
            </div>
          ))}
        </div>

        {selectedFiles.length > 1 && (
          <>
            <button type='button' className="carousel-prev" onClick={prevSlide}>‹</button>
            <button type='button' className="carousel-next" onClick={nextSlide}>›</button>
          </>
        )}

        {selectedFiles.length > 1 && (
          <div className="carousel-dots">
            {selectedFiles.map((_, index) => (
              <span
                key={index}
                className={`dot ${index === currentIndex ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="carousel-controls">
        <button
          type='button'
          className="add-more-btn"
          onClick={() => fileInputRef.current?.click()}
        >
          ＋ Добавить ещё
        </button>
        
        <button
          type='button'
          className="remove-btn"
          onClick={removeCurrentFile}
        >
          🗑️ Удалить текущий
        </button>
        
        <button
          type='button'
          className="clear-all-btn"
          onClick={clearAllFiles}
        >
          🗑️ Удалить все
        </button>
      </div>

      {/* Счетчик файлов */}
      <div className="files-counter">
        Файл {currentIndex + 1} из {selectedFiles.length}
        {selectedFiles.length < maxFiles && (
          <span> (можно добавить ещё {maxFiles - selectedFiles.length})</span>
        )}
      </div>
    </div>
  );
};

export default FileUpload;