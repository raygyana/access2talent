import { Headers } from '@angular/http';
import { DatePipe } from '@angular/common';
import { SessionObject } from './session-object';
import { DecimalPipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs';
import { Observer } from 'rxjs';
// import 'rxjs/add/operator/take';
import { parse } from 'querystring';


interface ArrDivideInSubArrayI {
    singleObj: any;
    dataToShow: Array<any>;
}

export interface SumManupilation {
    key: string;
    display: string,
    sum: boolean;
    sortPriority: number;
    keysToSum?: Array<string>
}

export interface SumManupilations {
    row: Array<SumManupilation>;
}

export interface IndexOrderI {
    key: string;
    sortPriority: number;
    toSum: Array<string>;
}

export interface SplitArrayOutPut {
    splitArrays: Array<any>;
    splitKeys: Array<any>;
}

// const obj = {    customer_id    :    "8425116"
//     last_four_number    :    "3191"
//     name    :    "THOMAS,BURTON"
//     order_code    :   "OCTO"
//     order_date    :   "11/17/2017"
//     order_id    :   "16093755"
//     pay_currency_amount    :   "-36.0000"
//     payment_date    :   "11/20/2017"
//     payment_type    :   "MC"
//     qty    :   "1"
//     tax    :   "0.0000"
// }

export class Utils {

    public static formatDateDataWithDefault(startDate: any): string {
        return Utils.formatDateData(startDate, 'MMM dd, yyyy');
    }

    public static formatDateData(startDate: any, dateFormat: string): string {
        const datePipe: DatePipe = new DatePipe('en-US');
        return datePipe.transform(new Date(startDate), dateFormat);
    }

    public static OldisEmpty(val: any): boolean {
        return !val || (Array.isArray(val) && !val[0]) || !Object.keys(val).length;
    }

    public static isEmptyNumStr(val) {
        if (typeof val === 'number') {
            return false;
        } else if ((typeof val === 'string')) {
            return !val;
        } else if (val === null) {
            return true;
        } else if (val === undefined) {
            return true;
        }
        return false;
    }

    public static isEmpty(val: any): boolean {
        if (Array.isArray(val)) {
            return this.isEmptyNumStr(val[0]);
        } else if (typeof val === 'object' && val !== null) {
            // console.log('object');
            const obj = Object.keys(val);
            for (let i = 0; i < obj.length; i++) {
                // console.log(val[obj[i]], 'aaaa ', this.isEmptyNumStr(val[obj[i]]))
                if (!this.isEmptyNumStr(val[obj[i]])) {
                    return false;
                }
            }
            return true;
        }
        return this.isEmptyNumStr(val);
    }


    public static numberFormat(item) {

        item = parseFloat(item);
        if (isNaN(item)) {
            return '00';
        } else {
            const addK = (item >= 1000) ? 'k' : '';
            item = (item > 1000) ? (item / 1000) : item;
            item = new DecimalPipe('en-US').transform(item, '1.0-0');
            item += addK;
            return item;
        }

    }

    public static numberFormatWithOutK(item) {
        const num = parseFloat(item);
        if (isNaN(num)) {
            return '00';
        } else {
            item = (item > 100000000000) ? (item / 1000) : item;
            item = new DecimalPipe('en-US').transform(item, '1.0-0');
            return item;
        }
    }



    public static isNotEmpty(val: any): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.isEmpty(val)) {
                reject()
            } else {
                resolve()
            }
        });


    }

    public static cloneObject(obj: any): any {
        return JSON.parse(JSON.stringify(obj))
    }

    public static cloneArray(source: any): any {
        return source.map(x => Object.assign({}, x));
    }


    public static getIds(obj: any): any {
        let objectIds: any;
        if (!Utils.isEmpty(obj)) {
            if (Array.isArray(obj)) {
                for (const value of obj) {
                    console.log(value);
                    if (!Utils.isEmpty(objectIds)) {
                        objectIds += ',' + value.id;
                    } else {
                        objectIds = value.id;
                    }
                }
            } else {
                objectIds = obj.id;
            }
        }
        return objectIds;
    }

    public static getIdAsArray(obj: any): any[] {
        const objectIds = [];
        if (!Utils.isEmpty(obj)) {
            if (Array.isArray(obj)) {
                for (const value of obj) {
                    console.log(value);
                    objectIds.push(value.id);
                }
            } else {
                objectIds.push(obj.id);
            }
        }
        console.log('objectIds', objectIds);
        return objectIds;
    }


    public static toUpperIfString(value: any) {
        const isString = typeof value === 'string' ? true : false;
        return isString ? value.toUpperCase() : value;
    }

    public static toBoldHtml(val: string) {
        if (!this.isEmpty(val)) {

            if (typeof val === 'number') {
                return `<div class="dt-bold font-weight-bold"  >${val}</div>`;
            } else {
                return `<div class="dt-bold font-weight-bold textAlignRight"  >${val}</div>`;
            }
        }
        return '';
    }




    public static toFixedIfNumberRev(value: any) {
        let ret: string | number = parseInt(value, 10);
        if (isNaN(ret)) {
            ret = value.split('/')[0].split('>')[1];
            ret = Utils.toBoldHtml(parseInt(<string>ret, 10) + '')
        }
        return ret || '';
    }

    public static toFixedIfNumber(value: any) {
        const isNumber = typeof value === 'number';
        const ret = isNumber ? value.toFixed(2) : value;
        return ret;
    }

    public static mySumFunction(data: Array<any>, keys: Array<string>, sort: string, strDisplayWithSort: string) {
        const isEmpty = this.isEmpty(data);


        if (!isEmpty) {
            data.sort((a, b) => {

                const nameA = this.toUpperIfString(a[sort]);
                const nameB = this.toUpperIfString(b[sort]);
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }

                return 0;

            });

            const indexes = [];

            let last = data[0][sort];
            let count = 0;
            data.forEach(item => {
                if (last === item[sort]) {
                    count++;
                } else {
                    indexes.push(count);
                    count = 1;
                }
                last = item[sort];
            })

            indexes.push(count);


            const data2 = Array.from(data);
            const firstObj = Object.assign({}, data2[0]);
            Object.keys(firstObj).forEach(k => {
                firstObj[k] = ''
            });

            let indexCount = 0;
            indexes.forEach(item => {
                const sum = {};

                keys.forEach(item2 => {
                    sum[item2] = 0;
                })

                for (let i = indexCount; i < indexCount + item; i++) {
                    keys.forEach(item3 => {
                        sum[item3] += parseFloat(data2[i][item3])
                    })
                }

                sum[sort] = strDisplayWithSort + ' ' + data2[indexCount][sort];
                indexCount += item;

                Object.keys(sum)
                    .forEach((k2) => {
                        sum[k2] = this.toBoldHtml(this.toFixedIfNumber(sum[k2]));
                    });

                const sumObj = Object.assign({}, firstObj, sum);

                data2.splice(indexCount, 0, sumObj)
                indexCount += 1;

                //    this.Data2 = data2;
            })

            console.log('data2 ', data2);
            return data2;
        } else {
            return [];
        }
    }

    public static assignNewCopy(obj: any) {
        return Object.assign({}, obj);
    }


    public static splitArray(data: Array<any>, key: string, ): SplitArrayOutPut {

        const myOutput = [];
        const splitKeys = [];
        let lastKeyValue = null;
        this.sorting(data, key, 'dsc');

        data.forEach((item) => {
            if (lastKeyValue !== item[key]) {
                lastKeyValue = item[key];
                splitKeys.push(item[key])
                myOutput[lastKeyValue] = [];
                myOutput[lastKeyValue].push(this.assignNewCopy(item));
            } else {
                myOutput[lastKeyValue].push(this.assignNewCopy(item));
            }
        });

        console.log('splitArray', myOutput, splitKeys)
        return {
            splitArrays: myOutput,
            splitKeys: splitKeys
        }
    }

    public static deletePropertyFromObject(obj: any, ...keys: Array<string>) {
        keys.forEach((key) => {
            delete obj[key];
        })
    }

    public static deletePropertyFromArray(arr: Array<any>, ...keys: Array<string>): Array<any> {
        if (!arr) {
            return [];
        }
        arr.forEach((item) => {
            this.deletePropertyFromObject(item, ...keys)
        });
        return Array.from(arr);
    }


    public static sorting(data: Array<any>, sort: string, dsc: 'asc' | 'dsc') {
        console.log('before sortArray ', data, sort, dsc);

        const mySortFunction = (() => {
            if (dsc === 'dsc') {
                return () => {
                    data.sort((a, b) => {
                        const nameA = this.toUpperIfString(a[sort]);
                        const nameB = this.toUpperIfString(b[sort]);

                        if (nameA < nameB) {
                            return 1;
                        }
                        if (nameA > nameB) {
                            return -1;
                        }
                        return 0;
                    });
                }
            } else {
                return () => {
                    data.sort((a, b) => {
                        const nameA = this.toUpperIfString(parseFloat(a[sort]));
                        const nameB = this.toUpperIfString(parseFloat(b[sort]));

                        if (nameA < nameB) {
                            return -1;
                        }
                        if (nameA > nameB) {
                            return 1;
                        }
                        return 0;
                    });
                }
            }

        })();
        mySortFunction();
        console.log('sorting', data)
    }



    public static sortingAlpha(data: Array<any>, sort: string, dsc: 'asc' | 'dsc') {
        console.log('before sortArray ', data, sort, dsc);

        const mySortFunction = (() => {
            if (dsc === 'dsc') {
                return () => {
                    data.sort((a, b) => {
                        const nameA = this.toUpperIfString(a[sort]);
                        const nameB = this.toUpperIfString(b[sort]);

                        if (nameA < nameB) {
                            return 1;
                        }
                        if (nameA > nameB) {
                            return -1;
                        }
                        return 0;
                    });
                }
            } else {
                return () => {
                    data.sort((a, b) => {
                        const nameA = this.toUpperIfString((a[sort]));
                        const nameB = this.toUpperIfString((b[sort]));

                        if (nameA < nameB) {
                            return -1;
                        }
                        if (nameA > nameB) {
                            return 1;
                        }
                        return 0;
                    });
                }
            }

        })();
        mySortFunction();
        console.log('sorting', data)
    }




    public static sortArray(data: Array<any>, sort: string) {
        console.log('before sortArray ', data)
        data.sort((a, b) => {
            const nameA = this.toUpperIfString(a[sort]);
            const nameB = this.toUpperIfString(b[sort]);
            if (b['ignore']) {
                return 0;
            }

            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }
            return 0;
        });
    }


    // : Array< Array<IndexOrderI>>

    public static getSortOrder(keys: Array<SumManupilations>): Array<IndexOrderI> {
        const mySortOrder = [];
        keys.forEach((item) => {
            item.row.forEach((item2) => {
                mySortOrder.push({
                    key: item2.key,
                    sortPriority: item2.sortPriority,
                    toSum: item2.keysToSum
                });
            });
        });

        return mySortOrder;
    }



    public static findFirstIngore(element) {
        return element['ignore'] === true;
    }

    public static sortMultiPleArray(data: Array<any>, keys: Array<SumManupilations>) {

        const mySortOrder = this.getSortOrder(keys);
        console.log('mySortOrder', mySortOrder);

        let currentTotalInArray = Array.from(data);
        let ignoreIndex = currentTotalInArray.length;

        mySortOrder.forEach((item) => {


            let previousIgnoreIndex = 0;
            let operatableData = currentTotalInArray;
            console.log('currentTotalInArray', currentTotalInArray)
            if (ignoreIndex === -1) {
                ignoreIndex = operatableData.findIndex(this.findFirstIngore);
                operatableData = currentTotalInArray.slice(previousIgnoreIndex, ignoreIndex);
            }
            let OutData = [];
            let enter = true;
            while ((ignoreIndex !== -1)) {

                enter = false
                console.log('operatableData', operatableData);
                this.sortArray(operatableData, item.key);
                console.log('sortArray', operatableData);


                const currentIndexOrder = this.indexOrder(operatableData, item.key);
                console.log('currentIndexOrder', currentIndexOrder);

                OutData = OutData.concat(this.sumSortedArray(operatableData, currentIndexOrder, item));
                console.log('sumSortedArray', OutData);

                previousIgnoreIndex = ignoreIndex;
                console.log(previousIgnoreIndex, currentTotalInArray.length)
                ignoreIndex = currentTotalInArray.slice(previousIgnoreIndex + 1, currentTotalInArray.length).findIndex(this.findFirstIngore);
                console.log('ignoreIndex', ignoreIndex);
                if (ignoreIndex !== -1) {
                    operatableData = currentTotalInArray.slice(previousIgnoreIndex + 1, previousIgnoreIndex + ignoreIndex + 1);
                    console.log('new operatableData', operatableData);
                    ignoreIndex = ignoreIndex === 0 ? -1 : ignoreIndex;
                } else {
                    console.log('no new operatableData')
                }
            }


            currentTotalInArray = OutData;
            console.log('currentTotalInArray after While', currentTotalInArray)
        })


    }


    public static emptyMyObjectWithNewRef(obj: any): any {
        obj = Object.assign({}, obj);
        Object.keys(obj).forEach(k => {
            obj[k] = ''
        });
        return obj;
    }


    public static emptyMyObjectWithZeros(obj: any): any {
        obj = Object.assign({}, obj);
        Object.keys(obj).forEach(k => {
            obj[k] = 0
        });
        return obj;
    }



    public static indexOrder(data: any, sortKey: string) {
        const indexes = [];
        let last = data[0][sortKey];
        let count = 0;
        data.forEach(item => {
            if (last === item[sortKey]) {
                count++;
            } else {
                indexes.push(count);
                count = 1;
            }
            last = item[sortKey];
        });

        indexes.push(count);
        return Array.from(indexes);
    }

    public static indexesOrder(data: any, sortOrder: Array<any>) {
        const myIndexesOrder = []
        sortOrder.forEach((item, index) => {
            myIndexesOrder.push(this.indexOrder(data, item.key));
            this.sumSortedArray(data, myIndexesOrder[index], item.key);
        });

        console.log('myIndexesOrder', myIndexesOrder);
        return myIndexesOrder;
    }


    public static sumSortedArray(data: Array<any>, indexes: Array<any>, key: IndexOrderI) {
        const SUM = this.emptyMyObjectWithZeros(data[0]);
        const sumArray = Array.from(data);
        let indexCount = 0;
        // console.log('indexes', indexes);

        indexes.forEach(item => {
            const sum = Object.assign({}, SUM);

            for (let i = indexCount; i < indexCount + item; i++) {

                if (!sumArray[i]['ignore']) {
                    key.toSum.forEach(element => {
                        sum[element] += parseFloat(sumArray[i][element])
                    });
                }

            }
            indexCount += item;

            sum['ignore'] = true;
            sumArray.splice(indexCount, 0, sum)
            indexCount += 1;
        });

        console.log('sumSortedArray', sumArray);

        return sumArray;
    }



    public static emptyMyObjectWithZerosNString(obj: any, isNumber: Array<string>): any {
        obj = Object.assign({}, obj);
        Object.keys(obj).forEach(k => {
            obj[k] = ''
        });
        isNumber.forEach((item) => {
            obj[item] = 0;
        })
        return obj;
    }

    public static sumTheseKeys(obj: any, toSum: Array<string>, data: any) {
        toSum.forEach((item) => {
            obj[item] += parseFloat(data[item]);
        });
    }

    public static toFixedTheseKeys(toSum: Array<string>, obj: any) {
        toSum.forEach((item) => {
            obj[item] = parseFloat(obj[item]).toFixed(2);
        });
    }


    public static labelOnColumn(col: string, obj: any, data: any, labelAdd: string, labelKeyName = true) {
        if (labelKeyName) {
            obj[col] = data[col] + ' ' + labelAdd;
        } else {
            obj[col] = labelAdd;
        }

    }



    public static pushObjectwithBold(inPush: Array<any>, toPush: any) {
        Object.keys(toPush)
            .forEach((k) => {
                if (typeof toPush[k] === 'number') {
                    toPush[k] = toPush[k].toFixed(2);
                }
                toPush[k] = this.toBoldHtml(toPush[k]);
            });
        inPush.push(toPush);
    }

    public static breakThemBeforeAKey(output: Array<any>, objToCopy: any, keys: Array<string>, breakingKey: string, mySumArray: any, lastKeyValue: Array<any>) {
        const keysToBreak = [];
        const keysLength = keys.length;

        for (let i = 0; i < keysLength; i++) {


            keysToBreak.push(keys[i]);
            if (keys[i] === breakingKey) {
                break;
            }
        }
        keysToBreak.forEach((key) => {
            // output.push(mySumArray[key])
            this.pushObjectwithBold(output, mySumArray[key])
            mySumArray[key] = Object.assign({}, objToCopy)
            lastKeyValue[key] = null;
        })

    }

    public static setShowKeys(showKeys: Array<string>, keys: Array<string>, currentKey: string) {

    }

    public static mySumFunction2(data: Array<any>, toSum: Array<string>, labelCol: string, labelAdd: string, grandTotalLabel: string, keys: Array<string>, labelKeyName = true, showAsItIs?: Array<string>) {
        // Order data from API should be correct

        const isEmpty = this.isEmpty(data);
        console.log('mySumFunction2');
        if (!isEmpty) {
            const SUM = this.emptyMyObjectWithZerosNString(data[0], toSum);
            const output = [];
            const dataLength = data.length;

            const mySumArray = [];
            const lastKeyValue = [];
            const shownKeys = [];

            if (keys.length !== 0) {
                keys.forEach((k) => {
                    mySumArray[k] = Object.assign({}, SUM);
                    lastKeyValue[k] = data[0][k];
                });
            }


            const grandTotal = Object.assign({}, SUM)

            for (let i = 0; i < dataLength; i++) {

                keys.forEach((k) => {

                    if (lastKeyValue[k] === data[i][k]) {
                        this.sumTheseKeys(mySumArray[k], toSum, data[i]);
                        this.labelOnColumn(labelCol, mySumArray[k], data[i], labelAdd, labelKeyName);
                    } else {
                        shownKeys.push(k)
                        // this.breakThemBeforeAKey(output, SUM, keys, k, mySumArray, lastKeyValue);
                        this.pushObjectwithBold(output, mySumArray[k]);
                        lastKeyValue[k] = data[i][k]
                        mySumArray[k] = Object.assign({}, SUM)

                        this.labelOnColumn(labelCol, mySumArray[k], data[i], labelAdd, labelKeyName);
                        this.sumTheseKeys(mySumArray[k], toSum, data[i]);
                    }

                });

                this.sumTheseKeys(grandTotal, toSum, data[i]);
                // this.toFixedTheseKeys(toSum, data[i]);
                output.push(data[i])
            }

            keys.forEach((k) => {
                this.pushObjectwithBold(output, mySumArray[k]);
            });

            grandTotal[labelCol] = grandTotalLabel + ':';
            this.pushObjectwithBold(output, grandTotal);

            console.log('output', output);

            return output;
        } else {
            return [];
        }
    }




    public static mySumFunctionWithOutBold(data: Array<any>, toSum: Array<string>, labelCol: string, labelAdd: string, grandTotalLabel: string, keys: Array<string>, labelKeyName = true, showAsItIs?: Array<string>) {
        // Order data from API should be correct

        const isEmpty = this.isEmpty(data);
        console.log('mySumFunction2');
        if (!isEmpty) {
            const SUM = this.emptyMyObjectWithZerosNString(data[0], toSum);
            const output = [];
            const dataLength = data.length;

            const mySumArray = [];
            const lastKeyValue = [];
            const shownKeys = [];

            if (keys.length !== 0) {
                keys.forEach((k) => {
                    mySumArray[k] = Object.assign({}, SUM);
                    lastKeyValue[k] = data[0][k];
                });
            }


            const grandTotal = Object.assign({}, SUM)

            for (let i = 0; i < dataLength; i++) {

                keys.forEach((k) => {

                    if (lastKeyValue[k] === data[i][k]) {
                        this.sumTheseKeys(mySumArray[k], toSum, data[i]);
                        this.labelOnColumn(labelCol, mySumArray[k], data[i], labelAdd, labelKeyName);
                    } else {
                        shownKeys.push(k)
                        // this.breakThemBeforeAKey(output, SUM, keys, k, mySumArray, lastKeyValue);
                        // this.pushObjectwithBold(output, mySumArray[k]);
                        this.toFixedTheseKeys(toSum, mySumArray[k]);
                        output.push(mySumArray[k])
                        lastKeyValue[k] = data[i][k]
                        mySumArray[k] = Object.assign({}, SUM)

                        this.labelOnColumn(labelCol, mySumArray[k], data[i], labelAdd, labelKeyName);
                        this.sumTheseKeys(mySumArray[k], toSum, data[i]);
                    }

                });

                this.sumTheseKeys(grandTotal, toSum, data[i]);
                this.toFixedTheseKeys(toSum, data[i]);
                output.push(data[i])
            }

            keys.forEach((k) => {
                this.toFixedTheseKeys(toSum, mySumArray[k]);
                output.push(mySumArray[k]);
                // this.pushObjectwithBold(output, mySumArray[k]);
            });

            grandTotal[labelCol] = grandTotalLabel + ':';
            output.push(grandTotal);
            this.toFixedTheseKeys(toSum, grandTotal);
            // this.pushObjectwithBold(output, grandTotal);

            console.log('output', output);

            return output;
        } else {
            return [];
        }
    }


    public static SumAllObjects(data: Array<any>, keys: Array<string>, textObj: any) {

        const isEmpty = this.isEmpty(data)
        if (!isEmpty) {
            const sum = Object.assign({}, data[0]);

            Object.keys(sum)
                .forEach((key) => {
                    sum[key] = '';
                })

            keys.forEach((key) => {
                sum[key] = 0;
            })

            data.forEach((elem) => {
                keys.forEach((key) => {
                    let keyValue = parseFloat(elem[key]);
                    if (!isNaN(keyValue)) {
                        sum[key] += keyValue;
                    }

                });
            });

            const total = Object.assign({}, sum, textObj);
            console.log('total', total);
            Object.keys(total)
                .forEach((key) => {
                    total[key] = this.toBoldHtml(this.toFixedIfNumber(total[key]));
                })
            console.log('total...................', total);
            console.log(data.concat(total))
            return data.concat(total);
        } else {
            return [];
        }
    }

    public static unsubscribe(...obj: Array<Subscription | Subject<any>>): void {
        obj.forEach(item => {
            if (item instanceof Subscription) {
                item.unsubscribe();
            } else if (item instanceof Subject) {
                item.unsubscribe();
            }
        });
    }

    // public static getFutureElement(id: string, delay: number, interval: number): Observable<any> {
    //     const mytimer = Observable.timer(delay, interval);

    //     return new Observable((observer: Observer<any>) => {
    //         const sub: Subscription = mytimer
    //             .take(200)
    //             .subscribe((count) => {
    //                 console.log('getFutureElement', count)
    //                 const element = document.getElementById(id);
    //                 if (!this.isEmpty(element)) {
    //                     sub.unsubscribe();
    //                     observer.next(element);
    //                 }
    //             });
    //     });
    // }

    // public static getFutureObj(objOrFn: any, instance: any, delay: number = 50, interval: number = 50): Observable<any> {
    //     const mytimer = Observable.timer(delay, interval);
    //     let value = null;
    //     return new Observable((observer: Observer<any>) => {
    //         const sub: Subscription = mytimer
    //             .take(200)
    //             .subscribe((count) => {
    //                 console.log('getFutureObj', count)
    //                 if (typeof objOrFn === 'function') {
    //                     value = objOrFn()
    //                     if (value instanceof instance) {
    //                         sub.unsubscribe();
    //                         observer.next(value);
    //                     };
    //                 } else if (objOrFn instanceof instance) {
    //                     sub.unsubscribe();
    //                     observer.next(objOrFn);
    //                 }
    //             });
    //     });
    // }

    public static loadJS(url: string) {
        const script = document.createElement('script');
        script.type = 'application/javascript';
        script.src = url;
        document.body.appendChild(script);
    }

    public static dynamicColumns(ColmFunc: any, dtOptions: any) {

        if (typeof ColmFunc === 'function') {
            ColmFunc(dtOptions);
            dtOptions['aoColumns'] = [];
            dtOptions['columns'].forEach(element => {
                dtOptions['aoColumns'].push(
                    {
                        data: element['data'],
                        mData: element['data'],
                        sTitle: element['title'],
                        title: element['title']
                    }
                );
            });
        }
        console.log('dynamicColumns', dtOptions)
    }

    public static deleteFromArray(data: Array<any>, key: string, value: string): Array<any> {
        return data.filter((item, index) => {
            return item[key] !== value;
        });
    }

    public static downloadGET(url: string) {
        document.location.href = url;
    }
    public static getMonthNumber(month: string) {
        const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        const index = months.indexOf(month.toUpperCase())
        return ('0' + index).slice(-2);
    }
    public static returnEmptyArray(): Observable<Array<any>> {
        return new Observable((observer: Observer<any>) => {
            observer.next([]);
        });
    }


    public static disablePagingNSearch(dtOptions) {
        dtOptions.paging = false;
        dtOptions.searching = false;
    }


    public static arrayToCommaSep(arr: Array<any>): string {
        return arr.join(',');
    }

    public static fetchObjKeyFromArray(arr: Array<any>, key: string): string {
        const keyArray = [];
        arr.forEach((item) => {
            keyArray.push(item[key]);
        });
        return keyArray.join(',');
    }

    public static openSmallWindow(url: string, windowName?: string, height: number = 200, width: number = 150): Window {
        const newwindow = window.open(url, windowName, `height=${height},width=${width}`);
        if (window.focus) {
            newwindow.focus();
        }
        return newwindow;
    }

    public static addRemoveObjIsAvailabe(arr: Array<any>, obj: any, checkKey: string, task: 'add' | 'remove'): Array<any> {

        let retObj = null;
        if (task === 'remove') {
            arr.forEach((item, index, myArray) => {
                if (item[checkKey] === obj[checkKey]) {
                    retObj = myArray.splice(index, index + 1)
                }
            })
        } else {
            let flag = true;
            arr.forEach((item, index, myArray) => {
                if (item[checkKey] === obj[checkKey]) {
                    flag = false;
                }
            });

            if (flag) {
                arr.push(obj);
            }
        }
        retObj = arr;
        return retObj;
    }


    public static deleteElementFromArrayByValues(arr: Array<any>, key: string, ...val) {
        val.forEach((item) => {
            const length = arr.length;
            for (let i = 0; i < length; i++) {
                if (arr[i][key] === item) {
                    arr.splice(i, 1);
                    console.log(arr)
                    break;
                }
            }
        });
    }

    public static isEmptyObjectExceptKeys(obj: any, ...keys): boolean {
        let retVal = true;
        const myKeys = Object.keys(obj || {});
        const length = myKeys.length;
        for (let i = 0; i < length; i++) {
            const element = myKeys[i];
            if (!keys.includes(element)) {
                if (!this.isEmpty(obj[element])) {
                    retVal = false;
                    break;
                }
            }
        }
        return retVal;
    }

    public static objIsAllTheseKeysEmpty(obj: any, ...keys): boolean {
        let retVal = true;

        keys.forEach((key) => {
            if (this.isEmpty(obj[key])) {
                if (retVal) {
                    retVal = false;
                }
                obj[key] = null;
            } else {

            }
        })
        return retVal;
    }

    public static assignTillTheseKeys(obj: any, assignmentFn: any, ...keys) {
        // let isAllFilled = false;
        // const myKeys = Object.keys(obj || {});
        // const length = myKeys.length;

        // const myTimer: Observable<any> = Observable.timer(500, 500);

        // const subMyTimer = myTimer.subscribe(() => {
        //     assignmentFn();

        //     console.log('assignTillTheseKeys', obj)
        //     isAllFilled = true;
        //     for (let i = 0; i < length; i++) {
        //         const element = myKeys[i];
        //         if (keys.includes(element)) {
        //             if (Utils.isEmpty(obj[element])) {
        //                 isAllFilled = false;
        //             }
        //         }
        //     }

        //     if (isAllFilled === true) {
        //         subMyTimer.unsubscribe();
        //     }

        // });
    }


    public static parseFloatIfNumber(num) {
        const temp = parseFloat(num);

        if (isNaN(temp)) {
            return 0;
        } else {
            return temp;
        }
    }


    public static dtDisableSorting(dtOptions: any, ...rowsNumber) {

        dtOptions['aaSorting'] = [];  // for disable starting sort
        dtOptions['aoColumnDefs'] = [
            { 'bSortable': false, 'aTargets': rowsNumber }
        ]
    }

    public static limitStringNAddToolTip(val: string, noOfChars = 60) {
        const str = val.substring(0, noOfChars);
        let toShow = null;
        if (val.length > noOfChars) {
            toShow = str + '...';
        } else {
            toShow = str;
        }
        return `<span title=">${val}">${toShow}</span>`
    }


    public static PrintElem(elem, style) {
        const mywindow = window.open('', 'PRINT', 'height=400,width=600');

        const requiredForColor = `
        @media print, screen { /* Using for the screen as well */
          * {
              -webkit-print-color-adjust: exact;
          }
        }`

        style = requiredForColor + style;

        mywindow.document.write('<html><head>');
        mywindow.document.write(`<style> ${style} </style>`);
        mywindow.document.write('</head><body >');
        // mywindow.document.write('<h1>' + document.title + '</h1>');
        mywindow.document.write(document.getElementById(elem).innerHTML);
        mywindow.document.write('</body></html>');

        mywindow.document.close(); // necessary for IE >= 10
        mywindow.focus(); // necessary for IE >= 10*/

        mywindow.print();
        mywindow.close();

        return true;
    }


    public static paramFromObjectKeys(obj, ...keys): string {
        let body = ''
        let value;
        if (typeof obj === 'object') {
            Object.keys(obj)
                .forEach((key) => {
                    if (keys.includes(key)) {
                        if (Array.isArray(obj[key])) {
                            value = encodeURIComponent(obj[key].join(','));
                        } else {
                            value = encodeURIComponent(obj[key]);
                        }
                        body += '&' + encodeURIComponent(key) + '=' + value;
                    }
                });
        }

        body = body && body.slice(1);
        return body;
    }


    public static printAddCss(IDToPrint: string) {
        const styleE = document.createElement('style');
        styleE.id = IDToPrint;
        IDToPrint = '#' + IDToPrint;
        styleE.innerText = '@media print {body * {visibility: hidden;} ' + IDToPrint + ',' + IDToPrint + ' * { visibility: visible; }' + IDToPrint + '{ position: absolute; left: 0; top: 0; }} ';
        console.log('styleE.innerText', styleE.innerText)
        document.head.appendChild(styleE);
    }
    public static printRemoveCss(IDToPrint: string) {
        const styleE = document.getElementById(IDToPrint);
        styleE.remove();
    }

    public static objKeyValueArray(obj: any): Array<any> {
        const keys = Object.keys(obj);

        const arr = [];

        keys.forEach((key) => {
            arr[key] = {
                key: key,
                value: obj[key]
            };
        })
        return arr;
    }


    public static objKeyValueArrayI(obj: any): Array<any> {
        const keys = Object.keys(obj);

        const arr = [];

        keys.forEach((key) => {
            arr.push({
                key: key,
                value: obj[key]
            });
        })
        return arr;
    }

    public static arrDivideInSubArray(data: Array<any>, divisionLimit = 7): ArrDivideInSubArrayI {
        const singleObj = data && data[0];
        const obj = this.emptyMyObjectWithNewRef(singleObj);
        const division = parseInt((data.length / divisionLimit) + '', 10) + 1;

        const dataToShow = [];

        let i = 0;
        for (; i < division; i++) {
            const start = i * divisionLimit;
            dataToShow[i] = data.slice(start, start + divisionLimit);
        }

        const addRow = divisionLimit - dataToShow[i - 1].length;
        let j = 0;
        for (; j < addRow; j++) {
            dataToShow[i - 1].push(obj);
        }

        return {
            singleObj: singleObj,
            dataToShow: dataToShow
        }
    }


    public static obj_Process_Keys(obj: any, processFns: Array<ProcessFnI>) {

        // obj = {
        //     a: 100,
        //     b: 200,
        //     c: 300
        // };

        // const keysPairsToSum = [
        //     {
        //         tskFn: function () {
        //             obj['vimal'] = obj['a'] + obj['b']
        //         }
        //     }
        // ];

        // keysPairsToSum.forEach((item) => {
        //     item.tskFn();
        // });


        processFns.forEach((item) => {
            item.tskFn();
        });

        console.log('obj_Process_Keys', obj)
    }



    public static arr_Obj_Process_Keys(data: Array<any>, processFns: Array<ProcessFnI>) {
        data.forEach(item => {
            Utils.testFn(item);
        });
    }


    public static obj_Sum_Keys(obj: any, outputKey: string, keys: Array<any>) {
        let sum = 0;
        keys.forEach((key) => {
            sum += parseFloat(obj[key]);
        });
        obj[outputKey] = Utils.toFixedIfNumber(sum);
    }


    public static testFn(obj: any, tableColumns?: Array<any>) {
        // obj = {
        //     '[2017: EU]': 2377.77,
        //     '[2017: ROW]': 5263.78,
        //     '[2017: UK]': 47676.81,
        //     '[2017: US / CA / AMR]': 0,
        //     '[2017: US]': 1022.9,
        //     '[February - 2017: EU]': 3087.66,
        //     '[February - 2017: ROW]': 4948.25,
        //     '[February - 2017: UK]': 47516.04,
        //     '[February - 2017: US / CA / AMR]': 0,
        //     '[February - 2017: US]': 1056.22,
        //     '[March - 2017: EU]': 3967.56,
        //     '[March - 2017: ROW]': 5930.37,
        //     '[March - 2017: UK]': 52665.99,
        //     '[March - 2017: US / CA / AMR]': 0,
        //     '[March - 2017: US]': 1476.18,
        //     category: 'Pack',
        //     name: 'British National Formulary (BNF) - Print',
        //     subscription: 'General'
        // };

        let myKey: string;
        let orgKey: string;
        const keySet: String[] = [];
        let keySetSingle: Array<string>;

        const myKeys = [];
        Object.keys(obj).forEach((key) => {
            if (key.includes('[')) {
                myKey = key;
                orgKey = key.split('[')[1].split(']')[0];

                keySetSingle = orgKey.split(':');

                if (keySetSingle.length > 1) {
                    if (!keySet.includes(keySetSingle[0])) {
                        keySet.push(keySetSingle[0]);
                    }
                } else {
                    orgKey = '-' + orgKey;
                }



                obj[orgKey] = obj[myKey];
                myKeys.push(orgKey);
                delete obj[myKey];
            } else {
                if (tableColumns) {
                    tableColumns.push(key);
                }
            }
        });

        console.log(obj, keySet, myKeys);



        const finalKeySet = [];
        let singleKey: string;

        keySet.forEach((k, i) => {
            finalKeySet[i] = [];

            myKeys.forEach(key => {
                singleKey = key.split(':')[0];
                if (k === singleKey) {
                    finalKeySet[i].push(key);
                    if (tableColumns) {
                        tableColumns.push(key);
                    }
                }
            });

            if (tableColumns) {
                tableColumns.push(k + ' Sub Total');
            }

        })

        console.log(obj, keySet, myKeys, finalKeySet);

        const processFns: Array<ProcessFnI> = [];


        keySet.forEach((k, i) => {
            processFns.push({
                tskFn: Utils.obj_Sum_Keys.bind(Utils, obj, k + ' Sub Total', finalKeySet[i])
            });
        });






        processFns.push({
            tskFn: Utils.changeSubTotal.bind(Utils, obj, keySet[2] + ' Sub Total', keySet[0] + ' Sub Total', '2017 Change')
        });

        processFns.push({
            tskFn: Utils.changePerc.bind(Utils, obj, '2017 Change', keySet[0] + ' Sub Total', '2017 Change %')
        });

        processFns.push({
            tskFn: Utils.changeSubTotal.bind(Utils, obj, keySet[2] + ' Sub Total', keySet[1] + ' Sub Total', 'Change PYTD-YTD Number')
        });


        processFns.push({
            tskFn: Utils.changePerc.bind(Utils, obj, 'Change PYTD-YTD Number', keySet[2] + ' Sub Total', 'Change PYTD-YTD Number %')
        });

        if (tableColumns) {
            tableColumns.push('2017 Change');
            tableColumns.push('2017 Change %');

            tableColumns.push('Change PYTD-YTD Number');
            tableColumns.push('Change PYTD-YTD Number %');
        }

        Utils.obj_Process_Keys(obj, processFns);

        return processFns;
    }


    public static changeSubTotal(obj: any, firstKey: string, secKey: string, outPutKey) {
        obj[outPutKey] = Utils.toFixedIfNumber(obj[firstKey] - obj[secKey]);
    }



    public static changePerc(obj: any, firstKey: string, secKey: string, outPutKey) {
        obj[outPutKey] = Utils.toFixedIfNumber((obj[firstKey] / obj[secKey]) * 100) + '%';
    }


}

interface ProcessFnI {
    tskFn: any;
}
