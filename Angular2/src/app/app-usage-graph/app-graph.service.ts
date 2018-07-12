import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response, URLSearchParams } from "@angular/http";
import "rxjs/add/operator/toPromise";
import { Observable } from "rxjs/Observable";
import { Configuration } from "../app.constants";
import { GlobalServiceService } from "../global-service.service";

@Injectable()
export class AppGraphService {
    private headers: Headers;
    private appUsageURL: string;
    private searchForUsage: URLSearchParams;
    private appName: string;
    private userName: string;
    private msUsageURL: string;
    private searchForUsageMicro: URLSearchParams;
    private msName: string;
    private appNameForMonitor_1: string;
    private appNameForMonitor_2: string;
    private appNameForMonitor_3: string;
    private msNameForMonitor_1: string;
    private msNameForMonitor_2: string;
    private msNameForMonitor_3: string;

    constructor(private http: Http, private configuration: Configuration,
        private globalServiceObj: GlobalServiceService) {
        this.appUsageURL = globalServiceObj.baseURL + configuration.appGraphURL;
        this.msUsageURL = globalServiceObj.baseURL + configuration.msGraphURL;
        this.userName = globalServiceObj.userName;
        this.appName = globalServiceObj.applicationName;
        this.msName = globalServiceObj.microServiceName;
        this.headers = new Headers();
        this.headers.append("Content-Type", "application/json");
        this.headers.append("Accept", "application/json");
        this.headers.append("accessToken", globalServiceObj.accessToken);
    }
    public getAppUsage(periodSel: string, matricSel: string) {
        this.searchForUsage = new URLSearchParams();
        this.searchForUsage.set("userid", this.userName);
        this.searchForUsage.set("appName1", this.appName);
        this.searchForUsage.set("timeCycle", periodSel);
        this.searchForUsage.set("metricType", "ALL");
        return this.http.get(this.appUsageURL, { headers: this.headers, search: this.searchForUsage }).
            map((res: Response) => res.json());
    }

    public getAppMonitoring(periodSel: string, matricSel: string) {
        this.searchForUsage = new URLSearchParams();
        if (this.globalServiceObj.appNames.length == 1) {
            this.appNameForMonitor_1 = this.globalServiceObj.appNames[0];
            this.searchForUsage.set("appName1", this.appNameForMonitor_1);
        } else if (this.globalServiceObj.appNames.length == 2) {
            this.appNameForMonitor_1 = this.globalServiceObj.appNames[0];
            this.appNameForMonitor_2 = this.globalServiceObj.appNames[1];
            this.searchForUsage.set("appName1", this.appNameForMonitor_1);
            this.searchForUsage.set("appName2", this.appNameForMonitor_2);
        } else {
            this.appNameForMonitor_1 = this.globalServiceObj.appNames[0];
            this.appNameForMonitor_2 = this.globalServiceObj.appNames[1];
            this.appNameForMonitor_3 = this.globalServiceObj.appNames[2];
            this.searchForUsage.set("appName1", this.appNameForMonitor_1);
            this.searchForUsage.set("appName2", this.appNameForMonitor_2);
            this.searchForUsage.set("appName3", this.appNameForMonitor_3);
        }

        this.searchForUsage.set("userid", this.globalServiceObj.userName);

        this.searchForUsage.set("timeCycle", periodSel);
        this.searchForUsage.set("metricType", "ALL");
        return this.http.get(this.appUsageURL, { headers: this.headers, search: this.searchForUsage }).
            map((res: Response) => res.json());
    }

    public getMSUsage(periodSel: string, matricSel: string) {
        this.searchForUsageMicro = new URLSearchParams();
        this.searchForUsageMicro.set("userid", this.userName);
        this.searchForUsageMicro.set("msName1", this.msName);
        this.searchForUsageMicro.set("timeCycle", periodSel);
        this.searchForUsageMicro.set("metricType", "ALL");
        return this.http.get(this.msUsageURL, { headers: this.headers, search: this.searchForUsageMicro }).map((res: Response) => res.json());
    }

    public getMSMonitoring(periodSel: string, matricSel: string) {
        this.searchForUsageMicro = new URLSearchParams();
        if (this.globalServiceObj.msNames.length == 1) {
            this.msNameForMonitor_1 = this.globalServiceObj.msNames[0];
            this.searchForUsageMicro.set("msName1", this.msNameForMonitor_1);
        } else if (this.globalServiceObj.msNames.length == 2) {
            this.msNameForMonitor_1 = this.globalServiceObj.msNames[0];
            this.msNameForMonitor_2 = this.globalServiceObj.msNames[1];
            this.searchForUsageMicro.set("msName1", this.msNameForMonitor_1);
            this.searchForUsageMicro.set("msName2", this.msNameForMonitor_2);
        } else {
            this.msNameForMonitor_1 = this.globalServiceObj.msNames[0];
            this.msNameForMonitor_2 = this.globalServiceObj.msNames[1];
            this.msNameForMonitor_3 = this.globalServiceObj.msNames[2];
            this.searchForUsageMicro.set("msName1", this.msNameForMonitor_1);
            this.searchForUsageMicro.set("msName2", this.msNameForMonitor_2);
            this.searchForUsageMicro.set("msName3", this.msNameForMonitor_3);
        }

        this.searchForUsageMicro.set("userid", this.globalServiceObj.userName);

        this.searchForUsageMicro.set("timeCycle", periodSel);
        this.searchForUsageMicro.set("metricType", "ALL");
        return this.http.get(this.msUsageURL, { headers: this.headers, search: this.searchForUsageMicro }).map((res: Response) => res.json());
    }

}
