import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeysPipe } from './keys-pipe.pipe';
import { TimePipe } from './time.pipe';

const pipes = [
  KeysPipe,
  TimePipe
];

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: pipes,
  exports: pipes
})
export class PipesModule { }
