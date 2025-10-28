import type { User } from "./user";

export interface Comment {
    id: string;
    text: string;
    postId: string;
    author: User;
    createdAt: string;
    isEdited: boolean;
}

export interface AddComment{
    text: string;
    postId: string;
    commentId?: string;
}