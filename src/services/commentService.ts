import { API_BASE_URL } from "../config/constants";
import type { AddComment, Comment } from "../types/comment";

class commentService{
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
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
        };

        const config: RequestInit = {
            ...options,
            headers: {
                ...headers,
                ...options.headers,
            },
        };

        console.log('Request headers:', config.headers);

        const response = await fetch(url, config);
        if (!response.ok) throw new Error(`Error: ${response.status}`);

        return response;
    };

    async getSubComments (id: string): Promise<Comment[]> {
        return await (await this.request(`/Comment/${id}/subcomments`, { method: "GET" })).json() as Comment[];
    }

    async send(body: AddComment): Promise<string> {
        console.log('body:', body);
        return await (await this.request(`/Comment`,
             {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
             })).json() as string;
    }
}

export default commentService;