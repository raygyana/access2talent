import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

import { CustomModalPopUpModel } from '../../../../component/custom-modal-pop-up/custom-modal-pop-up.model';
import { CustomModalPopUpService } from '../../../../component/custom-modal-pop-up/custom-modal-pop-up.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit {
  deletePopUpbasicSetting: any;
  massage: any;

  constructor(protected customModalPopUpService: CustomModalPopUpService,
    protected router: Router
  ) { }
  openDeletePopUp() {
    this.massage = 'fdsf';
    this.customModalPopUpService.show(this.deletePopUpbasicSetting);
  }
  navigationTO(url) {
    this.router.navigate([url]);

  }
  deleteClick() {
    this.customModalPopUpService.hide(this.deletePopUpbasicSetting);
  }
  ngOnInit() {
    this.createReseDataPopoup();
  }
  createReseDataPopoup() {
    this.deletePopUpbasicSetting = new CustomModalPopUpModel();
    this.deletePopUpbasicSetting.id = 'DeleteDiloag';
    this.deletePopUpbasicSetting.title = 'Login';
    this.deletePopUpbasicSetting.noButtons = true;
    this.deletePopUpbasicSetting.upperCross = true;
  }

}
