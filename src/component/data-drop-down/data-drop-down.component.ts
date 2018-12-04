import {
  Component, OnInit, Input, Output,
  EventEmitter, OnDestroy, forwardRef, ChangeDetectorRef,
  AfterViewInit, DoCheck, OnChanges
} from '@angular/core';
import {
  IMultiSelectOption, IMultiSelectTexts, IMultiSelectSettings
} from 'angular-2-dropdown-multiselect';

import { mySettings, myTexts } from './data-drop-down.setting';

import {
  FormControl, FormGroup, FormBuilder,
  Validators, ControlValueAccessor, NG_VALUE_ACCESSOR,
  NG_VALIDATORS, Validator
} from '@angular/forms';

import { Utils } from '../../services/utils';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/take';


import { DataDropDownListService, MyBodyI } from './data-drop-down.service';
import { DataDropDownOptions } from '../data-drop-down/data-drop-down.model';
import { isArray } from 'util';
import { utils } from 'protractor';
import { ProjectUtils } from '../../services/project-utils';


export interface DropDownOptionsI {
  name: string | number;
  id: string | number;
}

export interface ApiTriggerI {
  body: Array<MyBodyI>;
  url?: string;
}

export interface DropdownBodyParameter {
  key: string;
  value: string;
}


@Component({
  selector: 'app-data-drop-down',
  templateUrl: './data-drop-down.component.html',
  styleUrls: ['./data-drop-down.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DataDropDownComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DataDropDownComponent),
      multi: true,
    },
    DataDropDownListService]
})

export class DataDropDownComponent implements OnInit, OnDestroy, ControlValueAccessor, Validator, OnChanges {

  private data: any;
  @Input() ddName: string;
  @Input() ddOptions: DataDropDownOptions;
  @Input() ddTrigger: Subject<any>;
  @Input() apiTrigger: Subject<ApiTriggerI>;
  @Input() isrequired = false;
  @Output() onValueChange = new EventEmitter<any>();
  @Input() isDisabled = false;

  optionsModel = new Array<any>();
  myOptions: IMultiSelectOption[];
  fetchDataSub: Subscription;
  dropDownData: Array<DropDownOptionsI> = [];
  dropDownDataLast: any = [];
  LastData: any = [];
  lastSessionData: any;

  fetchDataOnClickFlag = true;
  ownLoader: boolean;

  EmptyObjectObservable: Observable<Array<any>>;
  EmptyObjectSubscription: Subscription;

  mySettings: IMultiSelectSettings = Utils.cloneObject(mySettings);

  myTexts: IMultiSelectTexts = Utils.cloneObject(myTexts);
  value;



  testName = 'rev';
  constructor(
    private dataDropDownListService: DataDropDownListService,
    private cdr: ChangeDetectorRef
  ) { }

  onTouched: any = () => { };


  testByName() {
    // if (this.ddName === this.testName) {
    // }
  }

  public writeValue(obj: any) {
    console.log(`writeValue*************** start`, this.optionsModel, 'obj', obj);



    this.testByName();


    if (Array.isArray(obj)) {
      this.optionsModel = [];
      obj.forEach((item) => {
        this.optionsModel.push(item['id'] || item)
      });
      this.optionsModel = Array.from(this.optionsModel)
      this.doOnDropDownChange(this.optionsModel);
    } else {
      if (!obj) {
        this.optionsModel = [];
      }
    }
    this.cdr.detectChanges();

    // console.log(`writeValue*************** End`, this.optionsModel, 'obj', obj);
  }

  public registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  public validate(c: FormControl) {
    const empty = Utils.isEmpty(this.optionsModel);
    if (empty && this.isrequired && !this.isDisabled) {
      return {
        empty: {
          valid: !empty
        }
      }
    } else {
      return null;
    }
  }

  public registerOnTouched() { }

  public onChange(event) {

    if (this.optionsModel) {

      if (this.ddOptions.isDownloadable) {
        this.download();
      } else {
        this.propagateChange(this.optionsModel);
        this.doOnDropDownChange(this.optionsModel);
      }

    }
  }

  private propagateChange = (_: any) => {
  };


  ngOnChanges(a) {
    console.log(a)
  }

  ngOnInit() {
    this.errorChecking();
    this.dropDownSetting();
    this.initialDataSetting();
    this.apiTriggerFunc();
  }

  getDropDownData(url?: string, body?: MyBodyI[]) {

    // this.ddOptions.baseComponent.showLoader();
    this.showLoader();
    this.fetchDataSub = this.dataDropDownListService
      .getDropDownData(url || this.ddOptions.serviceURL, body || this.ddOptions.initialParameter)
      .subscribe(data => {

        if (!Array.isArray(data)) {
          data = data['data'];
        }

        this.testByName();
        this.setMyOptions(data);
        this.doOnDropDownChange(this.optionsModel);
        this.hideLoader();
        // this.ddOptions.baseComponent.hideLoader();
      }, err => {
        this.hideLoader();
        //  this.ddOptions.baseComponent.hideLoader();
      });
  }


  waitForEmptyObj(arr) {
    // console.log('waitForEmptyObj', arr);
    this.EmptyObjectObservable = Observable.of(arr);
  }

  WaitForEmptyObj_Over() {
    this.EmptyObjectSubscription = this.EmptyObjectObservable instanceof Observable && this.EmptyObjectObservable
      .take(1)
      .subscribe(data => {

        this.testByName();
        // console.log('WaitForEmptyObj_Over', data)
        this.doOnDropDownChange(data);
      })
  }

  doOnDropDownChange(values: any) {
    const objModel = this.ddOptions.baseComponent.getSearchModel();

    this.testByName();
    // console.log('doOnDropDownChange', objModel, values);
    if (objModel) {
      if (Utils.isEmpty(values)) {
        // console.log('on ISEmpty doOnDropDownChange');
        objModel[this.ddOptions.modelName] = null;
        this.onValueChange.emit(values);
      } else {
        // console.log('on ISnot Empty doOnDropDownChange');
        if (this.dropDownData && this.dropDownData.length > 0) {
          objModel[this.ddOptions.modelName] = [];

          for (const value of values) {
            for (const optionData of this.dropDownData) {
              if (optionData['id'] == value) {
                const obj = {
                  id: optionData['id'],
                  desc: optionData['name'],
                  columnName: this.ddOptions.modelName
                };
                objModel[this.ddOptions.modelName].push(obj);
                this.onValueChange.emit(obj);
                break;
              }
            }
          }
        } else {
          this.waitForEmptyObj(values);
        }
      }
    } else {
      this.onValueChange.emit(values);
    }
    // console.log('Done **************************************', objModel);

  }

  ngOnDestroy() {
    Utils.unsubscribe(this.ddTrigger, this.fetchDataSub, this.apiTrigger);
    this.cdr.detach();
  }


  dropDownSetting() {
    this.myTexts.defaultTitle = this.ddOptions.firstOptionText || 'Select a value';
    if (this.ddOptions.selectMulti) {
      this.mySettings.selectionLimit = 0;
      this.mySettings.autoUnselect = false;
      this.mySettings.showCheckAll = true;
      this.mySettings.showUncheckAll = true;
      this.mySettings.closeOnSelect = false;
    } else {
      this.mySettings.selectionLimit = 1;
      this.mySettings.autoUnselect = true;
      this.mySettings.closeOnSelect = true;
    }
    console.log(this.mySettings)
  }

  setMyOptions(data) {
    this.setSelectAllOption(data.length);
    this.doSorting(data);
    const myCombineFlag = this.ddOptions['combineThem'];
    const combineThemKeyFlag = this.ddOptions['combineTheyKey'];

    if (Array.isArray(data)) {
      this.myOptions = data.map(item => {
        return {
          id: this.setMyOptionsID(item), //  this.ddOptions.addStringToID ? this.ddOptions.addStringToID + item[this.ddOptions.keyName] : item[this.ddOptions.keyName],
          name: this.setMyOptionsName(item)
        }
      });
    }
    this.cdr.detectChanges();
    // this.dropDownData = Array.from(this.myOptions);
    // console.log('setMyOptions end', this.myOptions, data);
  }

  setMyOptionsID(item: any): string {
    if (this.ddOptions.combineThemKey) {
      let combinedValue = '';
      this.ddOptions.combineThemKey.forEach((k) => {

        if (k.type === 'key') {
          combinedValue += item[k.value]
        } else if (k.type === 'plain') {
          combinedValue += k.value
        }
      });

      if (this.ddOptions.addStringToID) {
        return this.ddOptions.addStringToID + item[this.ddOptions.keyName] + combinedValue;
      }
      return combinedValue;
    } else {

      if (this.ddOptions.keyName === 'complete') {
        return item;
      }
    }
    return item[this.ddOptions.keyName];
  }

  setMyOptionsName(item: any): string {

    const myCombineFlag = this.ddOptions['combineThem'];

    if (myCombineFlag) {
      return `${item[myCombineFlag[0]]} - ${item[myCombineFlag[1]]}`
    } else if (this.ddOptions.combineThemName) {
      let combinedValue = '';
      this.ddOptions.combineThemName.forEach((k) => {

        if (k.type === 'key') {
          combinedValue += item[k.value]
        } else if (k.type === 'plain') {
          combinedValue += k.value
        }
      });
      return combinedValue;
    }

    return item[this.ddOptions.keyDesc];
  }

  errorChecking() {
    if (!this.ddOptions.keyName) {
      throw new Error('Drop Down must have a "Key Name" attribute.');
    }
    if (!this.ddOptions.keyDesc) {
      throw new Error('Drop Down must have a "Key Description" attribute.');
    }
    if (!this.ddOptions.baseComponent) {
      throw new Error('Drop Down must have a "Base Component" attribute.');
    } else if (!this.ddOptions.baseComponent.getSearchModel()) {
      console.warn('Model object missing, will impact display functionality (', this.ddOptions.modelName, ')');
    }
  }

  initialDataSetting() {
    if (this.ddTrigger) {
      this.ddTrigger.subscribe(data => {
        this.setMyOptions(data);
        // console.log('________________________ddTrigger', data, this.optionsModel);
        this.WaitForEmptyObj_Over();
      });
    }
    if (!this.isDisabled) {
      if (this.ddTrigger) {

      } else {

        // console.log('____________________Else____ddTrigger');
        if (!this.ddOptions.fetchDataOnClick) {
          this.getDropDownData();
        }
      }
    } else {
      //  this.ddOptions.baseComponent.hideLoader();
    }
  }


  doSorting(data: Array<any>) {
    if (this.ddOptions.sort) {
      const sortKey = this.ddOptions.sortKey || this.ddOptions.keyDesc;
      const sortOrder = this.ddOptions.sortOrder || 'asc';
      Utils.sorting(data, sortKey, sortOrder);
    }
  }

  download() {
    Utils.isNotEmpty(this.optionsModel[0])
      .then(() => {
        ProjectUtils.downloadGET(this.optionsModel[0]);
      })
      .catch(() => {
        console.log('No download Link');
      })

  }


  apiTriggerFunc() {

    if (this.apiTrigger instanceof Subject) {
      this.apiTrigger.subscribe((data: ApiTriggerI) => {
        console.log('ApiTriggerI', data)
        const { url, body } = data;
        this.ddOptions.serviceURL = url || this.ddOptions.serviceURL;
        this.ddOptions.initialParameter = body || this.ddOptions.initialParameter;

        if (!this.ddOptions.fetchDataOnClick) {
          this.getDropDownData();
        } else {
          this.myOptions = [];
          this.fetchDataOnClickFlag = true;
        }
      })

    }
  }

  onClick() {
    if (this.ddOptions.fetchDataOnClick && this.fetchDataOnClickFlag) {
      this.getDropDownData();
      this.fetchDataOnClickFlag = false;
    }
  }


  showLoader() {
    if (this.ddOptions.ownLoader) {
      this.ownLoader = true;
    } else {
      // this.ddOptions.baseComponent.showLoader();
    }
  }

  hideLoader() {
    if (this.ddOptions.ownLoader) {
      this.ownLoader = false;
    } else {
      // this.ddOptions.baseComponent.hideLoader();
    }
  }

  setSelectAllOption(len: number) {
    // if (len < 3) {
    //   this.mySettings.displayAllSelectedText = false;
    //   this.mySettings = Object.assign({}, this.mySettings);
    // }
  }

}
