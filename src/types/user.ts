export interface User {
  id: string;
  username: string;
  avatarFileName?: string;
}

export interface Profile {
  id: string;
  username: string;
  email: string;
  avatarFileName?: string;
  karma: number;
  postCount: number;
  commentCount: number;
  createdAt: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}