import { ContentType } from './content-type.enum';

export class BaseModel {
  id: string;
  name: string;
  zip: number;
  type: string;
  typeShort: string;
  okato: string;
  contentType: ContentType;
}
