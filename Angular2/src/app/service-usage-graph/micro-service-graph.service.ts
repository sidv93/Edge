import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response, URLSearchParams } from "@angular/http";
import "rxjs/add/operator/toPromise";
import { Observable } from "rxjs/Observable";
import { Configuration } from "../app.constants";
import { GlobalServiceService } from "../global-service.service";

@Injectable()
export class MicroServiceGraphService {
    private headers: Headers;
    private msUsageURL: string;
    private searchForUsage: URLSearchParams;
    private msName: string;
    private userName: string;
    private msNameForMonitor_1: string;
    private msNameForMonitor_2: string;
    private msNameForMonitor_3: string;
    constructor(private http: Http, private configuration: Configuration, private globalServiceObj: GlobalServiceService) {
        this.msUsageURL = globalServiceObj.baseURL + configuration.msGraphURL;
        this.headers = new Headers();
        this.headers.append("Content-Type", "application/json");
        this.headers.append("Accept", "application/json");
        this.headers.append("accessToken", globalServiceObj.accessToken);
        this.msName = globalServiceObj.microServiceName;
        this.userName = globalServiceObj.userName;
    }
    public getMSUsage(periodSel: string, matricSel: string) {
        this.searchForUsage = new URLSearchParams();
        this.searchForUsage.set("userid", this.userName);
        this.searchForUsage.set("msName1", this.msName);
        this.searchForUsage.set("timeCycle", periodSel);
        this.searchForUsage.set("metricType", "ALL");
        return this.http.get(this.msUsageURL, { headers: this.headers, search: this.searchForUsage }).map((res: Response) => res.json());
    }

    public getMSMonitoring(periodSel: string, matricSel: string) {
        this.searchForUsage = new URLSearchParams();
        if (this.globalServiceObj.msNames.length == 1) {
            this.msNameForMonitor_1 = this.globalServiceObj.msNames[0];
            this.searchForUsage.set("msName1", this.msNameForMonitor_1);
        } else if (this.globalServiceObj.msNames.length == 2) {
            this.msNameForMonitor_1 = this.globalServiceObj.msNames[0];
            this.msNameForMonitor_2 = this.globalServiceObj.msNames[1];
            this.searchForUsage.set("msName1", this.msNameForMonitor_1);
            this.searchForUsage.set("msName2", this.msNameForMonitor_2);
        } else {
            this.msNameForMonitor_1 = this.globalServiceObj.msNames[0];
            this.msNameForMonitor_2 = this.globalServiceObj.msNames[1];
            this.msNameForMonitor_3 = this.globalServiceObj.msNames[2];
            this.searchForUsage.set("msName1", this.msNameForMonitor_1);
            this.searchForUsage.set("msName2", this.msNameForMonitor_2);
            this.searchForUsage.set("msName3", this.msNameForMonitor_3);
        }

        this.searchForUsage.set("userid", this.globalServiceObj.userName);

        this.searchForUsage.set("timeCycle", periodSel);
        this.searchForUsage.set("metricType", "ALL");
        return this.http.get(this.msUsageURL, { headers: this.headers, search: this.searchForUsage }).map((res: Response) => res.json());
    }

}
