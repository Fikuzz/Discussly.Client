import type { Community } from "./community";
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
    mediaPreviewFileName?: string;
}