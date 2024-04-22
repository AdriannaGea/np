export interface Comment {
  id: number;
  userId: number;
  comment: string;
  // createdDate: string; // Zmieniono typ na string
  member_id: number;
  postId: number;
}
