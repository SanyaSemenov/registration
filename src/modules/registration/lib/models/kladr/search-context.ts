import { ContentType } from './content-type.enum';

export class SearchContext {
  contentType: ContentType;
  regionId?: string;
  cityId?: string;
  streetId?: string;
  query: string;
  limit: number;
}
