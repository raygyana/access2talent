import { Injectable } from '@angular/core';

@Injectable()
export class BreadCrumbService {
      private bcHeading: string;
      private bcCurrentHeading: string;

      getBreadCrumbHeading() {
            return this.bcHeading;
      }

      getBreadCrumbCurrentHeading() {
            return this.bcCurrentHeading;
      }
}
