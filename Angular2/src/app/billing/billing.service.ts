import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response, URLSearchParams } from "@angular/http";
import "rxjs/add/operator/toPromise";
import { Observable } from "rxjs/Observable";
import "rxjs/Rx";
import { Configuration } from "../app.constants";
import {GlobalServiceService} from "../global-service.service";

@Injectable()
export class BillingService {
    private headers: Headers;
    private actionUrl: string;
    private earningUrl: string;
    private searchParameters: URLSearchParams;
    constructor(private http: Http, private configuration: Configuration, private globalservice: GlobalServiceService) {
        this.actionUrl = globalservice.baseURL + configuration.billingURL;
        this.headers = new Headers();
        this.headers.append("Content-Type", "application/json");
        this.headers.append("Accept", "application/json");
        this.headers.append("accessToken", globalservice.accessToken);
        this.searchParameters = new URLSearchParams();
        this.searchParameters.set("userId", globalservice.userName);
    }

    /*getBillingDetails(selectedVal:string)
    {
      this.searchParameters.set('selectedPeriod',selectedVal);
      return this.http.get(this.actionUrl,  {headers: this.headers ,search: this.searchParameters })
    .map(res => res.json());
  }*/
    //  getRevenueDetails(selectedVal: string) {
    //      // this.searchParameters.set('selectedPeriod',selectedVal);
    //      // return this.http.post(this.approveURL+ "/" + serviceName+"/"+userInput,
    //      return this.http.get(this.actionUrl + this.globalservice.userName + "/" +
    //  selectedVal + "/" + this.globalservice.selectedRole, { headers: this.headers })
    //          .map((res) => res.json());
    //  }

    /*public getBillingDetails(selectedVal:string)
    {
      this.searchParameters.set('selectedPeriod',selectedVal);
      return this.http.get(this.actionUrl,  {headers: this.headers ,search: this.searchParameters })
    .map(res => res.json());
  }*/
    public getRevenueDetails(selectedVal: string) {
        // this.searchParameters.set('selectedPeriod',selectedVal);
        // return this.http.post(this.approveURL+ "/" + serviceName+"/"+userInput,
        return this.http.get(this.actionUrl + this.globalservice.userName + "/" +
        selectedVal + "/" + this.globalservice.selectedRole,
            { headers: this.headers })
            .map((res) => res.json());
    }
}
