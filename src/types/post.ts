import type { Community } from "./community";
import type { Media } from "./media";
import type { User } from "./user";

export interface Post {
    id: string;
    title: string;
    contentText: string;
    author: User;
    communityId: Community;
    score: number;
    commentCount: number;
    createdAt: string;
    media: Media[];
}

export interface CreatePost {
    Title: string;
    ContentText: string;
    CommunityId: string;
    MediaFiles?: string[];
}