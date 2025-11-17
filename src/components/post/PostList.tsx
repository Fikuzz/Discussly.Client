import React, { useEffect } from 'react';
import './PostList.css';
import type { Post } from '../../types/post';
import PostCard from './PostCard';
import communityService from '../../services/communityService';
import { useNavigate } from 'react-router-dom';

const communitySvc = new communityService();

const PostList: React.FC<{ id:string | undefined}> = ({ id }) => {
    const [posts, setPosts] = React.useState<Post[]>([]);
    const [loading, setLoading] = React.useState<boolean>(true);

    const navigate = useNavigate();
    const OnPostClick = (id:string) => {
        navigate(`../post/${id}`);
    }

    useEffect(() => {
        const loadPosts = async () => {
            try {
                if(!id)
                {
                    return(
                        <div>Сообщество не найдено</div>
                    );
                }
                const data = await communitySvc.getCommunityPosts(id);
                setPosts(data);
            } catch (error) {
                console.error("Failed to fetch posts:", error);
            }finally {
                setLoading(false);
            }
        };
        loadPosts();
    }, [id]);

    if (loading) {
        return <div>Загрузка постов...</div>;
    }

    return (
        <div className="community-post-list">
            {posts.map(post => (
                <div key={post.id} className='community-post' onClick={() => OnPostClick(post.id)}>
                    <PostCard post={post}/>
                </div>
            ))}
        </div>
    );
}   

export default PostList;