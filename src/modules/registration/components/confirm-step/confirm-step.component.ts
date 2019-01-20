import { Component, OnInit, Output, EventEmitter, OnDestroy, Inject } from '@angular/core';
import { RegistrationService } from '../../registration.service';
import { takeUntil } from 'rxjs/operators';
import { Subject, BehaviorSubject } from 'rxjs';
import { API_CONFIG, ApiInjection } from 'src/api';

@Component({
  selector: 'app-confirm-step',
  templateUrl: './confirm-step.component.html',
  styleUrls: ['./confirm-step.component.less']
})
export class ConfirmStepComponent implements OnInit, OnDestroy {

  constructor(
    private service$: RegistrationService,
    @Inject(API_CONFIG) config: BehaviorSubject<ApiInjection>
  ) {
    config.subscribe((config: ApiInjection) => {
      if (config.mock === false) {
        this.service$.getSignatureDoc()
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe((filename) => {
            this.service$.getDoc(filename)
              .pipe(takeUntil(this.ngUnsubscribe))
              .subscribe((data: any) => {
                this.pdfSrc = data;
              });
          });
      }
      else {
        this.pdfSrc = '/assets/document.pdf';
      }
    })
  }

  // private rootUrl = 'https://ch.invend.ru/api';
  // public readonly url = `${this.rootUrl}/file/`;

  isDialogOpened = false;
  imageData: any;
  public loading = false;
  private ngUnsubscribe = new Subject<void>();
  _agreed = false;
  get agreed() {
    return this._agreed;
  }
  set agreed(value) {
    if (this._agreed === value) {
      return;
    }
    this._agreed = value;
    if (this._agreed) {
      this.showConfirmDialog();
    }
  }
  get enabled() {
    return this.agreed && !!this.imageData;
  }
  pdfSrc: string;

  // tslint:disable-next-line:no-output-on-prefix
  @Output('onNavigate')
  onNavigate: EventEmitter<boolean> = new EventEmitter<boolean>();

  ngOnInit() {
  }

  next(e: boolean) {
    this.loading = true;
    const dataToShare = this.imageData.split(',')[1];
    this.service$.sendSignature(dataToShare)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(data => {
        this.onNavigate.emit(true);
        this.loading = false;
      },
        error => {
          this.loading = false;
          alert('Произошла ошибка при попытке отправить подпись');
        }
      );
  }

  back(e: boolean) {
    this.onNavigate.emit(false);
  }

  showConfirmDialog() {
    this.isDialogOpened = true;
  }

  onDialogClose(data) {
    if (!data) {
      this.agreed = false;
      this.isDialogOpened = false;
      return;
    }
    this.imageData = data;
    this.isDialogOpened = false;
    console.log(data);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
