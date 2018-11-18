import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'time'
})
export class TimePipe implements PipeTransform {

  transform(seconds: number, args?: any): any {
    if (seconds === null || typeof seconds === 'undefined') {
      return null;
    }
    const sec = seconds % 60;
    const output = `${Math.floor(seconds / 60)}:${sec < 10 ? '0' + sec : sec}`;
    return output;
  }

}
