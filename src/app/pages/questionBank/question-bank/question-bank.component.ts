import { Component, OnInit, OnChanges, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../../services/base';
import { Router } from '@angular/router';
// import { AuthenticationService } from 'app/login/authentication.service';
// import { Logger } from '../../../core/logger/logger';
// import { GlobalService } from '../../shared/global.service';
// import { ChangeService } from '../../shared/change-service';
// import { SaveSearchService } from '../../shared/save-search-service';
// import { DataTableDirective } from 'angular-datatables';
import { ProjectUtils } from '../../../../services/project-utils';
import { DataDropDownOptions } from '../../../../component/data-drop-down';
// import { ListDisplaySearchComponent } from '../../../../components/list-display-search/list-display-search.component';
import { QuestionBankService } from './question-bank.services';
import { QuestionBankModel } from './question-bank.model';
import { Subject } from 'rxjs';
// import { timingSafeEqual } from 'crypto';
import { Constants } from '../../../../services/constant';

@Component({
  selector: 'app-question-bank',
  templateUrl: './question-bank.component.html',
  styleUrls: ['./question-bank.component.css'],
  providers: [QuestionBankService]
})
export class QuestionBankComponent extends BaseComponent {
  QUESTION_BANK = 'QUESTION_BANK';
  response: any;
  fetchData: any;
  getCategories: any;
  result: Array<any>;
  resultData: any;
  fetchDataSub: any;

  ngcategories: any;
  ngsubjects: any;
  ngquesTypes: any;

  questionBankModel: QuestionBankModel;
  isShow: boolean = false;
  isShortAns: boolean = false;
  isParagraph: boolean = false;

  isMultiChoice: boolean = false;
  isTrueFalse: boolean = false;
  isMatching: boolean = false;
  showOneMore: boolean = false;
  isInstruction: boolean = false;
  isFillBlanks: boolean = false;
  qHeading = "Question Text";
  ddOptionsCategories: DataDropDownOptions;
  ddOptionsSubjects: DataDropDownOptions;
  ddOptionsQTypes: DataDropDownOptions;
  ddTriggerDataType: Subject<any> = new Subject();
  ddTriggerCategories: Subject<any> = new Subject();
  ddTriggerSubjects: Subject<any> = new Subject();
  ddTriggerQTypes: Subject<any> = new Subject();
  // @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  // @ViewChild(ListDisplaySearchComponent) dispSearch: ListDisplaySearchComponent;

  addMultipleOptions = [
    { "inputValue": "Type your Option 1", "optionType": "YES", "buttonClass": "text-success", "iconClass": "fa-check", "value": "ques_opt1" },
    { "inputValue": "Type your Option 2", "optionType": "NO", "buttonClass": "text-danger", "iconClass": "fa-close", "value": "ques_opt2" },
    { "inputValue": "Type your Option 3", "optionType": "NO", "buttonClass": "text-danger", "iconClass": "fa-close", "value": "ques_opt3" },
    { "inputValue": "Type your Option 4", "optionType": "NO", "buttonClass": "text-danger", "iconClass": "fa-close", "value": "ques_opt4" },
  ]

  dropDownData: { "data": [{ "display_name": "Institution", "account_type": "Institution" }, { "display_name": "Consortia", "account_type": "Consortia" }] };

  constructor(
    protected router: Router,
    // protected _authenticationService: AuthenticationService,
    protected questionBankService: QuestionBankService,
    // protected timeOutService: TimeOutService
  ) {
    super();
    //  this.onSave();
    this.doInitialSetup();
    // this.getDropDownData(this.dropDownData);
    this.doOnQuestType(1);
  }

  OnInit() {
    this.onloadDropDown();
  }

  doInitialSetup() {
    this.ddOptionsCategories = new DataDropDownOptions();
    this.ddOptionsCategories.serviceURL = Constants.CATEGORIES_URL;
    this.ddOptionsCategories.keyName = 'key';
    this.ddOptionsCategories.keyDesc = 'description';
    this.ddOptionsCategories.combineThem = ['key', ('description')];
    this.ddOptionsCategories.firstOptionText = 'Select a category';
    this.ddOptionsCategories.baseComponent = this;
    this.ddOptionsCategories.modelName = 'categories';

    this.ddOptionsSubjects = new DataDropDownOptions();
    this.ddOptionsSubjects.keyName = 'key';
    this.ddOptionsSubjects.keyDesc = 'description';
    this.ddOptionsSubjects.combineThem = ['key', ('description')];
    this.ddOptionsSubjects.firstOptionText = 'Select a subject';
    this.ddOptionsSubjects.baseComponent = this;
    this.ddOptionsSubjects.modelName = 'subjects';

    this.ddOptionsQTypes = new DataDropDownOptions();
    this.ddOptionsQTypes.keyName = 'key';
    this.ddOptionsQTypes.keyDesc = 'description';
    this.ddOptionsQTypes.combineThem = ['key', ('description')];
    this.ddOptionsQTypes.firstOptionText = 'Select a Question Type';
    this.ddOptionsQTypes.baseComponent = this;
    this.ddOptionsQTypes.modelName = 'ques_types';

  }

  getDropDownData(dropDownData) {

  }

  doOnQuestType(questionType) {
    questionType = questionType.id;
    this.qHeading = (questionType == 7) ? "Instruction Details" : "Question Text";
    // console.log(event, questionType, 'EVENT_SELECT');
    this.isShortAns = (questionType == 1);
    this.isParagraph = (questionType == 2);
    //this.isMultiChoice = (questionType` == 3);
    this.isTrueFalse = (questionType == 6);
    this.isInstruction = (questionType == 7);
    this.isMatching = (questionType == 8);
    this.isFillBlanks = (questionType == 10);
    this.isMultiChoice = (questionType > 2 && questionType < 6);
  }

  // override
  // getDispSearch(): ListDisplaySearchComponent {
  //   return this.dispSearch;
  // }

  // override
  getSearchType(): string {
    return 'manageUsersSearch';
  }
  getServiceName(): string {
    return this.QUESTION_BANK;
  }

  onloadDropDown() {
    this.getCategories = this.questionBankService.callCategories()
      .subscribe(data => {
        const result = data;
        const Categories = result['categories'];
        const Subjects = result['subjects'];
        const Ques_Type = result['ques_types'];
        this.ddTriggerCategories.next(Categories);
        this.ddTriggerSubjects.next(Subjects);
        this.ddTriggerQTypes.next(Ques_Type);
      }, err => {

      });
  }

  onSave() {
    // this.showLoader();
    // this.fetchDataSub = this.questionBankService.onSave('A')
    //   .subscribe(data => {
    //     console.log('datails_Data ', data);
    //     this.isShow = true;
    //     this.resultData = data;
    // this.resultData.forEach(element => {
    // });
    // this.resultData.
    //   forEach(element => {
    //     element['status'] = `< a href = "javascript:;" style = "font-size:16px;" > <i class="fa fa-edit" > </i> |
    //     <i class="fa fa-trash"></i></a>` ;
    //   });
    // this.setListData(this.QUESTION_BANK, this.resultData);
    //   this.hideLoader();
    // }, err => {
    // this.setListData(this.QUESTION_BANK, []);
    //   console.log('data is ', 'empty');
    // });
  }

  // override
  getSearchModel(): any {
    if (ProjectUtils.isEmpty(this.questionBankModel)) {
      if (ProjectUtils.isEmpty(this.questionBankModel)) {
        this.questionBankModel = new QuestionBankModel();
      }
      this.ngcategories = this.questionBankModel.categories;
      this.ngsubjects = this.questionBankModel.subjects;
      this.ngquesTypes = this.questionBankModel.ques_types;
    }
    return this.questionBankModel;
  }

  // override
  setSearchModel(searchModel: any) {
    if (!ProjectUtils.isEmpty(searchModel)) {
      if (typeof searchModel === 'string') {
        this.questionBankModel = JSON.parse(searchModel);
      } else {
        this.questionBankModel = searchModel;
      }
      this.ngcategories = this.setDropDownComponentValue('categories');
      this.ngsubjects = this.setDropDownComponentValue('subjects');
      this.ngquesTypes = this.setDropDownComponentValue('ques_types');

    }
    // ProjectUtils.setDynamicUsageReportsSearch(this.sessionObject, this.manageUsersSearchModel);
  }

  getLoaderName(): string {
    return 'questionBank';
  }

  onchange() {

  }

  OnAddMoreChoice() {
    this.addMultipleOptions.push({ "inputValue": "Type your Option ", "optionType": "NO", "buttonClass": "text-danger", "iconClass": "fa-close", "value": "ques_opt" });
  }

  doOnValueChange(event) {
  }

  submitQueAns() {
    const ques_category_id = this.questionBankModel.categories[0].id;
    const ques_subj_id = this.questionBankModel.subjects[0].id;
    const ques_desc = this.questionBankModel.ques_desc;
    const ques_opt1 = this.questionBankModel.ques_opt1;
    const ques_opt2 = this.questionBankModel.ques_opt2;
    const ques_opt3 = this.questionBankModel.ques_opt3;
    const ques_opt4 = this.questionBankModel.ques_opt4;
    const ques_type_id = this.questionBankModel.ques_types[0].id;
    const ques_ans = this.questionBankModel.ques_ans;
    const ques_image = this.questionBankModel.ques_image;
    const ques_complexity = this.questionBankModel.ques_complexity;
    const ques_hint = this.questionBankModel.ques_hint;
    this.fetchData = this.questionBankService
      .submitQueAns(ques_subj_id, ques_desc, ques_opt1, ques_opt2, ques_opt3, ques_opt4, ques_type_id, ques_ans, ques_image, ques_complexity, ques_hint)
      .subscribe(data => {
        this.response = data;
        // this.hideLoader();
      }, err => {
        // this.hideLoader();
      });
  }


}


















