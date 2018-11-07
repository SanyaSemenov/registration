import { Gender } from './gender.enum';

export class MainPassportData {
  name: string;
  surname: string;
  middleName: string;
  birth: string;
  // birth: Date;
  gender: Gender;
  passportNumber: string;
  passportDate: string;
  // passportDate: Date;
  passportByWhom: string;
  passportCode: string;
}
