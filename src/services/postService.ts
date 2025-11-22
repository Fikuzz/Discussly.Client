import type { Comment } from "../types/comment";
import type { Post } from "../types/post";
import BaseService from "./baseService";
import type { CreatePost } from "../types/post";
import type { Media } from "../types/media";

class postService extends BaseService{
    async getPostComment (id: string): Promise<Comment[]> {
        return await this.get<Comment[]>(`/Post/${id}/comments`);
    }

    async getPost (id: string): Promise<Post> {
        return await this.get<Post>(`/Post/${id}`);
    }

    async getUserVote (id: string): Promise<number> {
        return await this.get<number>(`/Post/${id}/vote`);
    }

    async sendUserVote (id: string, vote: number): Promise<boolean> {
        return await this.post<boolean, number>(`/Post/${id}/vote?voteType=${vote}`, vote);
    }

    async createPost (post : CreatePost): Promise<boolean> {
        const formData = this.createFormData({
            title: post.Title,
            contentText: post.ContentText,
            communityId: post.CommunityId,
            mediaFiles: post.MediaFiles
        });
        return await this.post<boolean, FormData>(`/Post`, formData);
    }

    async getMedia (id: string): Promise<Media[]> {
        return await this.get<Media[]>(`/Post/${id}/media`);
    }
}

export default postService;