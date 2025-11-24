import "./CommentForm.css"
import commentService from "../../services/commentService";
import { useAuth } from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import type { AddComment } from "../../types/comment";
import type { Comment } from "../../types/comment";

const commentSvc = new commentService();

interface CommentFormProps{
    postId: string;
    onCancel: () => void,
    onCommentAdded: (comment: Comment) => void,
    parentCommentId?: string,
}

const CommentForm: React.FC<CommentFormProps> = ({ postId, onCancel, onCommentAdded, parentCommentId }) => {
    const { user, loading } = useAuth();
    const [text, setText] = useState('');
    const [media, setMedia] = useState<File | undefined>(undefined);

    useEffect(() => {
        const checkAuth = async () =>{
            if(loading) return;
        }
        checkAuth();
    }, [loading])

    const onSending = async () => {
        try{
            const body : AddComment = {
                text: text,
                postId: postId,
                commentId: parentCommentId,
                media: media
            };
            const id = await commentSvc.send(body);
            const newComment = await commentSvc.getById(id);
            onCommentAdded(newComment);
        }
        catch(error){
            console.error(error,"error");
        }
        finally{
            onCancel();
        }
    };

    const OnFileSelection = () => {
        try 
        {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = async (event) => {
                const file = (event.target as HTMLInputElement).files?.[0];
                if(file)
                    setMedia(file);
            };
            input.click();
        }
        catch (error) {
            alert(`Error setting avatar:${error}`);
        }
    }

    if(!user)
        return(
    <div>
        Not authentificated
    </div>
    )

    return(
        <article className="comment-form-main">
            {media &&
            <div className="comment-form-media">
                <button className="button-media-delete" onClick={() => setMedia(undefined)}>X</button>
                <img className="comment-form-mediaPreview" src={URL.createObjectURL(media)} />
            </div>
            }
            <textarea className="comment-text"
                value={text}
                onChange={(e) => setText(e.target.value)}/>
            <div className="comment-panel">
                <div className="comment-tools">
                    <button className="button-media" onClick={OnFileSelection}>    
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2 6C2 3.79086 3.79086 2 6 2H18C20.2091 2 22 3.79086 22 6V18C22 20.2091 20.2091 22 18 22H6C3.79086 22 2 20.2091 2 18V6Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <circle cx="8.5" cy="8.5" r="2.5" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M14.5262 12.6211L6 22H18.1328C20.2686 22 22 20.2686 22 18.1328V18C22 17.5335 21.8251 17.3547 21.5099 17.0108L17.4804 12.615C16.6855 11.7479 15.3176 11.7507 14.5262 12.6211Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>
                <div className="comment-buttons">
                    <button className="button button--cancel" onClick={onCancel}>
                        Отмена
                    </button>
                    <button className="button button--send" onClick={() => onSending()}>
                        Отправить
                    </button>
                </div>
            </div>
        </article>
    )
}

export default CommentForm;