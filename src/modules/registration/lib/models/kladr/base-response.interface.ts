import { SearchContext } from './search-context';
import { BaseModel } from './base.model';

export interface BaseResponse {
  searchContext: SearchContext;
  result: BaseModel[];
}
