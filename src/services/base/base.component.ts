import { Inject, Optional, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs';
import { Subscription } from 'rxjs';
// import 'rxjs/add/operator/take';
// Import from III party
// import { DataTableDirective } from 'angular-datatables';
// import { LoaderService } from '../loader/loader.service';
import { ProjectUtils } from '../project-utils';
// import { SavedSearchModel } from '../../components/search-header/saved-search.model';
// import { ListDisplaySearchModel } from '../../components/list-display-search/list-display-search.model';
// import {
//     CzDatePickerComponent
// } from '../../components';
import { BaseService } from './base.service';
import { SessionObject } from '../session-object';
// import { Log, Level } from 'ng2-logger';
// import { MyClientServices } from '../core';
// import { ListDisplaySearchComponent } from '../../components/list-display-search/list-display-search.component';
declare var $;

export abstract class BaseComponent implements OnInit, OnDestroy {

    @ViewChild('baseLoader') baseLoader: any;


    orgData: any;
    futureObjSub: Subscription;
    globalServiceSub: Subscription;
    hideEmptyMsgSub: Subscription;
    baseServiceSub: Subscription;
    setListDataFutureObjSub: Subscription;


    // protected log = Log.create('BaseComponent')
    protected selectedRow: any;
    protected selectedIndex = -1;
    protected dtOptions: any = {};
    // protected mySelf: any;
    public mySelf: any;
    public ngCountry: any;
    // protected displaySearchOptions: ListDisplaySearchModel;
    public listData: any;
    RenderDynamicDatatable: boolean;
    validState = false;
    public tableClass = 'table display nowrap row-border table-hover table-striped table-bordered  table-responsive';
    // public tableClass = this.baseTableClass + ' tableFirstBlock ';
    // public tableSecondClass = this.baseTableClass + ' tableSecondBlock ';
    protected headerName: any;

    private onChangeOfSearchModel = new Subject<string>();
    catchOnChangeOfSearchModel$ = this.onChangeOfSearchModel.asObservable();


    protected currentClient: string;
    getLoaderName(): string | any {

    }

    constructor(
        protected customBaseService?: BaseService,
        //  protected myClientServices?: MyClientServices
    ) {
        // this.currentClient = (!ProjectUtils.isEmpty(this.myClientServices)) ?
        //     this.myClientServices.getMyClient() : '';
        this.mySelf = this;
        if (ProjectUtils.isEmpty(customBaseService)) {
            // console.warn('Missing custom Service, required for Table List');
        }
        this.doSearchSetup();
        this.doTableListSetup();
        this.headerName = {
            title: this.getReportTitle(),
            icon: this.getReportIcon()
        }
    }

    ngOnInit() {

        // this.setDropDownValues();
        // this.setSearchModel(this.getSearchModel());
        this.setDocumentTitle();
        setTimeout(() => {
            this.xtBaseOnInit();

            this.doInInitLoad();
            this.doPreInitLoad();
            this.setSearchModel(this.getSearchModel());
            this.setDateRange();
            this.doOnFormChange();
        }, 300);
    }




    get sessionObject() {
        return SessionObject.getSessionObject();
    }

    set sessionObject(value: SessionObject) {
        this.sessionObject = value;
        // console.log('sessionObject, set', this.sessionObject, value);
        // SessionObject.setSessionObject(sessionObject);
    }

    doInInitLoad() {

    }

    doPreInitLoad() {

    }

    setDocumentTitle() {
        document.title = 'Talent Hunt : ' + this.getReportTitle();
    }

    // showLoader(...loaders: Array<any>) {
    //     this.showLoaderDuplicate(...loaders);
    //     this.loaderService.show(this.getLoaderName());
    //     if (Array.isArray(loaders)) {
    //         loaders.forEach((loader: any) => {
    //             this.loaderService.show(loader);
    //             console.log('showLoader additional', loader);
    //         });
    //     }
    // }

    // hideLoader(...loaders: Array<any>) {

    //     this.hideLoaderDuplicate(...loaders);

    //     this.loaderService.hide(this.getLoaderName());
    //     if (Array.isArray(loaders)) {
    //         loaders.forEach((loader: any) => {
    //             this.loaderService.hide(loader);
    //             // console.log('hbideLoader additional', loader);
    //         });
    //     }
    // }

    onSaveSearch(whichLabel: string) {
        // console.log(whichLabel);
        // const savedSearchModel = new SavedSearchModel();
        // savedSearchModel.searchModel = JSON.parse(JSON.stringify(this.getSearchModel()));
        // savedSearchModel.searchType = this.getSearchType();
        // savedSearchModel.searchLabel = whichLabel;
        // console.log(savedSearchModel);
        // this.saveSearchService.setSavedSearch(this.changeService, savedSearchModel);
    }

    //    Needs to be abstract method
    //    abstract getSearchModel(): any;
    getSearchModel(): any {
        return null;
    }

    // Needs to be abstract method
    //    abstract getSearchType(): string;
    getSearchType(): string {
        return 'unknown';
    }

    // Needs to be abstract method
    getTabsComponent(): any {
        return null;
    }

    // Needs to be abstract method
    // getDataElement(whichService: string): DataTableDirective {
    //     return undefined;
    // }

    // getDatePicker(): CzDatePickerComponent {
    //     return undefined;
    // }


    // Needs to be abstract method
    setSearchModel(searchModel: any) {

    }

    // Needs to be abstract method
    getServiceName(): string {
        return '';
    }

    // Needs to be abstract method
    getBodyData(): string {
        return '';
    }

    // Needs to be abstract method
    openListTab() {
    }

    setDropDownValues() {

    }

    baseProcessData() {
    }

    // getDispSearch(): ListDisplaySearchComponent {
    //     return null;
    // }

    getBodyLimit(body: string, limit: any) {
        if (limit && limit > 0) {
            const localBody = this.customBaseService.setParamValue(body, 'limit', limit);
            return localBody;
        }
        return '';
    }


    // ON Empty Return true
    isSearchModelEmpty(): boolean {
        const model = this.getSearchModel();
        // console.log(model);
        const newModel = Object.assign({}, model);
        delete newModel['limit'];
        const modelArr = Object.keys(newModel)
        for (let i = 0; i < modelArr.length; i++) {
            // console.log(newModel[modelArr[i]]);
            if (newModel[modelArr[i]]) {
                // console.log('I am In')
                return false;
            }
        }

        return true;
    }

    // to remove search critera from list area
    doOnSearchClick(removeParam: any) {
        // console.log('removeParam', removeParam);
        const searchModel = this.getSearchModel();
        if (!ProjectUtils.isEmpty(searchModel)) {
            // console.log('BaseComponent', removeParam, searchModel[removeParam.columnName]);
            if (Array.isArray(searchModel[removeParam.columnName])) {
                let index = 0;
                for (const obj of searchModel[removeParam.columnName]) {
                    // if object found, remove object
                    if (obj.id === removeParam.id) {
                        searchModel[removeParam.columnName].splice(index, 1);
                        break;
                    }
                    index++;
                }
            } else {
                searchModel[removeParam.columnName] = undefined;
            }
            // this.loadDataFromAPIService(this.getServiceName(), this.getBodyData(), this.customBaseService);
            this.setSearchModel(searchModel);
            this.setDropDownValues();
            if (removeParam.columnName === 'country') {
                this.ngCountry = [];
            }
        }
    }

    onSubmit(value: any, performInit: boolean = false): void {
        // console.log('onSubmit:value:', value, '$1');
        // console.log('onSubmit:this.getSearchModel:', this.getSearchModel(), '$2');
        this.onRowSelect(undefined, -1);
        this.setSearchModel(value);
        // console.log('setSearchModel completed');
        if (performInit) {
            this.doInInitLoad();
        }
        this.setDateRange();
        this.openListTab();
        // console.log('openListTab completed');
        this.loadDisplaySearch();
        // this.loadDataFromAPIService(this.getServiceName(), this.getBodyData(), this.customBaseService);
        if (performInit) {
            this.setDropDownValues();
        }
        this.onChangeOfSearchModel.next('change');
    }


    // getDispSearchArrow = () => {
    //     return this.getDispSearch();
    // }

    loadDisplaySearch() {

        // const temp = this.getDispSearch.bind(this);
        // this.futureObjSub = ProjectUtils.getFutureObj(temp, Object)
        //     .subscribe((dispSearch: ListDisplaySearchComponent) => {
        //         dispSearch.refreshDisplayData(this.getSearchModel());
        //     });

        // let dispSearch = this.getDispSearch();
        // if (!ProjectUtils.isEmpty(dispSearch)) {
        //     dispSearch.refreshDisplayData(this.getSearchModel());
        // } else {
        //     setTimeout(() => {
        //         dispSearch = this.getDispSearch();
        //         // console.log(dispSearch);
        //         if (!ProjectUtils.isEmpty(dispSearch)) {
        //             dispSearch.refreshDisplayData(this.getSearchModel());
        //         }
        //     }, 1000);
        // }
    }


    goToSearch() {
        const tabComp = this.getTabsComponent();
        if (!ProjectUtils.isEmpty(tabComp)) {
            tabComp.selectTab(tabComp.tabs.first);
        }
    }

    isRowSelected(): boolean {
        return (this.selectedRow === undefined) ? false : true;
    }

    onRowSelect(data: any, index: number) {
        this.selectedRow = data;
        this.selectedIndex = index;
        // console.log(data, this.selectedRow, this.selectedIndex);
    }

    // Needs to be abstract method
    getReportTitle(): string {
        return '';
    }
    // Needs to be abstract method
    getReportIcon(): string {
        return 'fa-file-text-o';
    }

    // Needs to be abstract method
    getReportFileName(): string {
        return '';
    }

    getContextMenuRows() {
        return 1;
    }


    dtTaskFunc(dtOption, tittitleName, fileName) {

    }

    doTableListSetup() {
        const myDtTaskFunc = this.dtTaskFunc.bind(this);
        this.dtOptions = ProjectUtils.doOptionSettingsFull(this.getReportFileName(), this.getReportTitle(), myDtTaskFunc);
        // this.dtOptions.select = {
        //     style: 'single',
        // };

        document.addEventListener('click', (e) => {
            const d = document.getElementById('dtTableContexMenu');
            if (d) {
                d.style.display = 'none';
                d.addEventListener('contextmenu', e2 => {
                    e2.preventDefault();
                    e2.stopPropagation();
                });
            }
        });

        this.dtOptions.rowCallback = (row: Node, data: any[] | Object, index: number) => {
            const self = this;
            $('td', row).unbind('click');
            $('td', row).bind('click', (value) => {
                // console.log('clickEvent', value);
                if (this.selectedRow === data) {
                    self.onRowSelect(undefined, -1);
                } else {
                    self.onRowSelect(data, index);
                }
                const d = document.getElementById('dtTableContexMenu');

                if (d) {
                    d.style.display = 'none';

                }

                //          // // console.log('bind', row, data, index);

                // console.log(this.selectedRow);
            });
            $('td', row).unbind('contextmenu');
            $('td', row).bind('contextmenu', (e: any) => {

                console.log('contextmenu', e)
                $(e.target).click();
                e.preventDefault();
                const d = document.getElementById('dtTableContexMenu');
                const oneRowHeight = 163 / 6;
                const rowheight = self.getContextMenuRows() * oneRowHeight;
                if (d) {

                    if (this.selectedRow) {
                        e.stopPropagation();
                        d.style.position = 'fixed';
                        d.style.left = (e.clientX) + 'px';
                        d.style.top = (e.clientY - rowheight) + 'px';
                        d.style.display = 'block';
                        //                        console.log(d.style);
                    } else {
                        d.style.display = 'none';
                    }
                }
                // console.log('left', (e.screenX - e.offsetX), 'top', (e.screenY - e.offsetY))
                // console.log('pageX', e.pageX, 'pageY', e.pageY)
                // console.log('offsetX', e.offsetX, 'offsetY', e.offsetY)
                // console.log('clientX', e.clientX, 'clientY', e.clientY)
                // console.log('screenX', e.screenX, 'screenY', e.screenY)



            });

            return row;
        };
        // // console.log('this.customBaseService', this.customBaseService);
        if (!ProjectUtils.isEmpty(this.customBaseService)) {
            this.customBaseService.addColumnsOption(this.dtOptions, this.currentClient);
        }
        this.dtOptions['data'] = [];
    }

    doSearchSetup() {
        // this.displaySearchOptions = new ListDisplaySearchModel();
        // this.displaySearchOptions.displaySearch = this.getSearchModel();
        // console.log('displaySearchOptions', this.displaySearchOptions);
    }

    emptyByDdTrigger(ddTrigger: any) {
        ddTrigger.next([]);
    }


    getCountryDropDownData(whichRegion: any, clearCountryValue: boolean = false) {
        // console.log('getCountryDropDownData', 'whichRegion', whichRegion, 'clearCountryValue::::::::', clearCountryValue);
        const ddTrigger = this.getddTrigger();
        if (clearCountryValue) {
            this.getSearchModel()['country'] = '';
            this.ngCountry = [];
            // console.log('getCountryDropDownData empty called *************************************');
        }
        // console.log('!ProjectUtils.isEmpty(whichRegion)', !ProjectUtils.isEmpty(whichRegion), whichRegion)
        if (!ProjectUtils.isEmpty(whichRegion)) {
            if (typeof whichRegion === 'string') {
                whichRegion = JSON.parse(whichRegion);
            }
            // this.showLoader();
            // console.log('getCountryDropDownData', whichRegion);
            if (null !== whichRegion) {
                // this.globalServiceSub = this.globalService.getCountryData(whichRegion.id)
                //     .subscribe(data => {
                //         if (undefined !== ddTrigger) {
                //             ddTrigger.next(data);
                //             this.ngCountry = this.getSearchModel()['country'];
                //         }
                //         console.log('haideLoader', 'getCountryDropDownData');
                //         this.hideLoader();
                //     }, err => {
                //                         console.log('haideLoader', 'getCountryDropDownData');
                //         this.hideLoader();
                //     });
            }
        } else {
            // console.log('getCountryDropDownData calling trigger');
            if (undefined !== ddTrigger) {
                ddTrigger.next([]);
            }

        }
    }

    // used by Country Drop down to populate values
    getddTrigger() {
        // console.log('BaseComponent:: getddTrigger called');
        return undefined;
    }



    hideEmptyMsgDataTable(msg: string) {

        // const mytimer = Observable.timer(10, 10);
        // this.hideEmptyMsgSub = mytimer
        //     .take(200)
        //     .subscribe((data) => {
        //         const dataTables_empty = document.getElementsByClassName('dataTables_empty');
        //                       if (!ProjectUtils.isEmpty(dataTables_empty)) {
        //             for (let i = 0; i < dataTables_empty.length; i++) {
        //                 dataTables_empty[i].textContent = msg
        //             }
        //             this.hideEmptyMsgSub.unsubscribe();
        //         }
        //     })
    }

    dynamicColumns() {
        return;
    }
    // from API
    // loadDataFromAPIService(whichService: string, body: string, baseService: BaseService) {
    //     this.RenderDynamicDatatable = false;
    //     this.hideEmptyMsgDataTable('Your data is loading.... Please wait!');

    //     this.showLoader();
    //     this.baseServiceSub = baseService.getData(body).subscribe(data => {
    //         this.orgData = data;
    //         this.RenderDynamicDatatable = true;
    //         if ((!Array.isArray(data)) && (!ProjectUtils.isEmpty(data)) && (typeof data === 'object')) {
    //             data = this.filterDataFromDataKey(data);
    //         }
    //         if ((!ProjectUtils.isEmpty(this.orgData))) {
    //             this.listData = data;
    //             const temp = this.baseProcessData();
    //             this.dynamicColumns();
    //             if (temp) {
    //                 this.listData = temp;

    //             } else if (this.listData === undefined) {
    //                 this.dynamicColumns();
    //                 this.listData = [];
    //                 this.hideEmptyMsgDataTable('No data available for this request!');
    //             }
    //         } else {
    //             this.listData = [];
    //             const temp = this.baseProcessData();
    //             this.dynamicColumns();
    //             this.hideEmptyMsgDataTable('No data available for this request!');
    //         }
    //              this.setListData(whichService, this.listData);
    //     }, err => {

    //         this.hideEmptyMsgDataTable('Technical Error: Please try again');
    //         this.RenderDynamicDatatable = true;
    //         this.listData = [];
    //         this.setListData(whichService, []);
    //     });
    //     this.hideLoader();
    // }

    setListData(whichService: string, data: any = []) {

        const mySeachFunc = () => {
            // console.log('whichService', whichService);
            // return this.getDataElement(whichService)
        }

        // if (whichService) {
        //     this.setListDataFutureObjSub = ProjectUtils.getFutureObj(mySeachFunc, DataTableDirective)
        //         .subscribe((dataElement) => {
        //             console.log('DataTableDirective', dataElement)

        //             if ((!ProjectUtils.isEmpty(dataElement)) && (!ProjectUtils.isEmpty(dataElement.dtInstance))) {
        //                 if (dataElement.dtOptions.language) {
        //                     dataElement.dtOptions.language.emptyTable = 'No data available with respect to your request.';
        //                 }

        //                 dataElement.dtInstance.then((dtInstance: DataTables.Api) => {
        //                     dtInstance.clear();
        //                     dtInstance.rows.add(data).draw();
        //                 });
        //             }
        //             this.hideLoader();
        //             console.log('hiadeLoader', 'setListData');


        //         })
        // } else {
        //     this.hideLoader();
        //     console.warn('Calling an setList with no Table', 'whichService = ', whichService);
        // }



        // const dataElement: DataTableDirective = this.getDataElement(whichService);
        // console.log('DataTableDirective', dataElement)
        // // console.log('BaseComponent:setListData', dataElement, dataElement.dtInstance, data);
        // if ((!ProjectUtils.isEmpty(dataElement)) && (!ProjectUtils.isEmpty(dataElement.dtInstance))) {
        //     //            dataElement.dtOptions.language.emptyTable = 'Now empty';
        //     if (dataElement.dtOptions.language) {
        //         dataElement.dtOptions.language.emptyTable = 'No data available with respect to your request.';
        //     }

        //     dataElement.dtInstance.then((dtInstance: DataTables.Api) => {
        //         //             console.log('RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR');
        //         // Rerendering Records
        //         dtInstance.clear();
        //         dtInstance.rows.add(data).draw();
        //     });
        //     //            dataElement.dtOptions.oLanguage.sEmptyTable = 'Now empty';
        // }
        // this.hideaLoader();
        // console.log('hidaeLoader', 'setListData');
    }

    public restrictNumeric(e: any) {
        let input;
        // console.log(e.which);
        if (e.which > 95 && e.which < 107) {
            return true;
        } else if ((e.which > 34 && e.which < 38) || e.which === 39 || e.which === 46) {
            return true;
        } else if (e.metaKey || e.ctrlKey) {
            return true;
        } else if (e.which === 32) {
            return false;
        } else if (e.which === 0) {
            return true;
        } else if (e.which < 33) {
            return true;
        }
        input = String.fromCharCode(e.which);
        return !!/[\d\s]/.test(input);
    }


    // setDropDownComponentValue(keyName: string) {
    //     const comboData = this.getSearchModel()[keyName];
    //     if (!ProjectUtils.isEmpty(comboData)) {
    //         console.log('returned Dropdown Value', ProjectUtils.getIdAsArray(comboData));
    //         return ProjectUtils.getIdAsArray(comboData);
    //     } else {
    //         console.log('comboData is Empty');
    //         return [];
    //     }
    // }



    setDropDownComponentValue(keyName: string) {


        const comboData = this.getSearchModel()[keyName];
        if (!ProjectUtils.isEmpty(comboData)) {
            // console.log('returned Dropdown Value', ProjectUtils.getIdAsArray(comboData));
            return ProjectUtils.getIdAsArray(comboData);
        } else {
            // console.log('comboData is Empty');
            return [];
        }


        // console.log(ngModel);
        // if (ngModel !== undefined) {
        //     const comboData = this.getSearchModel()[keyName];
        //     // console.log(keyName, this.getSearchModel(), comboData);
        //     if (!ProjectUtils.isEmpty(comboData)) {


        //         console.log('######################', ProjectUtils.getIdAsArray(comboData));

        //         ngModel = Array.from(ProjectUtils.getIdAsArray(comboData));

        //         console.log('######################', ngModel);
        //         // if (Array.isArray(comboData)) {

        //         // } else {
        //         //     ddComponent.value = [this.getSearchModel()[keyName].id];
        //         // }
        //     } else {
        //         ngModel = [];
        //     }
        //     // console.log(ddComponent.value);
        //     // ddComponent.value = (!ProjectUtils.isEmpty(this.getSearchModel()[keyName]))
        //     //     ? [this.getSearchModel()[keyName].id] : '';
        // }

        // return ngModel;
    }

    setDateRange() {
        const searchModel = this.getSearchModel();
        // const czDatePicker = this.getDatePicker();
        // console.log('setDateRange************************************', searchModel, czDatePicker);
        // if ((!ProjectUtils.isEmpty(czDatePicker)) && (!ProjectUtils.isEmpty(searchModel['dbStart'])) && (!ProjectUtils.isEmpty(searchModel['dbEnd']))) {
        //     czDatePicker.setNewValue(new Date(searchModel['dbStart'].desc), new Date(searchModel['dbEnd'].desc));
        // }
    }



    setMonthYear(startDate: string, endDate: string, startKey: string = 'from', endKey: string = 'to') {
        const searchModel = this.getSearchModel();
        searchModel[startKey] = startDate || null;
        searchModel[endKey] = endDate || null;
        const ret = {
            startKey: searchModel[startKey],
            endKey: searchModel[endKey]
        }
        console.log('setMonthYear', searchModel);
        return ret;

    }
    resetMonthYear(startKey: string = 'from', endKey: string = 'to') {
        const searchModel = this.getSearchModel();
        searchModel[startKey] = null;
        searchModel[endKey] = null;
        console.log('setMonthYear', searchModel);

        const ret = {
            startKey: searchModel[startKey],
            endKey: searchModel[endKey]
        }
        return ret;
    }


    doOnFormChange() {
        this.validState = this.validState ? false : true;
    }

    doOnTabChange() {
        // console.log('tab Changed');
        this.doOnFormChange();


    }

    calenderSetDefaultValue(searchModel: any) {
        // const searchModel = this.getSearchModel();
        // searchModel.dbStart = new SearchModelType(ProjectUtils.formatDateData(this.getDefaultStartDate(), 'yyyy-MM-dd'), ProjectUtils.formatDateDataWithDefault(this.getDefaultStartDate()), 'dbStart');

        // searchModel.dbEnd = new SearchModelType(ProjectUtils.formatDateData(this.getDefaultEndDate(), 'yyyy-MM-dd'), ProjectUtils.formatDateDataWithDefault(this.getDefaultEndDate()), 'dbStart');
        // const czDatePicker = this.getDatePicker();
        // if (czDatePicker) {
        //     czDatePicker.setNewValue(this.getDefaultStartDate(), this.getDefaultEndDate());
        // }
    }

    getDefaultStartDate() {
        return new Date().setDate(1);
    }
    getDefaultEndDate() {
        return new Date();
    }



    numberFormatWithoutK(amount: any) {
        return ProjectUtils.numberFormatWithOutK(amount);
    }


    numberFormat(amount: any) {
        return ProjectUtils.numberFormat(amount);
    }

    filterDataFromDataKey(data: any) {
        return data['data'];
    }


    myCustomRowCallBack(dtOptions: any, data: any, rowCallBackTsk: any, ...rowCallBackPara) {
        dtOptions.rowCallback = (row: Node, data: any[] | Object, index: number) => {
            const self = this;
            $('td', row).unbind('click');
            $('td', row).bind('click', (value: any) => {
                rowCallBackTsk(self, value, data, rowCallBackPara);
            });
            return row;
        };
    }

    rowCallBackTsk(self: any, event: any, data: any | Array<any>, ...rowCallBackPara) {
        return null;
    }


    xtBaseOnDestroy() {
    }

    xtBaseOnInit() {
    }

    ngOnDestroy() {
        ProjectUtils.unsubscribe(this.futureObjSub, this.globalServiceSub, this.hideEmptyMsgSub, this.baseServiceSub, this.setListDataFutureObjSub)
        this.xtBaseOnDestroy();
    }


    hideLoaderDuplicate(...loaders: Array<| any>) {
        if (this.baseLoader) {
            this.baseLoader.show = false;
        }
        if (Array.isArray(loaders)) {
            loaders.forEach((loader) => {
                loader.show = false;
            })
        }
    }

    showLoaderDuplicate(...loaders: Array<any>) {
        if (this.baseLoader) {
            this.baseLoader.show = true;
        }

        if (Array.isArray(loaders)) {
            loaders.forEach((loader) => {
                loader.show = true;
            })
        }
    }

}


// hideLoader(...loaders: Array<LoaderComponent | any>) {
//     if (this.baseLoader instanceof LoaderComponent) {
//         this.baseLoader.show = false;
//     }
//     if (Array.isArray(loaders)) {
//         loaders.forEach((loader) => {
//             loader.show = false;
//         })
//     }
// }


// showLoader(...loaders: Array<LoaderComponent | any>) {
//     if (this.baseLoader instanceof LoaderComponent) {
//         this.baseLoader.show = true;
//     }
//     if (Array.isArray(loaders)) {
//         loaders.forEach((loader) => {
//             loader.show = true;
//         })
//     }
// }