import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response, URLSearchParams } from "@angular/http";
import "rxjs/add/operator/toPromise";
import { Observable } from "rxjs/Observable";
import { Configuration } from "../app.constants";
import { GlobalServiceService } from "../global-service.service";

@Injectable()
export class CloudletUsageService {

    private headers: Headers;
    private cloudletUsageURL: string;
    private operatorUrl: string;
    private searchForUsage: URLSearchParams;

    constructor( private http: Http, private configuration: Configuration,
        private globalServiceObj: GlobalServiceService ) {
        // 	this.cloudletUsageURL = this.cloudletUsageURL+globalServiceObj.userName+'/';
        // 	this.cloudletUsageURL = this.cloudletUsageURL+globalServiceObj.cloudletName;
        this.headers = new Headers();
        this.headers.append( "Content-Type", "application/json" );
        this.headers.append( "Accept", "application/json" );
        this.headers.append("accessToken", globalServiceObj.accessToken);
    }
    public getCloudletUsage( periodSel: string, operatorSel: string, usageSel: string ) {
        if ( usageSel == "Cloudlet" ) {
            this.cloudletUsageURL = this.globalServiceObj.baseURL + this.configuration.paasUsageURL;
            this.searchForUsage = new URLSearchParams();
            this.searchForUsage.set( "timeCycle", periodSel );
            this.searchForUsage.set( "metricType", "ALL" );
            if ( operatorSel != "All" )
                this.searchForUsage.set( "operatorID", operatorSel );
        }
        else if ( usageSel == "Telco" ) {
            this.cloudletUsageURL = this.globalServiceObj.baseURL + this.configuration.telcoUsageURL;
            this.searchForUsage = new URLSearchParams();
            this.searchForUsage.set( "telcoUserId", this.globalServiceObj.userName );
            this.searchForUsage.set( "timeCycle", periodSel );
            this.searchForUsage.set( "metricType", "ALL" );
            if ( operatorSel != "All" )
                this.searchForUsage.set( "operatorID", operatorSel );
        }
        return this.http.get( this.cloudletUsageURL,
            { headers: this.headers, search: this.searchForUsage })
            .map(( res: Response ) => res.json() );
    }

    public getInitialCloudletUsage( periodSel: string ) {
        this.cloudletUsageURL = this.globalServiceObj.baseURL + this.configuration.paasUsageURL;
        this.operatorUrl = this.globalServiceObj.baseURL + this.configuration.edgeOperatorListURL;

        this.searchForUsage = new URLSearchParams();
        this.searchForUsage.set( "timeCycle", periodSel );
        this.searchForUsage.set( "metricType", "ALL" );

        return Observable.forkJoin(
            this.http.get( this.cloudletUsageURL, {
                headers: this.headers,
                search: this.searchForUsage
            }).map(( res: Response ) => res.json() ),
            this.http.get( this.operatorUrl, { headers: this.headers })
                .map(( res: Response ) => res.json() ),
        );
    }

    public search( periodSel: string, operatorSel: string, term: string ) {
        this.cloudletUsageURL = this.globalServiceObj.baseURL + this.configuration.telcoUsageURL;
        this.searchForUsage = new URLSearchParams();
        this.searchForUsage.set( "telcoUserId", this.globalServiceObj.userName );
        this.searchForUsage.set( "timeCycle", periodSel );
        this.searchForUsage.set( "metricType", "ALL" );
        if ( operatorSel != "All" )
            this.searchForUsage.set( "operatorID", operatorSel );
        this.searchForUsage.set( "searchedEdgeName", term );
        return this.http.get( this.cloudletUsageURL, { headers: this.headers, search: this.searchForUsage })
            .map(( res ) => res.json() );
    }

}
