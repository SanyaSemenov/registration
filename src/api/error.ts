import { CommonResponse } from './common-response';

class Error {
  message: string;
}

export const errorResponse: CommonResponse<Error> = {
  code: 500,
  status: 'ERROR',
  data: {
    message: 'An error occured'
  }
};
