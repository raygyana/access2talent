import { Injectable } from '@angular/core';
declare var $;
import { CustomModalPopUpModel } from './custom-modal-pop-up.model';
@Injectable()
export class CustomModalPopUpService {


      private customPopUps = new Set<CustomModalPopUpModel>();
      constructor() {
      }

      _register(info: CustomModalPopUpModel): void {
            this.customPopUps.add(info);
            console.log('CustomModalPopUpModel _register', this.customPopUps);
      }

      _unregister(info: CustomModalPopUpModel): void {
            this.customPopUps.forEach(item => {
                  if (item === info) {
                        this.customPopUps.delete(item);
                  }
            });
            console.log('CustomModalPopUpModel _unregister', this.customPopUps);
      }

      showHideMe(val: boolean, id: string) {
            if (val) {
                  $(`#${id}`).modal('show');
            } else {
                  $(`#${id}`).modal('hide');

                  const body = document.getElementsByTagName('body')[0];
                  body.classList.remove('newmodal-open');
            }
      }


      show(info: CustomModalPopUpModel) {
            $(`#${info.id}`).modal('show');
      }

      hide(info: CustomModalPopUpModel) {
            $(`#${info.id}`).modal('hide');
            const body = document.getElementsByTagName('body')[0];
            body.classList.remove('newmodal-open');
      }

      onshow(info: CustomModalPopUpModel) {
            console.log('event registed', info.id);
            $(`#${info.id}`).on('hidden.bs.modal', function (e) {
                  // alert('hi');
                  console.log('event fire');
                  const body = document.getElementsByTagName('body')[0];
                  body.classList.remove('newmodal-open');
                  // e.preventDefault();
            });
      }


}
