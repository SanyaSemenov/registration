import { ValidatorFn, AbstractControl } from '@angular/forms';
import { REGEXP_EXTENSION, PASSPORT_CODE, PASSPORT_NUMBER } from '../regexp';

export class CustomValidators {
  public static imageExtensions(allowed: string[]): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const fileExt = REGEXP_EXTENSION.exec(control.value);
      const notMatched = fileExt ? allowed.indexOf(fileExt.pop().toLowerCase()) === -1 : false;
      return notMatched ? { 'wrongExtension': true } : null;
    };
  }

  // public static issuerCode(): ValidatorFn {
  //   return (control: AbstractControl): { [key: string]: any } | null => {
  //     const matched = PASSPORT_CODE.test(control.value);
  //     return matched ? null : { 'wrongissuerCode': true };
  //   };
  // }

  // public static serialNumber(): ValidatorFn {
  //   return (control: AbstractControl): { [key: string]: any } | null => {
  //     const matched = PASSPORT_NUMBER.test(control.value);
  //     return matched ? null : { 'wrongserialNumber': true };
  //   };
  // }

  public static issuerCode(control: AbstractControl) {
    const value = control.value.indexOf('-') > -1 ? control.value.split('-').join() : control.value;
    const matched = PASSPORT_CODE.test(value);
    return matched ? null : { 'wrongissuerCode': true };
  }

  public static serialNumber(control: AbstractControl) {
    const matched = PASSPORT_NUMBER.test(control.value);
    return matched ? null : { 'wrongserialNumber': true };
  }

  // TODO: Proper Validation
}
