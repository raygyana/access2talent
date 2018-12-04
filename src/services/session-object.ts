import { UserDetails } from './user-detail';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
// import { SavedSearchModel } from '../../components/search-header/saved-search.model';
// import { GlobalSettings } from './global-settings';
import { Session } from 'selenium-webdriver';


export class SessionObject {

    static get liveYear(): any {
        return localStorage.getItem('liveYear');
    }

    static set liveYear(val: any) {
        localStorage.setItem('liveYear', val);
    }

    static get liveMonth(): any {
        return localStorage.getItem('liveMonth');
    }

    static set liveMonth(val: any) {
        localStorage.setItem('liveMonth', val);
    }

    static month: string[] = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    userAccess: 'admin';
    activeCurrentUser: UserDetails;
    allCurrentUser: UserDetails[];
    currentClientCode: string;
    currentClientLoginUrl: string;
    liveYear: number;
    currentClientDashBoard: string;
    arrayWebmartCode: string[];
    liveMonthChange: Subject<number> = new Subject<number>();
    manageUsersReportsSearch: any;

    clientID = 'admin';
    clientSettings: any;
    limit = '1000';
    // savedSearches: SavedSearchModel[] = [];
    savedSearchesChange = new Subject<any>();
    // Common
    userType: 'admin' | 'user';
    public static getSessionObject(): SessionObject {
        return JSON.parse(localStorage.getItem('sessionObject'));
    }

    public static setSessionObject(sessionObject: SessionObject) {
        localStorage.setItem('sessionObject', JSON.stringify(sessionObject));
    }

    public static removeSessionObject() {
        localStorage.removeItem('sessionObject');
    }

    public static getMonthStr(iMonth: number): string {
        return this.month[iMonth];
    }

    public static getCurrentMonthStr(): string {
        console.log(this.liveMonth);
        return SessionObject.month[this.liveMonth];
    }


    public static getPreMonthStr(): string {
        console.log(this.liveMonth);
        if (this.liveMonth === 1) {
            return SessionObject.month[12];
        }
        return SessionObject.month[this.liveMonth - 1];
    }


    constructor() {
        // this.clientSettings = GlobalSettings.UI_SETTING;
        // this.limit = '1000';
        // this.userType = null;
        // this.manageUsersReportsSearch;
    }

    changeLiveMonth(newLiveMonth: number) {
        SessionObject.liveMonth = newLiveMonth;
        this.liveMonthChange.next(SessionObject.liveMonth);
    }


}

