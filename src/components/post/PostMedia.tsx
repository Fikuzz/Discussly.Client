import React, { useEffect, useState } from "react";
import "./PostMedia.css";
import type { Media } from "../../types/media";
import postService from "../../services/postService";

const PostSvc = new postService();
interface PostMediaProps{
    postId: string;
    previewMedia: string | undefined;
}

const PostMedia: React.FC<PostMediaProps> = ({postId, previewMedia = undefined}) =>{

    const [media, setMedia] = useState<Media[]>()

    useEffect(() => {
        const fetchMedia = async () =>{
            try
            {
                const fetchedMedia = await PostSvc.getMedia(postId)
                setMedia(fetchedMedia);
            }
            catch(ex)
            {
                console.error(ex);
            }
        }

        fetchMedia();
    }, [postId]);

    if(!media || media?.length < 1)
        return null;

    return(
        <div>
            {previewMedia ? 
            (
                <>
                    <img
                        src={`/media/${previewMedia}`}
                        className="post-media-preview"
                    />
                </>
            ):(
                <div className="post-media">
                    {media.map(element =>(
                            <img
                                src={`/media/${element.path}/${element.name}`}
                                className="post-media-element"
                            />
                    ))
                    }
                </div>
            )}
        </div>
    )
}

export default PostMedia;