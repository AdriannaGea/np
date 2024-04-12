export interface NicePlace {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  location?: string;
  createdDate: Date;
  editDate: Date; 
  likes: number;
  dislikes: number;
  tags: string[];
  comments: Comment[];
  member_id: number;
}
