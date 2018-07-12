import { Injectable } from "@angular/core";
import { Headers, Http, Response, RequestOptions, URLSearchParams } from "@angular/http";
import "rxjs/add/operator/toPromise";
import { Observable } from "rxjs/Observable";
import { Configuration } from "../app.constants";
import { GlobalServiceService } from "../global-service.service";

@Injectable()
export class NewCoDashboardService {
    private headers: Headers;
    private appDashURL: string;
    private searchForLatency: URLSearchParams;
    private searchForCPUUsage: URLSearchParams;
    private searchForCount: URLSearchParams;
    private searchForSubscription: URLSearchParams;
    private searchForTopAppUsers: URLSearchParams;
    private searchForTopAppLatency: URLSearchParams;
    private companyName: string;
    private memoryUsageURL: string;
    private CPUUsageURL: string;
    private storageUsageURL: string;
    private microServicesURL: string;
    private subscriptionUrl: string;
    private topAppUserCountURL: string;
    private topAppLatencyURL: string;
    private topCloudletsForMemory: string;
    private topCloudletsForLatency: string;
    private topCloudletsForCPU: string;
    private operatorUrl: string;
    private usersList: URLSearchParams;
    constructor( private http: Http, private configuration: Configuration,
	private globalServiceObj: GlobalServiceService ) {


        this.headers = new Headers();
        this.headers.append( 'Content-Type', 'application/json' );
        this.headers.append( 'Accept', 'application/json' );
        this.headers.append("accessToken", globalServiceObj.accessToken);
        this.operatorUrl = globalServiceObj.baseURL + configuration.edgeOperatorListURL;

    }

    public getAppsDash( querySel: string ) {
        this.appDashURL = this.globalServiceObj.baseURL + this.configuration.newCoDashboardURL;
        this.companyName = this.globalServiceObj.operator;
        this.memoryUsageURL = this.appDashURL + "tiles/" + this.companyName;
        this.topCloudletsForMemory = this.appDashURL + this.configuration.topCloudlets +
		this.companyName + "/cpuusage";
        this.topCloudletsForLatency = this.appDashURL + this.configuration.topCloudlets +
		this.companyName + "/latency ";
        this.topCloudletsForCPU = this.appDashURL + this.configuration.topCloudlets +
		this.companyName + "/memory";
        if ( querySel == "memoryUsage" ) {
            return this.http.get( this.memoryUsageURL, { headers: this.headers }).
			map(( res: Response ) => res.json() );
        }
        else if ( querySel == "latency" ) {
            return this.http.get( this.topCloudletsForLatency, { headers: this.headers }).
			map(( res: Response ) => res.json() );
        }
        else if ( querySel == "cpuUsage" ) {
            return this.http.get( this.topCloudletsForCPU, { headers: this.headers }).
			map(( res: Response ) => res.json() );
        }
        else if ( querySel == "memory" ) {
            return this.http.get( this.topCloudletsForMemory, { headers: this.headers }).
			map(( res: Response ) => res.json() );
        }

    }

    public getEdgeList() {
        this.usersList = new URLSearchParams(); //  to be added to operator url
        this.usersList.set( this.configuration.pageSize, this.configuration.Limit );
        this.usersList.set( this.configuration.pageNumber, this.configuration.Offset );
        this.usersList.set( "sort_by", "companyName" );
        this.usersList.set( "sort_order", "1" );
        return this.http.get( this.operatorUrl, { headers: this.headers, search: this.usersList }).
		map(( res: Response ) => res.json() );
    }

}
