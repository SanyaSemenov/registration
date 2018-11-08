import { Gender } from './gender.enum';

export class MainPassportData {
  name: string;
  surname: string;
  patronymic: string;
  dateOfBirth: string;
  // dateOfBirth: Date;
  gender: Gender;
  serialNumber: string;
  dateOfIssue: string;
  // dateOfIssue: Date;
  placeOfIssue: string;
  issuerCode: string;
}
