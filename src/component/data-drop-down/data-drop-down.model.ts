import { BaseComponent } from '../../services/base/base.component';
import { Subject } from 'rxjs/Subject';
import { MyBodyI } from './data-drop-down.service';

export interface CombineThemKey {
    type: 'key' | 'plain';
    value: string;
}

export class DataDropDownOptions {
    serviceURL?: string;
    keyName?: 'complete' | string;
    keyDesc?: string;
    firstOptionText?: string;
    firstOptionValue?: string;
    modelName?: string;
    baseComponent: BaseComponent;
    multipleState = false;
    sizeCount = 0;
    selectMulti = false;
    combineThemName?: Array<CombineThemKey>;
    combineThemKey?: Array<CombineThemKey>;
    combineThem?: Array<string>;
    sort?: boolean;
    sortKey?: string;
    sortOrder?: 'asc' | 'dsc' = 'asc';
    isDownloadable?: boolean;
    initialParameter: Array<MyBodyI>;
    fetchDataOnClick = false;
    ownLoader = false;
    addStringToID = '';
}
