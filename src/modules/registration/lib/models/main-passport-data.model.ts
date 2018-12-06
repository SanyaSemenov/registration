import { Gender } from './gender.enum';

export class MainPassportData {
  constructor() { }
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
  page1?: string;
  page2?: string;
  page3?: string;

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
