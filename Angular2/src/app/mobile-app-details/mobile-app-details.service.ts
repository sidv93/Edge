import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response, URLSearchParams } from "@angular/http";
import "rxjs/add/operator/toPromise";
import { Observable } from "rxjs/Observable";
import { Configuration } from "../app.constants";
import { Approval } from "../common-services/approval";
import { MobileAppMetadata } from "../common-services/mobileAppsMetadata";
import { GlobalServiceService } from "../global-service.service";
import { SubscribedServices } from "./mobileAppDetails";

@Injectable()
export class MobileAppDetailsService {
    private headers: Headers;
    private appDetailURL: string;
    private similarAppURL: string;
    private editMSURL: string;
    private deleteMSURL: string;
    private searchForDetail: URLSearchParams;
    private searchForSA: URLSearchParams;
    private searchForUserSA: URLSearchParams;
    private deleteDetail: URLSearchParams;
    private searchSubscribed: URLSearchParams;
    private applicationName: string;
    private category: string;
    private editMAURL: string;
    private errorURL: string;
    private approveURL: string;
    private sandboxUrl: string;

    constructor(private http: Http, private configuration: Configuration,
	private globalServiceObj: GlobalServiceService) {
        this.appDetailURL = globalServiceObj.baseURL + configuration.getMobileApps;
        this.errorURL = globalServiceObj.baseURL + configuration.viewErrorsLinkMA;
        this.approveURL = globalServiceObj.baseURL + configuration.approveLinkMA;
        this.applicationName = globalServiceObj.applicationName;
        this.sandboxUrl = globalServiceObj.baseURL + configuration.AppSandboxing;
        this.headers = new Headers();
        this.headers.append("Content-Type", "application/json");
        this.headers.append("Accept", "application/json");
        this.headers.append("accessToken", globalServiceObj.accessToken);
        this.searchForDetail = new URLSearchParams();
        this.searchForDetail.set("applicationName", this.applicationName);

    }

    public getAppDetail(mobileAppName: string) {
        return this.http.get(this.appDetailURL + "/" + mobileAppName, { headers: this.headers }).
		map((res: Response) => res.json());
    }

    public submitDeleteData(): any {
        //   let toDelete = JSON.stringify({ deleteDataModel });
        this.deleteMSURL = this.appDetailURL + "/" + this.applicationName;

        return this.http.delete(this.deleteMSURL, { headers: this.headers })
            .map((response: Response) => <MobileAppMetadata> response.json());
    }

    public submitEditData(editDataModel: MobileAppMetadata): any {
        let toAdd = JSON.stringify({ editDataModel });
        this.editMAURL = this.appDetailURL + "/" + this.applicationName;
        return this.http.put(this.editMAURL, toAdd, { headers: this.headers })
            .map((response: Response) => <MobileAppMetadata> response.json());
    }

    /*
     getSubscribedServices(allMicroServiceName: string []): any {
             this.searchSubscribed = new URLSearchParams()
             let param: string ="";
             let count: number =0;
             for (let value of allMicroServiceName){
               if ( count == 0)
               {
                   param = param + value;
               }
               else
               {
                   param = param + "," + value;
               }
               count++;
           }
               this.searchSubscribed.set('microServiceName',param);
             this.http.get(this.similarAppURL,{ headers: this.headers, search: this.searchSubscribed}).
			 map((res:Response) => res.json())

     }
     */

    public getSubscribedServices(applicationNamePass: string): any {
        return this.http.get(this.similarAppURL + "/" + applicationNamePass, { headers: this.headers }).
		map((res: Response) => res.json());
    }

    public getMobileAppsEditDetail(applicationNamePass: string): any {
        return this.http.get(this.appDetailURL + "/" + applicationNamePass, { headers: this.headers }).
		map((res: Response) => res.json());
    }

    public getErrorDetail(selectedErrorApp: string): any {

        return this.http.get(this.errorURL + "/" + selectedErrorApp, { headers: this.headers }).
		map((res: Response) => res.json());
    }

    public approveApp(userId: string, userInput: string, appName: string): any {
        // 	var app: Approval = new Approval(userId,userInput);
        //   let toApprove = JSON.stringify({app});
        return this.http.post(this.approveURL + "/" + appName + "/" + userInput,null, { headers: this.headers })
            .map((response: Response) => <any> response.json());
    }

    public getEndpoints() {
        return this.http.get(this.sandboxUrl + this.applicationName, {headers: this.headers})
          .map((res : Response) => res.json());
    }

}
