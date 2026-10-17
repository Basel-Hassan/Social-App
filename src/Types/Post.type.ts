export interface PostUserType {
  _id: string;
  name: string;
  username: string;
  photo: string;
}

export interface PostType {
  _id: string;
  id: string;
  body?: string;   // missing on posts that only have an image or are shares
  image?: string;  // missing on text-only posts
  privacy: string; // e.g. "public"
  user: PostUserType;
  sharedPost: SharedPost | null;
  likes: string[]; // ids of users who liked the post
  createdAt: string; // ISO date
  commentsCount: number;
  topComment: PostComment | null;
  sharesCount: number;
  likesCount: number;
  isShare: boolean;
  bookmarked: boolean;
}

export interface SharedPost {
  _id: string;
  id: string;
  body?: string;
  image?: string;
  privacy: string;
  user: PostUserType;
  sharedPost: null;
  likes: string[];
  createdAt: string;
  commentsCount: number;
  topComment: PostComment | null;
  sharesCount: number;
  likesCount: number;
  isShare: boolean;
}

export interface PostComment {
  _id: string;
  content: string;
  image?: string;
  commentCreator: PostUserType;
  post: string;
  parentComment: string | null;
  likes: string[];
  createdAt: string;
}