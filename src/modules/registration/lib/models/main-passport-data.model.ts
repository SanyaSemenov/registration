import { Gender } from './gender.enum';

export class MainPassportData {
  constructor() { }
  firstName: string;
  surname: string;
  patronymic: string;
  dateOfBirth: string;
  placeOfBirth: string;
  gender: Gender;
  serialNumber: string;
  dateOfIssue: string;
  issuedBy: string;
  issuerCode: string;
  page1?: string;
  page2?: string;
  page3?: string;
  registrationAddress: string;

  toDto() {
    const dto = Object.assign({}, this);
    Object.keys(dto).forEach(key => {
      const date = new Date(dto[key]);
      if (date && typeof date !== 'undefined') {
        dto[key] = date.toISOString();
      }
    });
    return dto;
  }
}
