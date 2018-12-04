import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// import 'rxjs/add/operator/catch';
// import 'rxjs/add/operator/do';
// import 'rxjs/add/operator/finally';
// import 'rxjs/add/operator/timeout';
import { HttpClient, HttpHandler, HttpHeaders } from '@angular/common/http';
// import { LoaderService } from './loader/loader.service';
// import { Logger as Loggerr } from '../core/logger/logger';

@Injectable()
export class HttpService /*extends HttpClient*/ {

    // log = Log.create('HttpService');

    constructor(
        private http: HttpClient,
        // private loaderService: LoaderService,
        // private timeOutService: TimeOutService,
        // private logger: Loggerr
    ) {

        // super(handler);
        //        super(backend, defaultOptions);
        //   console.log('http service');
        // this.log.color = 'lightblue';
    }



    private onCatch(error: any, caught: Observable<any>): Observable<any> {
        console.log('Catch, error: ', error);
        return Observable.throw(error);
    }

    private onSuccess(res: Response): void {
        //    console.log('Request successful');
    }

    private onError(res: Response): void {
        console.log('Error, status code: ' + res.status);
    }

    private onEnd(): void {
        this.hideLoader();
    }

    private showLoader(): void {
        //    console.log('called showLoader');
        //    this.loaderService.show();
    }

    private hideLoader(): void {
        //    console.log('called hideLoader');
        //    this.loaderService.hide();
    }

    private getHTTPOption(tokenId: any): any {
        const httpOptions = {
            headers: new HttpHeaders(
                {
                    // 'authorization': 'Basic aW5zaWdodHNlcnZpY2U6TXBzSW5zaWdodA==',
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            )
        };
        if (tokenId) {
            httpOptions.headers = httpOptions.headers.set('token', tokenId);
        }
        return httpOptions;
    }

}
