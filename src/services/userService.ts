import { API_BASE_URL } from "../config/constants";
import type { Profile } from "../types/user";

class UserService {
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
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    if (options.headers) {
      Object.assign(headers, options.headers);
    }

    if (!(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    const config: RequestInit = {
      headers,
      ...options,
    };

    const response = await fetch(url, config);
    if (!response.ok) throw new Error(`Error: ${response.status}`);

    return response;
  }

  async getCurrentUserProfile(): Promise<Profile> {
    return await (await this.request("/User/profile", { method: "GET" })).json() as Profile;
  }

  async getUserById(userId: string): Promise<Profile> {
    return await (await this.request(`/User/profile/${userId}`, { method: "GET" })).json() as Profile;
  }

  async updateUsername(newUsername: string): Promise<string> {
    return await (await this.request("/User/username", {
      method: "PUT",
      body: JSON.stringify({ username: newUsername }),
    })).text() as string;
  }

  async updateAvatar(avatarFile: File): Promise<string> {
    const formData = new FormData();
    formData.append("formFile", avatarFile);
    console.log("Form Data: ", formData.get("formFile"));
    return await (await this.request("/User/avatar", {
      method: "PUT",
      body: formData,
    })).text() as string;
  }

  async deleteAvatar(): Promise<void> {
    await this.request("/User/avatar", {
      method: "DELETE",
    });
    return
  }
}

export const userService = new UserService();
