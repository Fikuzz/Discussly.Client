import React, { useEffect } from 'react';
import './CommunityPostList.css';
import type { Post } from '../../types/post';
import CommunityPostCard from './CommunityPostCard';
import communityService from '../../services/communityService';

const communitySvc = new communityService();

const CommunityPostList: React.FC<{ id:string | undefined}> = ({ id }) => {
    const [posts, setPosts] = React.useState<Post[]>([]);
    const [loading, setLoading] = React.useState<boolean>(true);

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
                <CommunityPostCard key={post.id} post={post} />
            ))}
        </div>
    );
}   

export default CommunityPostList;