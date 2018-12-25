import { MainPassportData, Gender } from '../modules/registration/lib/models';

export const mainPassportData: MainPassportData = Object.assign(new MainPassportData(), {
  name: 'Константин',
  surname: 'Константинов',
  patronymic: 'Константинович',
  gender: Gender.male,
  dateOfBirth: '2018-11-05',
  // dateOfBirth: new Date(1990, 1, 1, 0, 0, 0, 0).toISOString().substring(0, 10),
  serialNumber: '7903555788',
  dateOfIssue: new Date(2010, 2, 1, 0, 0, 0, 0).toISOString().substring(0, 10),
  issuedBy: 'ГУ МВД России по г.Москве',
  issuerCode: '210-098'
});
