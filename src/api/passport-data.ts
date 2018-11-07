import { MainPassportData, Gender } from '../modules/registration/lib/models';

export const mainPassportData: MainPassportData = {
  name: 'Константин',
  surname: 'Константинов',
  middleName: 'Константинович',
  gender: Gender.male,
  birth: '2018-11-05',
  // birth: new Date(1990, 1, 1, 0, 0, 0, 0).toISOString().substring(0, 10),
  passportNumber: '7903555788',
  passportDate: new Date(2010, 2, 1, 0, 0, 0, 0).toISOString().substring(0, 10),
  passportByWhom: 'ГУ МВД России по г.Москве',
  passportCode: '210-098'
};
