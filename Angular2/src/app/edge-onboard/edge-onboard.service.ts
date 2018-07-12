import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response, URLSearchParams } from "@angular/http";
import "rxjs/add/operator/toPromise";
import { Observable } from "rxjs/Observable";
import "rxjs/Rx";
import { Configuration } from "../app.constants";
import {CloudLetOnBoard} from "../common-services/cloudLetOnBoard";
import {GlobalServiceService} from "../global-service.service";
import {EdgePresent} from "../paas-admin/edgePresent";

@Injectable()
export class EdgeOnboardService {
    private headers: Headers;
    private operatorList: string;
    private telcoUserList: string;
    private testConnectionUrl: string;
    private edgeListUrl: string;
    private validateCloudletNameUrl: string;
    private submitCloudletUrl: string;
    private edgeOnBoardURL: string;
    private edgeNameValidateUrl: string;
    private searchParameters: URLSearchParams;
    constructor(private http: Http, private configuration: Configuration,
	private globalservice: GlobalServiceService) {
        this.operatorList = globalservice.baseURL + configuration.edgeOperatorListURL;
        this.telcoUserList = globalservice.baseURL + configuration.edgeTelcoListURL;
        this.edgeOnBoardURL = globalservice.baseURL + configuration.edgeOnBoardURL;
        this.headers = new Headers();
        this.headers.append("Content-Type", "application/json");
        this.headers.append("Accept", "application/json");
        this.headers.append("accessToken", globalservice.accessToken);
    }
    public getOperatorList() {
        this.setURLParams(1);
        return this.http.get(this.operatorList, { headers: this.headers, search: this.searchParameters })
            .map((res) => res.json());
    }
    public getTelcoUsersList(operatorName: string) {
        this.setURLParams(1);
        return this.http.get(this.telcoUserList + "/" + this.configuration.telcoDeveloper +
		"/" + operatorName+"/", { headers: this.headers, search: this.searchParameters }).
		map((res: Response) => res.json());
    }

    public submitOnBoardData(onboardSubmitData: EdgePresent) {
        let edgeObject = JSON.stringify(onboardSubmitData);
        return this.http.post(this.edgeOnBoardURL, edgeObject, { headers: this.headers })
            .map((response: Response) => <EdgePresent> response.json());
    }

    public testConnection(edgeName: string) {
        this.testConnectionUrl = this.globalservice.baseURL + this.configuration.cloudletTestConnectionUrl +
		edgeName+"/";
        return this.http.get(this.testConnectionUrl, { headers: this.headers })
            .map((response: Response) => response.json());
    }

    public getEdgeListForOperator(operatorName: string) {
        this.setURLParams(2);
        this.edgeListUrl = this.globalservice.baseURL + this.configuration.edgeListforOperatorUrl + operatorName+"/";
        return this.http.get(this.edgeListUrl, { headers: this.headers, search: this.searchParameters })
            .map((response: Response) => response.json());
    }

    public validateCloudletName(cloudletName: string) {
        this.validateCloudletNameUrl = this.globalservice.baseURL + this.configuration.validateCloudletnameUrl;
        let toAdd = JSON.stringify({ cloudletName });
        return this.http.post(this.validateCloudletNameUrl, toAdd, { headers: this.headers })
            .map((response: Response) => response.json());
    }

    public submitCloudlet(cloudlet: CloudLetOnBoard) {
        this.submitCloudletUrl = this.globalservice.baseURL + this.configuration.submitCloudletUrl +
		cloudlet.edgeName + "/" + cloudlet.cloudletName+"/";
        let toAdd = JSON.stringify(cloudlet);
        return this.http.post(this.submitCloudletUrl, toAdd, { headers: this.headers })
            .map((response: Response) => response.json());
    }

    public validateEdgeName(edgeName: string): any {
        let toAdd = JSON.stringify({ edgeName });
        this.edgeNameValidateUrl = this.globalservice.baseURL + this.configuration.validateEdgenameUrl;

        return this.http.post(this.edgeNameValidateUrl, toAdd, { headers: this.headers })
            .map((response: Response) => response.json());
        //   return "success"
    }

    public setURLParams(tab: number) {
        this.searchParameters = new URLSearchParams();
        // this.searchParameters.set('userId',globalservice.userName);
        this.searchParameters.set(this.configuration.pageSize, this.configuration.Limit);
        this.searchParameters.set(this.configuration.pageNumber, this.configuration.Offset);
        this.searchParameters.set("sort_order", "1");
        if (tab == 1)
            this.searchParameters.set("sort_by", "userId");
        else if (tab == 2)
            this.searchParameters.set("sort_by", "edgeName");
    }
}
