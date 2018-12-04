import { isDevMode } from '@angular/core';
// import { constants } from 'os';

export class Constants {

    // Insight and THINK Dev
    public static QUESTIONBANK_SERVER_URL = 'http://api.access2talent.com/a2t-0/';
    // Insight and THINKProd
    // public static INSIGHT_SERVER_URL = 'https://insight.mps-think.com/';
    // public static THINK_SERVER_URL = 'https://api.mps-think.com/';

    // public static THINK_DOWNLOAD_URL = 'https://api.mps-think.com/Compass-API/';
    public static THINK_BASE_URL = Constants.QUESTIONBANK_SERVER_URL + 'a2t/';
    public static DROPDOWN_URL = Constants.THINK_BASE_URL + 'dropdown';
    public static SUBMIT_URL = Constants.QUESTIONBANK_SERVER_URL + 'getSubject';
    public static CATEGORIES_URL = Constants.QUESTIONBANK_SERVER_URL + 'getCategories';
    public static IN_GET_All_ROLE_URL = Constants.THINK_BASE_URL +
        'manageuser/getallroles';
    public static SUBMIT_QUES_ANS_URL = Constants.QUESTIONBANK_SERVER_URL + 'submitQueAns';



    // public static getInsightAPIURL() {
    //     if (isDevMode()) {
    //         return 'https://alpha.mpsinsight.com/';
    //     } else {
    //         return 'https://insight.mps-think.com/';
    //     }
    // }

    // public static getThinkAPIURL() {
    //     if (isDevMode()) {
    //         return 'https://alpha.mpsinsight.com/';
    //     } else {
    //         return 'https://api.mps-think.com/';
    //     }
    // }
}
