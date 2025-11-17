import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PostCard from "../components/post/PostCard";
import postService from "../services/postService";
import type { Post } from "../types/post";
import "./PostPage.css"
import CommentList from "../components/comment/CommentList";

const postSvc = new postService();

const PostPage: React.FC = () => {
    const { id } = useParams<{ id : string}>();
    const [isLoading, setLoading] = useState(true);
    const [ post, setPost ] = useState<Post>();

    useEffect(() => {
        const fetchPost = async () => {
            try{
                let fetchedPost : Post
                if(id){
                    fetchedPost = await postSvc.getPost(id);
                    setPost(fetchedPost);
                }
            }
            catch(error)
            {
                console.error("Failed to fetch post:", error);
            }
            finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id])      

    if(isLoading)
        return(
    <div>
        Загрузка...
    </div>);

    return(
        <main className="main-post-content">
            <article className="post-content">
                {post &&
                    <PostCard key={id} post={post}/>
                }
            </article>
            <section className="comment-tree-content" aria-label="Комментарии">
                {id &&
                    <CommentList parentId={id}/>
                }
            </section>
        </main>
    );
}

export default PostPage;