import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';
import { SessionObject } from '../session-object';
import { ProjectUtils } from '../project-utils';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

declare var moment;
export interface DropDownBodyI {
    key: string;
    value: string;
}


@Injectable()
export abstract class BaseService {
    protected sessionObject: SessionObject;

    constructor(protected httpService?: HttpService,
        private router?: Router) {
        this.refreshSessionObject();
    }

    abstract getServiceURL(): string;

    // Needs to be abstract method
    addColumnsOption(dtOptions: any, whichClient?: string) {
    }

    refreshSessionObject(): SessionObject {
        this.sessionObject = SessionObject.getSessionObject();
        return this.sessionObject;
    }

    getData(body: any): Observable<any[]> {
        return this.getDataWithURL(this.getServiceURL(), body);
    }

    getDataWithURL(strURL: string, body: any, responseType?: string): Observable<any[]> {
        this.sessionObject = SessionObject.getSessionObject();

        let tokenId = null;
        if ((null !== this.sessionObject) && (undefined !== this.sessionObject.activeCurrentUser)) {
            tokenId = this.sessionObject.activeCurrentUser.token;
        }

        return this.httpService.extractPostData(strURL, body, tokenId, responseType)
            .map(this.extractData)
            .catch(this.handleError)
    }

    loadJSONData(jsonPath: string) {
        return this.httpService.get(jsonPath)
            .map(response => response.json())
            .catch(this.handleError);
    }

    protected extractData(res: any) {
        // console.log('BaseService::extractData:Response', res, ':', res.text(), ':');
        //        const body = (res.text() !== '') ? res.json() : [];
        const body = (res !== '') ? res : [];
        return body || [];
    }

    // protected handleError(error: any) {
    //     // In a real world app, we might use a remote logging infrastructure
    //     // We'd also dig deeper into the error to get a better message
    //     const errMsg = (error.message) ? error.message :
    //         error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    //     // console.error(errMsg); // log to console instead
    //     return Observable.throw(errMsg);
    // }

    protected handleError = (error: any) => {
        if ((error['status'] === 417) && error['error']['message'].includes('Invalid Session')) {
            // localStorage.clear();
            this.router.navigate(['/']);
            // this.router.showGlobalPopup(`<span style="color:red; font-weight: bold"> Session has been expired!</span>`);
        }

        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        const errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }

    newSetParamValue(data: URLSearchParams, keyName: string, keyValue: string) {
        data.append(keyName, keyValue);
    }

    newSetDateSearchParam(searchModel: any, data: URLSearchParams) {
        if (!ProjectUtils.isEmpty(searchModel['dbStart'])) {
            this.newSetParamValue(data, 'startDate', searchModel['dbStart'].id);
        }
        if (!ProjectUtils.isEmpty(searchModel['dbEnd'])) {
            this.newSetParamValue(data, 'endDate', searchModel['dbEnd'].id);
        }
    }

    newSetDropDownSearchParam(data: URLSearchParams, keyName: string, searchModel: any) {
        if (!ProjectUtils.isEmpty(searchModel[keyName])) {
            console.log(searchModel[keyName]);
            let obj = searchModel[keyName];
            if (typeof searchModel[keyName] === 'string') {
                obj = JSON.parse(searchModel[keyName]);
            }
            this.newSetParamValue(data, keyName, obj.id);
        }
    }

    setParamValue(body: string, keyName: string, keyValue: string): string {
        if (!ProjectUtils.isEmpty(keyValue)) {
            if (body !== '') {
                return '&' + encodeURIComponent(keyName) + '=' + encodeURIComponent(keyValue);
            } else {
                return encodeURIComponent(keyName) + '=' + encodeURIComponent(keyValue);
            }
        }
        return '';
    }



    setParamValueWithQuotes(body: string, keyName: string, keyValue: string): string {
        //        console.log(body, keyName, keyValue);
        if (!ProjectUtils.isEmpty(keyValue)) {
            if (body !== '') {
                return '&' + encodeURIComponent(keyName) + '=\'' + encodeURIComponent(keyValue) + '\'';
            } else {
                return encodeURIComponent(keyName) + '=\'' + encodeURIComponent(keyValue) + '\'';
            }
        }
        return '';
    }

    getSingleDateSearchParam(searchModel: any, body: string, name: string): string {
        let retBody = '';
        if (!ProjectUtils.isEmpty(searchModel['dbStart'])) {
            retBody += this.setParamValue(body, name, searchModel['dbStart'].id);
        }
        return retBody;
    }

    getDateSearchParam(searchModel: any, body: string): string {
        let retBody = '';
        if (!ProjectUtils.isEmpty(searchModel['dbStart'])) {
            retBody += this.setParamValue(body, 'startDate', searchModel['dbStart'].id);
        }
        if (!ProjectUtils.isEmpty(searchModel['dbEnd'])) {
            retBody += this.setParamValue(retBody, 'endDate', searchModel['dbEnd'].id);
        }
        // console.log(body);
        return retBody;
    }

    getDropDownSearchParam(body: string, keyName: string, searchModel: any): string {
        return this.localDropDownSearchParamWithQuotes(body, keyName, searchModel, false);
    }

    getDropDownSearchParamWithQuotes(body: string, keyName: string, searchModel: any): string {
        return this.localDropDownSearchParamWithQuotes(body, keyName, searchModel, true);
    }

    localDropDownSearchParamWithQuotes(body: string, keyName: string, searchModel: any, withQuotes: boolean): string {
        if (!ProjectUtils.isEmpty(searchModel[keyName])) {
            console.log(keyName, ' ', searchModel[keyName]);
            let obj = searchModel[keyName];
            if (typeof obj === 'string') {
                obj = JSON.parse(searchModel[keyName]);
            }
            const objectIds = ProjectUtils.getIds(obj);
            if (withQuotes) {
                return this.setParamValueWithQuotes(body, keyName, objectIds);
            } else {
                return this.setParamValue(body, keyName, objectIds);
            }
        }
        return '';
    }

    olddateFormInDatatable(value) {
        if (value === null) { return '' };
        return moment(value).format(ProjectUtils.DATE_FORMAT);
    }

    addPercentage(value) {
        if (value !== '') {
            return value + ' %';
        }
        return value;
    }

    dateFormInDatatable(value) {
        moment.locale('en-us');
        const date = moment(value).format(ProjectUtils.DATE_FORMAT);
        if (date !== 'Invalid date') {
            return date;
        } else {
            console.log('Invalid Date');
        }
        return '';
    }
    decimaltwoplace(value) { if (value === null) { return '' }; return parseFloat(value).toFixed(2); }

    dateFormateMMDDYYYY(value) {
        if (value === null || ProjectUtils.isEmpty(value)) { return '' };
        value = value.split(' ')[0];
        value = new Date(value);
        let dd = value.getDate();

        let mm = value.getMonth() + 1;
        const yyyy = value.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }

        if (mm < 10) {
            mm = '0' + mm;
        }

        value = mm + '/' + dd + '/' + yyyy;

        return value;
    }

    convertcheckbox(value) {
        if (value === true) {
            return '<input type="checkbox" checked>';
        } else {
            return '<input type="checkbox" unchecked>';
        }
    }
    addCsvIconsAndStyle(td, cellData, rowData, row, col) {
        // console.log('value-----------', value);
        if (rowData['Report Format'].indexOf('csv') !== -1) {

            return '<span class="gridIcon"><a href="javascript:;"><span class="icon-document"></span></a></span>'
        }

        return '--'

    }

    addGcsvIconsAndStyle(td, cellData, rowData, row, col) {
        // console.log('value-----------', value);
        if (rowData['Report Format'].indexOf('gcsv') !== -1) {

            return '<span class="gridIcon"><a href="javascript:;"><span class="icon-gcsv"></span></a></span>'
        }

        return '--'

    }
    addXmlIconsAndStyle(td, cellData, rowData, row, col) {
        // console.log('value-----------', value);
        if (rowData['Report Format'].indexOf('xml') !== -1) {

            return '<span class="gridIcon"><a href="javascript:;"><span class="icon-document-file-xml"></span></a></span>'
        }
        return '--'
    }

    createlink(td, cellData, rowData, row, col) {
        console.log('createlink===========', 'td--', td, 'cellData--', cellData, 'rowData--', rowData, 'row--', row, 'col--', col);
        if (!ProjectUtils.isEmpty(rowData['Report Format']) && rowData['Report Format'].indexOf('csv') !== -1) {
            return '<a target=_blank href="/quality_assurance/' + td + '.csv"   >' + td + '</a>'
        }
        return td;
    }
    createlinkLiveReports(td, cellData, rowData, row, col) {

        console.log('createlink===========', 'td--', td, 'cellData--', cellData, 'rowData--', rowData, 'row--', row, 'col--', col);
        if (!ProjectUtils.isEmpty(rowData['Live'])) {
            return '<a target=_blank href=""   >' + td + '</a>'
        }
        return td;

    }


    getDropDownData(serviceURL: string, myBody?: Array<DropDownBodyI>): Observable<any> {
        let body = this.setParamValue('', 'clientID', ProjectUtils.getClientCode());
        if (Array.isArray(myBody)) {
            myBody.forEach((item) => {
                body += this.setParamValue(body, item.key, item.value);
            })
        }
        return this.getDataWithURL(serviceURL, body);
    }



    // dtOptionWithCustumMessageOnTop(dtOptions: any, startMsg: string, endMsg: string) {
    //     dtOptions['oLanguage'] = {
    //         // sInfoPostFix: 'All records shown are derived from real information.',
    //         sLengthMenu: `${endMsg} <br> ${startMsg}<select>' +
    //         '<option value="10">10</option>' +
    //         '<option value="25">25</option>' +
    //         '<option value="50">50</option>' +
    //         '</select> `,
    //         // sColvis: '<i class="fa fa-bars download_class"></i>'
    //     }
    // }

    limitStringNAddToolTip(val: string) {
        const str = val.substring(0, 60);
        let toShow = null;
        if (val.length > 60) {
            toShow = str + '...';
        } else {
            toShow = str;
        }
        return `<span title=">${val}">${toShow}</span>`
    }

    editicon(value: any) {
        if (value === true) {
            return '<a href="javascript:;"><i class="fa fa-edit" style="font-size:16px;"></i></a>';
        }
        return value;
    }

    editDeleteButton(value: any) {
        return `<a href="javascript:;" style="text-decoration: none;"><i class="fa fa-edit" ></i>&nbsp;&nbsp;&nbsp;
        <i class="fa fa-trash" ></i></a>`;
    }

}
