export interface Community {
    id: string;
    displayName: string;
    description: string;
    avatarFileName?: string;
    createdAt: string; 
    participantCount: number;
    postCount: number;
}