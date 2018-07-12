import { Injectable }    from "@angular/core";
import { Headers, Http, RequestOptions, Response, URLSearchParams } from "@angular/http";
import "rxjs/add/operator/toPromise";
import { Observable } from "rxjs/Observable";
import "rxjs/Rx";
import { Configuration } from "../app.constants";
import {MobileAppMetadata} from "../common-services/mobileAppsMetadata";
import {GlobalServiceService} from "../global-service.service";
@Injectable()
export class MobileAppsService {
    private headers: Headers;
    private actionUrl: string;
    private searchForView: URLSearchParams;
    private searchForUserMS: URLSearchParams;
    private searchForMP: URLSearchParams;
    private searchForRA: URLSearchParams;
    private searchForName: URLSearchParams;
    private sortBy: URLSearchParams;
    private configurationL: Configuration;
    private searchForMSUser: URLSearchParams;
    private searchForMPUser: URLSearchParams;
    private searchForRAUser: URLSearchParams;

    constructor(private http: Http,
                private configuration: Configuration,
                private globalservice: GlobalServiceService) {
        this.configurationL = configuration;
        this.actionUrl = globalservice.baseURL + configuration.getAllMicroservices;
        this.headers = new Headers();
        this.headers.append("Content-Type", "application/json");
        this.headers.append("Accept", "application/json");
        this.headers.append("accessToken", globalservice.accessToken);
        this.searchForMP = new URLSearchParams();
        this.searchForMP.set(configuration.pageSize, configuration.Limit);
        this.searchForMP.set(configuration.pageNumber, configuration.Offset);
        this.searchForMP.set("sort_by", "microServiceName");
        this.searchForMP.set("sort_order", "1");
        this.searchForMP.set("onBoardStatus", "Success");
        this.searchForMP.set("stage", "all");
    }
    // EdgeCR changes

    public getAllMicroservices(categorySel: string,deliveryMethod: string): any {
         this.searchForMP.delete("deliveryMethod");
        if(deliveryMethod == 'vm'){
          this.searchForMP.set("microServiceType", categorySel);
          this.searchForMP.set("deliveryMethod", deliveryMethod);
          return this.http.get(this.actionUrl, { headers: this.headers, search: this.searchForMP })
              .map((res) => res.json());
        }
        else{
          this.searchForMP.set("microServiceType", categorySel);
          return this.http.get(this.actionUrl, { headers: this.headers, search: this.searchForMP })
              .map((res) => res.json());
        }
    }

//     public getAllMicroservices(categorySel: string): any {
//
//          this.searchForMP.set("microServiceType", categorySel);
//          return this.http.get(this.actionUrl, { headers: this.headers, search: this.searchForMP })
//              .map((res) => res.json());
//
//    }

    public OnSubmit(mobileAppMetadata: MobileAppMetadata): any {
        let toAdd = JSON.stringify(mobileAppMetadata);
        if (this.globalservice.editMobileApps)
            return this.http.put(this.globalservice.baseURL + this.configuration.mobileOnboardSubmit +
			mobileAppMetadata.applicationName, toAdd, { headers: this.headers })
                .map((response: Response) => response.json());
        else
            return this.http.post(this.globalservice.baseURL + this.configuration.mobileOnboardSubmit,
			toAdd, { headers: this.headers })
                .map((response: Response) => response.json());
        //   return "success"
    }

    public OnNext(appName: string): any {
        let toAdd = JSON.stringify({ applicationName: appName });
        return this.http.post(this.globalservice.baseURL + this.configuration.appOnboardValidateName,
		toAdd, { headers: this.headers })
            .map((response: Response) => response.json());
        //   return "success"
    }

}
