import { Injectable } from '@angular/core';
import { BaseService } from '../../services/base/base.service';
import { ProjectUtils } from '../../services/project-utils';


export interface MyBodyI {
	key: string;
	value: string;
}

@Injectable()
export class DataDropDownListService extends BaseService {

	getServiceURL(): string {
		return 'not in use';
	}

	getDropDownData(serviceURL: string, myBody?: Array<MyBodyI>): any {

		let body = this.setParamValue('', 'clientID', ProjectUtils.getClientCode());

		if (Array.isArray(myBody)) {
			myBody.forEach((item) => {
				body += this.setParamValue(body, item.key, item.value);
			})
		}
		return this.getDataWithURL(serviceURL, body);
	}

}

