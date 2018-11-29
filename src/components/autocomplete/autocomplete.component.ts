import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { BaseModel } from 'angular-kladr';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.less']
})
export class AutocompleteComponent implements OnInit {
  @Input()
  placeholder: string;

  @Input()
  controlName: string;

  @Input()
  formControl: FormControl;

  @Input()
  list: BaseModel[];

  @Output()
  controlValueChange = new EventEmitter<any>();

  filteredOptions: Observable<BaseModel[]>;

  constructor() { }

  displayFn(item?: BaseModel): string | undefined {
    return item ? item.name : undefined;
  }

  ngOnInit() {
    this.filteredOptions = this.formControl.valueChanges
      .pipe(
        startWith<string | BaseModel>(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filter(name) : this.list.slice())
      );
    this.filteredOptions.subscribe(x => this.controlValueChange.emit(x));
  }

  private _filter(name: string): BaseModel[] {
    const filterValue = name.toLowerCase();

    return this.list.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }
}
