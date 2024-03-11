export class NicePlace {

  id!: number;
  title!: string;
  description!: string;
  imageUrl!: string;
  createdDate!: Date;
  likes!: number;
  location?: string;
  comments: Comment[] | null = null;
}
