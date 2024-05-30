export interface Comment {
  id?: number;
  userId: number;
  comment: string;
  // createdDate: string;
  postId: number;
  member_id?: number;
}
