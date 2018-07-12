import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response, URLSearchParams } from "@angular/http";
import "rxjs/add/operator/toPromise";
import { Observable } from "rxjs/Observable";
import "rxjs/Rx";
import { Configuration } from "../app.constants";
import { GlobalServiceService } from "../global-service.service";

@Injectable()
export class MainPageService {
    private headers: Headers;
    private msActionUrl: string;
    private appsActionUrl: string;
    private logoutUrl: string;
    private searchForView: URLSearchParams;


    constructor( private http: Http, private configuration: Configuration,
        private globalservice: GlobalServiceService ) {
        this.msActionUrl = globalservice.baseURL + configuration.getAllMicroservices;
        this.appsActionUrl = globalservice.baseURL + configuration.getAllMobileApps;
        this.logoutUrl = globalservice.baseURL + configuration.timeoutURL;

        this.headers = new Headers();
        this.headers.append( "Content-Type", "application/json" );
        this.headers.append( "Accept", "application/json" );
        this.headers.append( "accessToken", globalservice.accessToken );
        this.searchForView = new URLSearchParams();
        this.searchForView.set( configuration.pageSize, configuration.Limit );
        this.searchForView.set( configuration.pageNumber, configuration.Offset );
        this.searchForView.set( "sort_order", "1" );
        this.searchForView.set( "userId", this.globalservice.userName );
        this.searchForView.set( "stage", "all" );
        this.searchForView.set( "onBoardStatus", "Success" );

    }

    public getAllMicroServices() {
        this.searchForView.set( "sort_by", "microServiceName" );
        return this.http.get( this.msActionUrl, { headers: this.headers, search: this.searchForView } ).
            map(( res: Response ) => res.json() );
    }

    public getAllMobileApps() {
        this.searchForView.set( "sort_by", "applicationName" );
        return this.http.get( this.appsActionUrl, { headers: this.headers, search: this.searchForView } ).
            map(( res: Response ) => res.json() );
    }

    public logout() {
        return this.http.get( this.logoutUrl, { headers: this.headers } ).
            map(( res: Response ) => res.json() );
    }
}
