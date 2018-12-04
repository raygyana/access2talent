import { Headers } from '@angular/http';
import { DatePipe } from '@angular/common';
import { SessionObject } from './session-object';
import { Utils } from './utils';
import { BaseSearchModel } from '../services/base/base-search.model';
// import { ChangeService } from './change-service';
// import { DataDropDownOptions } from '../../components/data-drop-down/data-drop-down.model';
import { BaseComponent } from '../services/base';
import { Constants } from './constant';
// import { truncate } from 'fs';
declare var $;
declare var moment;
export class ProjectUtils extends Utils {

    public static DATE_FORMAT = 'MMM DD, YYYY';

    public static getHeaderHttp(): Headers {
        const headers: Headers = new Headers();
        // headers.append('Authorization', 'Basic ' + btoa(username + ':' + password));
        headers.append('authorization', 'Basic aW5zaWdodHNlcnZpY2U6TXBzSW5zaWdodA==');
        headers.append('content-type', 'application/x-www-form-urlencoded');
        headers.append('cache-control', 'no-cache');
        return headers;
    }

    public static downloadfileName(fileName: string) {
        const d1 = new Date();
        const time2 = d1.getTime();
        const time1 = ProjectUtils.formatDateData(time2, 'yyyyMMMdd-HHmmss');
        return fileName + '_' + time1;
    }



    public static dtEnablePDF(dtOption, pFileName, pTitle) {
        const pdfSetting = {
            extend: 'pdf',
            footer: true,
            title: pTitle,
            filename: function () {
                return ProjectUtils.downloadfileName(pFileName || 'pdfFile');
            }
        };


        if (dtOption) {
            if (Array.isArray(dtOption['buttons'])) {
                dtOption['buttons'][1]['buttons'].push(pdfSetting);
            } else {
                dtOption['buttons'] = [pdfSetting];
            }
        }
    }


    public static defaultPageSize(dtOption: any, pageSize: number) {

        dtOption['pageLength'] = pageSize;
    }


    public static doOptionSettings(pFileName?: string, pTitle: string = '', showDownload: boolean = true, myFun?: any): any {
        const dtOptions: any = {
            // oLanguage: {
            //     sLengthMenu: 'Display _MENU_ records'
            // },
            // aaSorting: [],
            // aoColumnDefs: [
            //     { 'bSortable': false, 'aTargets': [0] }
            // ],
            pageLength: 10,
            pagingType: 'full_numbers',
            lengthChange: true,
            lengthMenu: [10, 25, 50, 100],
            scrollX: false,
            language: {
                infoEmpty: '',
                // emptyTable: '',
                // zeroRecords: '',
                emptyTable: 'No data available for this request!',
                zeroRecords: 'No data available for this request!',
                paginate: {
                    first: '<i class="fa fa-backward" aria-hidden="true"></i>',
                    last: '<i class="fa fa-forward" aria-hidden="true"></i>',
                    next: '<i class="fa fa-caret-right" aria-hidden="true"></i>',
                    previous: '<i class="fa fa-caret-left" aria-hidden="true"></i>'
                },
                buttons: {
                    // colvis: '<i class="fa fa-bars download_class"></i>'
                },
                select: {
                    rows: ''
                }
            },
            fixedHeader: {
                header: true,
                footer: true
            }
        };

        dtOptions['dom'] = 'RBlfrtip';
        dtOptions['buttons'] = [];
        dtOptions['buttons'].push({
            extend: 'colvis',
            text: '<i class="fa fa-bars download_class"></i>'
        });
        if (showDownload) {
            dtOptions['buttons'].push({
                extend: 'collection',
                text: '<i class="fa fa-download download_class"></i>',  // '<i class="fa fa-cloud-download download_class"></i>',
                buttons: [
                    {
                        extend: 'csv',
                        footer: true,
                        title: pTitle,
                        charset: 'UTF-16LE',
                        bom: true,
                        filename: function () {
                            return ProjectUtils.downloadfileName(pFileName || 'csvFile');
                        }
                    },
                    {
                        extend: 'excel',
                        footer: true,
                        title: pTitle,
                        filename: function () {
                            return ProjectUtils.downloadfileName(pFileName || 'excelFile');
                        }
                    }
                    // ,
                    // {
                    //     extend: 'pdf',
                    //     footer: true,
                    //     title: pTitle,
                    //     filename: function () {
                    //         return ProjectUtils.downloadfileName(pFileName || 'pdfFile');
                    //     }
                    // },
                    // {
                    //     extend: 'print',
                    //     footer: true,
                    //     title: pTitle,
                    // },
                    // {
                    //     extend: 'copy',
                    //     footer: true,
                    //     title: pTitle,
                    // }
                ]
            }
            );
        }

        if (typeof myFun === 'function') {
            myFun(dtOptions, pFileName, pTitle);
        }

        return dtOptions;
    }


    public static doOptionSettingsFull(pFileName?: string, pTitle: string = '', showDownload?: boolean, myTaskFn?: any): any {
        const dtOptions = ProjectUtils.doOptionSettings(pFileName, pTitle, showDownload, myTaskFn);
        // dtOptions['scrollY'] = '400px';
        return dtOptions;
    }

    public static getClientCode(): string {
        const sessionObject: SessionObject = SessionObject.getSessionObject();
        console.log(sessionObject);
        return sessionObject.clientID;
    }



    // public static getOptionTerms(baseComponent: BaseComponent): DataDropDownOptions {
    //     const ddOptionsTerms = new DataDropDownOptions();
    //            ddOptionsTerms.keyName = 'id';
    //     ddOptionsTerms.keyDesc = 'value';
    //     ddOptionsTerms.baseComponent = baseComponent;
    //     ddOptionsTerms.modelName = 'term';
    //     ddOptionsTerms.multipleState = true;
    //     ddOptionsTerms.sizeCount = 3;
    //     return ddOptionsTerms;
    // }



    public static makeSelectDownloadList(data: Array<any>, firstLabel: string, otherLabelsKey: string, valuesKey: string, id: string): string {
        const selectStart = `<select id ="${id}" onclick="console.log('abc')"   onChange="download(this.value)">`;
        const selectEnd = `</select>`;
        let Output = '';

        const FirstChain = `<option value="">${firstLabel}</option>`;
        Output += selectStart + FirstChain;
        data.forEach((item) => {
            Output += `<option value="${item[valuesKey]}">${item[otherLabelsKey]}</option>`
        })
        Output += selectEnd;
        return Output;
    }

    public static makeSingleDownloadLink(lablel: string, link: string, cssClass?: string): string {
        return `<a class="${cssClass}" href="${link}" target="_black">${lablel}</a>`
    }


    public static makeRouterLink(lablel: string, link: string, cssClass?: string): string {
        return `<a class="${cssClass}" routerLink="['${link}']">${lablel}</a>`
    }


    public static dtGetCheckBoxValuesFromDT(event: any, data: any, obj: any, key): boolean {
        {
            const checked = event.target.checked;
            if (checked !== undefined) {
                return ProjectUtils.setCheckBoxValue(checked, data, obj, key);
            }
        }
    }

    public static setCheckBoxValue(checked: boolean, value, obj: any, key): boolean {

        if (!Array.isArray(obj[key])) {
            obj[key] = [];
        }
        if (checked) {
            if (!obj[key].includes(value)) {
                obj[key].push(value)
            }

        } else {
            const index = obj[key].indexOf(value);
            if (index > -1) {
                obj[key].splice(index, 1);
            }
        }
        if (obj[key].length) {
            return true;
        } else {
            return false;
        }
    }
    public static getValueFromAutoCompleteStr(value: string, accCode: boolean): string {
        return value;
    }


    public static getValueFromAutoCompleteControl(value: string): string {
        if (value && value.includes('-') && value.includes('{') && value.includes('}')) {
            value = value.split('-')[1].split('{')[1].split('}')[0];
            return value;
        } else {
            if (value && value.includes('{') && value.includes('}')) {
                value = value.split('{')[1].split('}')[0];
                return value;
            }

            if (value && value.includes('#')) {
                value = '' + parseInt(value.split('#')[1], 10);
                return value;
            }
        }


        return value;
    }

    public static initToolTip() {
        const options = {
            animation: true,
            delay: 100,
            placement: 'auto',
            trigger: 'hover focus'
        }
        console.log($('.tooltipInfo').tooltip(options))
    }

    public static checkBoxClicked(event: any): Promise<any> {
        return new Promise((resolve, reject) => {
            const value = event.target.checked;
            if (value === undefined) {
                reject()
            } else {
                resolve(value);
            }
        });
    }

    public static dtNoDataAvailable(arr) {
        if (!arr[0]) {
            arr[0] = {
                'No Data Available': 'No Data Available',
                'No Data Available ': 'No Data Available'
                , 'No Data Available  ': 'No Data Available'
            }
        }
    }

    public static setDashBoardItems(val: any) {

        const temp = btoa(JSON.stringify(val));
        const name = btoa('dashboard');
        localStorage.setItem(name, temp);
    }

    public static getDashBoardItems() {
        const name = btoa('dashboard');
        const val = localStorage.getItem(name);
        return JSON.parse(atob(val));
    }


    public static loadCss(url: string, id: string) {

        if (!document.getElementById(id)) {
            const head = document.getElementsByTagName('head')[0];
            const link = document.createElement('link');
            link.id = id;
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = url;
            link.media = 'all';
            head.appendChild(link);
            console.log('myDynamicCss Path', link.href);
        }
    }


    public static getMinDateForDatePicker(month: number, year: number) {
        const monthStr = ('0' + month).slice(-2);
        const minDate = moment(year + '-' + monthStr + '-01', 'YYYY-MM-DD');
        return minDate;
    }


    public static getMaxDateForDatePicker(month: number, year: number) {
        const monthStr = ('0' + (month + 1)).slice(-2);
        const maxDate = moment(year + '-' + monthStr + '-01', 'YYYY-MM-DD').subtract(1, 'days');
        return maxDate;
    }

    public static setManageUsersReportsSearch(sessionObject: SessionObject, newDynamicReportsSearch: any) {
        sessionObject.manageUsersReportsSearch = newDynamicReportsSearch;
        SessionObject.setSessionObject(sessionObject);
    }

}
