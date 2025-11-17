import type { AddComment, Comment } from "../types/comment";
import BaseService from "./baseService";

class commentService extends BaseService{

    async getSubComments (id: string): Promise<Comment[]> {
        return await this.get<Comment[]>(`/Comment/${id}/subcomments`, { method: "GET" });
    }

    async getById (id: string): Promise<Comment> {
        return await this.get<Comment>(`/Comment/${id}`);
    }

    async send(body: AddComment): Promise<string> {
        return await this.post<string, AddComment>(`/Comment`,body);
    }

    async getUserVote(id: string): Promise<number>{
        return await this.get<number>(`/Comment/${id}/vote`);
    }

    async sendUserVote(id: string, vote: number): Promise<boolean>{
        return await this.post<boolean, number>(`/Comment/${id}/vote?voteType=${vote}`, vote);
    }
}

export default commentService;