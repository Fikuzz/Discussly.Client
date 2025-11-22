import { API_BASE_URL } from "../config/constants";

export class BaseService {
    private baseURL: string = API_BASE_URL;

    private getToken(): string | null {
        return localStorage.getItem("authToken");
    }

    protected async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${this.baseURL}${endpoint}`;
        const token = this.getToken();

        const headers: Record<string, string> = {
            ...(token ? { Authorization: `Bearer ${token}` } : {})
        };

        if (!(options.body instanceof FormData)) {
            headers['Content-Type'] = 'application/json';
        }

        const config: RequestInit = {
            ...options,
            headers: {
                ...headers,
                ...options.headers,
            },
        };

        const response = await fetch(url, config);
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
        }

        if (response.status === 204 || response.headers.get('Content-Length') === '0') {
            return undefined as T;
        }

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json() as T;
        }

        return await response.text() as T;
    }

    protected async get<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'GET',
            ...options
        });
    }

    protected async post<T, D = unknown>(endpoint: string, data?: D, options: RequestInit = {}): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: this.prepareBody(data),
            ...options
        });
    }

    protected async put<T, D = unknown>(endpoint: string, data?: D, options: RequestInit = {}): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'PUT',
            body: this.prepareBody(data),
            ...options
        });
    }

    protected async delete<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'DELETE',
            ...options
        });
    }

    private prepareBody<D>(data: D): BodyInit | null {
        if (!data) return null;
        
        if (data instanceof FormData) {
            return data;
        }
        
        return JSON.stringify(data);
    }

    protected createFormData(data: Record<string, string | string[] | undefined | File | Blob>): FormData {
        const formData = new FormData();
        
        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                if (value instanceof File || value instanceof Blob) {
                    formData.append(key, value);
                } else {
                    formData.append(key, value.toString());
                }
            }
        });
        
        return formData;
    }
}

export default BaseService;