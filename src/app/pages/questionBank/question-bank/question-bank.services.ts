import { Injectable } from '@angular/core';
import { Constants } from '../../../../services/constant';
import { BaseService } from '../../../../services/base/base.service';

@Injectable()
export class QuestionBankService extends BaseService {
      getServiceURL(): string {
            return 'IN_COUNTER5_DYNAMIC_PREVIEW_REPORT_DETAILS_URL';

      }

      onSave(reportID) {
            let body = '';
            return this.getDataWithURL(Constants.SUBMIT_URL, body);
      }

      callCategories() {
            let body = '';
            return this.getDataWithURL(Constants.CATEGORIES_URL, body);
      }

      dropDownData() {
            let body = '';
            return this.getDataWithURL('', body);
      }

      submitQueAns(ques_subj_id, ques_desc, ques_opt1, ques_opt2, ques_opt3, ques_opt4, ques_type_id, ques_ans, ques_image, ques_complexity, ques_hint) {
            let body = '';
            body += this.setParamValue(body, 'ques_subj_id', ques_subj_id);
            body += this.setParamValue(body, 'ques_desc', ques_desc);
            body += this.setParamValue(body, 'ques_opt1', ques_opt1);
            body += this.setParamValue(body, 'ques_opt2', ques_opt2);
            body += this.setParamValue(body, 'ques_opt3', ques_opt3);
            body += this.setParamValue(body, 'ques_opt4', ques_opt4);
            body += this.setParamValue(body, 'ques_type_id', ques_type_id);
            body += this.setParamValue(body, 'ques_ans', ques_ans);
            body += this.setParamValue(body, 'ques_image', ques_image);
            body += this.setParamValue(body, 'ques_complexity', ques_complexity);
            body += this.setParamValue(body, 'ques_hint', ques_hint);

            return this.getDataWithURL(Constants.SUBMIT_QUES_ANS_URL, body);
      }
}
