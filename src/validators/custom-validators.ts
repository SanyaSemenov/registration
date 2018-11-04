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

  // public static passportCode(): ValidatorFn {
  //   return (control: AbstractControl): { [key: string]: any } | null => {
  //     const matched = PASSPORT_CODE.test(control.value);
  //     return matched ? null : { 'wrongPassportCode': true };
  //   };
  // }

  // public static passportNumber(): ValidatorFn {
  //   return (control: AbstractControl): { [key: string]: any } | null => {
  //     const matched = PASSPORT_NUMBER.test(control.value);
  //     return matched ? null : { 'wrongPassportNumber': true };
  //   };
  // }

  public static passportCode(control: AbstractControl) {
    const value = control.value.indexOf('-') > -1 ? control.value.split('-').join() : control.value;
    const matched = PASSPORT_CODE.test(value);
    return matched ? null : { 'wrongPassportCode': true };
  }

  public static passportNumber(control: AbstractControl) {
    const matched = PASSPORT_NUMBER.test(control.value);
    return matched ? null : { 'wrongPassportNumber': true };
  }

  // TODO: Proper Validation
}
