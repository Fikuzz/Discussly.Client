import type { User } from "./user";

export interface Community {
    id: string;
    displayName: string;
    description: string;
    avatarFileName?: string;
    createdAt: string; 
    participantCount: number;
    postCount: number;
}

export interface CreateCommunity {
    name: string;
    description: string;
    isPublic: boolean;
}

export interface Member {
    user: User;
    role: number;
    memberAt: string;
}