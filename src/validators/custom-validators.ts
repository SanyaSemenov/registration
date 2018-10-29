import { ValidatorFn, AbstractControl } from '@angular/forms';
import { REGEXP_EXTENSION } from '../regexp';

export class CustomValidators {
  public static imageExtensions(allowed: string[]): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const fileExt = REGEXP_EXTENSION.exec(control.value);
      const notMatched = fileExt ? allowed.indexOf(fileExt.pop().toLowerCase()) === -1 : false;
      return notMatched ? { 'wrongExtension': true } : null;
    };
  }
}
