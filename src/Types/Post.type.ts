export interface PostUserType {
  _id: string;
  name: string;
  username: string;
  photo: string;
}

export interface PostType {
  _id: string;
  id: string;
  body?: string;   
  image?: string;  
  privacy: string; 
  user: PostUserType;
  sharedPost: SharedPost | null;
  likes: string[];
  createdAt: string; 
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
  repliesCount:number
}