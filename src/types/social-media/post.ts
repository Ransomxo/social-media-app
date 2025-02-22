export interface CreatePostDto {
  content: string;
  media?: string;
  platforms: string[];
  scheduledAt: Date;
}

export interface PostResponse {
  id: string;
  content: string;
  media?: string;
  platforms: string[];
  scheduledAt: Date;
  status: 'scheduled' | 'published' | 'failed';
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
