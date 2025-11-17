import "./CommentForm.css"
import commentService from "../../services/commentService";
import { useAuth } from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import type { AddComment } from "../../types/comment";
import type { Comment } from "../../types/comment";

const commentSvc = new commentService();

interface CommentFormProps{
    post: string;
    onCancel: () => void,
    addComment: (comment: Comment) => void,
    comment?: string,
}

const CommentForm: React.FC<CommentFormProps> = ({ post, onCancel, addComment, comment }) => {
    const { user, loading } = useAuth();
    const [text, setText] = useState('');

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
                postId: post,
                commentId: comment
            };
            const id = await commentSvc.send(body);
            const newComment = await commentSvc.getById(id);
            addComment(newComment);
        }
        catch(error){
            console.error(error,"error");
        }
        finally{
            onCancel();
        }
    };

    if(!user)
        return(
    <div>
        Not authentificated
    </div>
    )

    return(
        <article className="comment-form-main">
            <textarea className="comment-text"
                value={text}
                onChange={(e) => setText(e.target.value)}/>
            <div className="comment-panel">
                <div className="comment-tools"/>
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