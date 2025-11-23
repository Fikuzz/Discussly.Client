import React, { useState } from "react";
import "./PostMedia.css";
import type { Media } from "../../types/media";

interface PostMediaProps{
    media: Media[];
}

const PostMedia: React.FC<PostMediaProps> = ({media}) =>{
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = (e:React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev + 1) % media.length);
    };

    const prevSlide = (e:React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev - 1 + media.length) % media.length);
    };

    const goToSlide = (e:React.MouseEvent ,index:number) => {
        e.stopPropagation();
        setCurrentIndex(index);
    };

    if(!media || media?.length < 1)
        return null;

    return(
        <div className="carousel">
      <div 
        className="carousel-track"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {media.map((item, index) => (
          <div key={index} className="carousel-slide">
            {item.type === 'Image' ? (
                <>
                    <img src={`/media/${item.path}/${item.name}`} className="carousel-background"/>
                    <img src={`/media/${item.path}/${item.name}`} className="carousel-image" alt={`Slide ${index + 1}`} />
                </>
            ) : (
                <>
                    <video muted disableRemotePlayback className="carousel-background">
                        <source src={`/media/${item.path}/${item.name}`} type="video/mp4" />
                    </video>
                    <video controls className="carousel-video">
                        <source src={`/media/${item.path}/${item.name}`} type="video/mp4" />
                    </video>
                </>
            )}
          </div>
        ))}
      </div>

      <button className="carousel-prev" onClick={prevSlide}>‹</button>
      <button className="carousel-next" onClick={nextSlide}>›</button>

      <div className="carousel-dots">
        {media.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentIndex ? 'active' : ''}`}
            onClick={(e) => goToSlide(e, index)}
          />
        ))}
      </div>
    </div>
    )
}

export default PostMedia;