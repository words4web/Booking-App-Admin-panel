export interface ICMSContent {
  _id: string;
  slug: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface IUpsertCMSRequest {
  slug: string;
  title: string;
  content: string;
}
