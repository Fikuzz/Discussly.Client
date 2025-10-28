import { API_BASE_URL } from "../config/constants";
import type { Comment } from "../types/comment";
import type { Post } from "../types/post";

class postService{
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

    async getPostComment (id: string): Promise<Comment[]> {
        return await (await this.request(`/Post/${id}/comments`, { method: "GET" })).json() as Comment[];
    }

    async getPost (id: string): Promise<Post> {
        return await (await this.request(`/Post/${id}`, { method: "GET" })).json() as Post;
    }
}

export default postService;