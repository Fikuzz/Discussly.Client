import type { Community, CreateCommunity, Member } from "../types/community";
import type { Post } from "../types/post";
import BaseService from "./baseService";

class communityService extends BaseService{

    async getCommunities(): Promise<Community[]> {
        return await this.get<Community[]>("/Community");
    }

    async getCommunitiesById(id: string): Promise<Community> {
        return await this.get<Community>(`/Community/${id}`);
    }

    async getCommunityPosts(id: string): Promise<Post[]> {
        return await this.get<Post[]>(`/Community/${id}/posts`);
    }

    async createCommunity(community: CreateCommunity): Promise<string> {
        return await this.post<string, CreateCommunity>(`/Community/create`, community);
    }

    async subscribe(id: string): Promise<boolean> {
        return await this.post<boolean, string>(`/Community/${id}/subscribe`);
    }

    async unsubscribe(id: string): Promise<boolean> {
        return await this.post<boolean, string>(`/Community/${id}/unsubscribe`);
    }

    async checkSubscription(id: string): Promise<boolean> {
        return await this.get<boolean>(`/Community/${id}/checkSubscription`);
    }

    async getSubscriptions(id: string): Promise<Member[]> {
        return await this.get<Member[]>(`/Community/${id}/subscriptions`);
    }
}

export default communityService;