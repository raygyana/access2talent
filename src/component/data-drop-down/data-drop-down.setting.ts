import { IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';
import { BaseComponent } from '../../services/base';


export const mySettings: IMultiSelectSettings = {
      enableSearch: true,
      checkedStyle: 'fontawesome',
      buttonClasses: 'btn btn-default btn-block',
      dynamicTitleMaxItems: 3,
      displayAllSelectedText: false,
      containerClasses: 'containerDiv',
      itemClasses: 'itemClassMultiSelect'
};


export const myTexts: IMultiSelectTexts = {
      checkAll: 'Select all',
      uncheckAll: 'Unselect all',
      checked: 'item selected',
      checkedPlural: 'items selected',
      searchPlaceholder: 'Find',
      searchEmptyResult: 'Result Not Found.',
      searchNoRenderText: 'Type in search box to see results...',
      defaultTitle: 'Select...........',
      allSelected: 'All selected',
};

export const myOptions = [
];


export class DataDropDownOptions {
      serviceURL?: string;
      keyName?: string;
      keyDesc?: string;
      firstOptionText?: string;
      firstOptionValue?: string;
      modelName?: string;
      baseComponent: BaseComponent;
      multipleState = false;
      sizeCount = 0;
}

