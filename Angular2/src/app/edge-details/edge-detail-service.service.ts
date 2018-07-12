import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response, URLSearchParams } from "@angular/http";
import "rxjs/add/operator/toPromise";
import { Observable } from "rxjs/Observable";
import "rxjs/Rx";
import { Configuration } from "../app.constants";
import {GlobalServiceService} from "../global-service.service";

@Injectable()
export class EdgeDetailServiceService {
    private headers: Headers;
    private edgeDetailsUrl: string;
    private deleteUrl: string;
    private searchParameters: URLSearchParams;
    constructor(private http: Http, private configuration: Configuration, private globalservice: GlobalServiceService) {
        this.edgeDetailsUrl = globalservice.baseURL + configuration.edgeDetailURL;
        this.deleteUrl = globalservice.baseURL + "deleteEdges/" + globalservice.edgeName+"/";
        this.headers = new Headers();
        this.headers.append("Content-Type", "application/json");
        this.headers.append("Accept", "application/json");
        this.headers.append("accessToken", globalservice.accessToken);
        /*		this.searchParameters = new URLSearchParams();
                this.searchParameters.set('userId',globalservice.userName);
        */
    }


    public getEdgeDetail(edgeName: string) {
        this.edgeDetailsUrl = this.edgeDetailsUrl + edgeName+"/";
        return this.http.get(this.edgeDetailsUrl, { headers: this.headers }).map((res: Response) => res.json());
    }

    public submitDeleteData(): any {
        return this.http.delete(this.deleteUrl, { headers: this.headers })
            .map((res: Response) => res.json());
    }
}
