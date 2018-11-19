import { ContentType } from './content-type.enum';

export class RegionModel {
  id: string;
  name: string;
  zip: number;
  type: string;
  typeShort: string;
  okato: string;
  contentType: ContentType;
}
