import {
  Component, OnInit, Input, Output,
  EventEmitter, TemplateRef, AfterViewInit, OnChanges,
  SimpleChanges, OnDestroy, ViewChild, ChangeDetectorRef
} from '@angular/core';
import { CustomModalPopUpModel } from './custom-modal-pop-up.model';
import { CustomModalPopUpService } from './custom-modal-pop-up.service';


declare var $;


@Component({
  selector: 'app-custom-modal-pop-up',
  templateUrl: './custom-modal-pop-up.component.html',
  styleUrls: ['./custom-modal-pop-up.component.css'],
  providers: []
})




export class CustomModalPopUpComponent implements OnChanges, AfterViewInit, OnInit, OnDestroy {

  @Input()

  basicSetting: CustomModalPopUpModel;
  @Input() AlertType: any;
  // @ViewChild('tempTemplate') tempTemplate;
  @Input() template: TemplateRef<any>;

  @Output() modalAfterViewInIt = new EventEmitter();
  normalIDCounts = 0;
  private isShowing: boolean;

  @Input() get show(): boolean {
    return this.isShowing;
  }

  set show(val: boolean) {
    this.cmpus.showHideMe(val, this.basicSetting.id);
    this.isShowing = val;
  }

  constructor(
    private cmpus: CustomModalPopUpService,
    private cdr: ChangeDetectorRef
  ) { }


  ngOnChanges(changes: SimpleChanges) {
    // console.log('ngOnChanges', this.template, changes)
    // console.log('AlertTypeAlertType', this.AlertType);
    this.cdr.detectChanges();
  }
  generateNormalIDs(name) {
    return name + (++this.normalIDCounts);
  }

  ngOnInit() {
    this.errorChecking();
    this.basicSetting.id = this.generateNormalIDs('ModalPupUp');
    this.cmpus._register(this.basicSetting);
  }

  ngAfterViewInit() {
    this.cmpus.showHideMe(this.isShowing, this.basicSetting.id);
    this.modalAfterViewInIt.emit();
  }

  ngOnDestroy() {
    this.cmpus._unregister(this.basicSetting);
    const modal_backdrop: Element = document.getElementsByClassName('modal-backdrop')[0];
    if (modal_backdrop) {
      modal_backdrop.remove();
    }
  }

  errorChecking() {
    if (!this.basicSetting.title) {
      throw new Error('Pop up should have title');
    }

    this.basicSetting.button1 = this.basicSetting.button1 || 'Close';
    this.basicSetting.button2 = this.basicSetting.button2 || 'Ok';
  }
}
