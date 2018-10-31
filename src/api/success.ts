import { CommonResponse } from './common-response';

class Success {
  message: string;
}

export const successResponse: CommonResponse<Success> = {
  code: 200,
  status: 'SUCCESS',
  data: {
    message: 'Successfully'
  }
};
