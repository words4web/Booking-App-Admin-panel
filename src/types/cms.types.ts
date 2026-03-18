export interface ICMSSection {
  title: string;
  content: string;
}

export interface ICMSContent {
  _id: string;
  slug: string;
  title: string;
  sections: ICMSSection[];
  createdAt: string;
  updatedAt: string;
}

export interface IUpsertCMSRequest {
  slug: string;
  title: string;
  sections: ICMSSection[];
}
