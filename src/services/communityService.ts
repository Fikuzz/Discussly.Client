import { API_BASE_URL } from "../config/constants";
import type { Community } from "../types/community";
import type { Post } from "../types/post";

class communityService{
    private baseURL: string = API_BASE_URL;

    private getToken(): string | null {
        return localStorage.getItem("authToken");
    }

    private async request(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<Response> {
        const url = `${this.baseURL}${endpoint}`;
        const token = this.getToken();

        const headers: Record<string, string> = {
            ...(token ? { Authorization: `Bearer ${token}` } : {})
        };

        if (options.headers) {
            Object.assign(headers, options.headers);
        }

        const config: RequestInit = {
            headers,
            ...options,
        };

        const response = await fetch(url, config);
        if (!response.ok) throw new Error(`Error: ${response.status}`);

        return response;
    };

    async getCommunities(): Promise<Community[]> {
        return await (await this.request("/Community", { method: "GET" })).json() as Community[];
    }

    async getCommunitiesById(id: string): Promise<Community> {
        return await (await this.request(`/Community/${id}`, { method: "GET" })).json() as Community;
    }

    async getCommunityPosts(id: string): Promise<Post[]> {
        return await (await this.request(`/Community/${id}/post`, { method: "GET" })).json() as Post[];
    }
}

export default communityService;