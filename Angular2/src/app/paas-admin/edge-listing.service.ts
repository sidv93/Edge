import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response, URLSearchParams } from "@angular/http";
import "rxjs/add/operator/toPromise";
import { Observable } from "rxjs/Observable";
import "rxjs/Rx";
import { Configuration } from "../app.constants";
import {GlobalServiceService} from "../global-service.service";

@Injectable()
export class EdgeListingService {
    private headers: Headers;
    private edgeListingUrl: string;
    private operatorUrl: string;
    private searchParameters: URLSearchParams;
    private searchForOperators: URLSearchParams;
    private usersList: URLSearchParams;

    constructor(private http: Http, private configuration: Configuration, private globalservice: GlobalServiceService) {
        this.edgeListingUrl = globalservice.baseURL + configuration.edgeFetchingURL;
        this.operatorUrl = globalservice.baseURL + configuration.edgeOperatorListURL;
        this.headers = new Headers();
        this.headers.append("Content-Type", "application/json");
        this.headers.append("Accept", "application/json");
        this.headers.append("accessToken", globalservice.accessToken);
        this.searchParameters = new URLSearchParams();
        this.searchParameters.set(configuration.pageSize, configuration.Limit);
        this.searchParameters.set(configuration.pageNumber, configuration.Offset);
        this.searchParameters.set("sort_by", "edgeName");
        this.searchParameters.set("sort_order", "1");
        this.searchForOperators = new URLSearchParams();

    }

    public getEdgeList() {
        this.usersList = new URLSearchParams(); //  to be added to operator url
        this.usersList.set(this.configuration.pageSize, this.configuration.Limit);
        this.usersList.set(this.configuration.pageNumber, this.configuration.Offset);
        this.usersList.set("sort_by", "companyName");
        this.usersList.set("sort_order", "1");
        return Observable.forkJoin(
            this.http.get(this.edgeListingUrl, { headers: this.headers, search: this.searchParameters }).map((res: Response) => res.json()),
            this.http.get(this.operatorUrl, { headers: this.headers , search: this.usersList}).map((res: Response) => res.json()),
        );

    }

    public search(term: string) {
        this.searchParameters.set("edgeName", term);
        this.searchParameters.delete("operator");
        return this.http.get(this.edgeListingUrl, { headers: this.headers, search: this.searchParameters })
            .map((res) => res.json());
    }

    public searchbyOperator(term: string) {
        if (term == "0") {
            this.searchParameters.delete("operator");
            this.searchParameters.delete("edgeName");
            return this.http.get(this.edgeListingUrl, { headers: this.headers, search: this.searchParameters })
                .map((res) => res.json());
        } else {
            this.searchParameters.set("operator", term);
            this.searchParameters.delete("edgeName");
            return this.http.get(this.edgeListingUrl, { headers: this.headers, search: this.searchParameters })
                .map((res) => res.json());
        }
    }

}
