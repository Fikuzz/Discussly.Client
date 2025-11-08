import "./CommentForm.css"
import commentService from "../../services/commentService";
import { useAuth } from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import type { AddComment } from "../../types/comment";

const commentSvc = new commentService();

const CommentForm: React.FC<{ post: string, onCancel: () => void, comment?: string }> = ({ post, onCancel, comment }) => {
    const { user, loading } = useAuth();
    const [text, setText] = useState('');

    useEffect(() => {
        const checkAuth = async () =>{
            if(loading) return;
        }
        checkAuth();
    }, [loading])

    const onSending = () => {
        try{
            const body : AddComment = {
                text: text,
                postId: post,
                commentId: comment
            };
            console.log(body);
            commentSvc.send(body);
        }
        catch(error){
            console.error(error,"error");
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