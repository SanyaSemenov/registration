import { MainPassportData, Gender } from '../modules/registration/lib/models';

export const mainPassportData: MainPassportData = {
  name: 'Константин',
  surname: 'Константинов',
  middleName: 'Константинович',
  gender: Gender.male,
  birth: new Date(1990, 1, 1, 0, 0, 0, 0),
  passportNumber: '7903555788',
  passportDate: new Date(2010, 2, 1, 0, 0, 0, 0),
  passportByWhom: 'ГУ МВД России по г.Москве',
  passportCode: '210-098'
};
