import { Injectable } from "@angular/core";
import { Headers, Http, Response, RequestOptions, URLSearchParams } from "@angular/http";
import "rxjs/add/operator/toPromise";
import { Observable } from "rxjs/Observable";
import { Configuration } from "../app.constants";
import { GlobalServiceService } from "../global-service.service";

@Injectable()
export class MicroServiceDashboardService {
    private headers: Headers;
    private msDashURL: string;
    private searchForLatency: URLSearchParams;
    private searchForCPUUsage: URLSearchParams;
    private searchForCount: URLSearchParams;
    private searchForSubscription: URLSearchParams;
    private searchForTopAppUsers: URLSearchParams;
    private searchForTopAppLatency: URLSearchParams;
    private userName: string;
    private msSessionURL: string;
    private CPUUsageURL: string;
    private usage: string;
    private microServicesURL: string;
    private subscriptionUrl: string;
    private topMSURL: string;
    private topAppLatencyURL: string;

    constructor( private http: Http, private configuration: Configuration,
	private globalServiceObj: GlobalServiceService ) {
        this.msDashURL = globalServiceObj.baseURL + configuration.msGraphURL;
        this.userName = globalServiceObj.userName;
        this.msSessionURL = this.msDashURL + configuration.msSessionURL + this.userName + "/all/DAY";
        this.CPUUsageURL = this.msDashURL + configuration.mobileAppCPUURL + this.userName + "/all/HOUR";
        this.usage = this.msDashURL + configuration.msUsage + this.userName + "/HOUR";

        this.topMSURL = this.msDashURL + configuration.topMicroServicesURL + this.userName + "/apicalls/DAY";
        //this.topAppLatencyURL = this.msDashURL + configuration.topAppURL + this.userName + "/latency/WEEK";
        this.microServicesURL = this.msDashURL + configuration.topMicroServicesURL +
		this.userName + "/cpuusage/DAY";

        this.headers = new Headers();
        this.headers.append( 'Content-Type', 'application/json' );
        this.headers.append( 'Accept', 'application/json' );
        this.headers.append("accessToken", globalServiceObj.accessToken);

    }

    public getAppsDash( querySel: string ) {


        if ( querySel == "session" ) {
            return this.http.get( this.msSessionURL, { headers: this.headers }).
			map(( res: Response ) => res.json() )
        }
        if ( querySel == "cpuUsage" ) {
            return this.http.get( this.CPUUsageURL, { headers: this.headers }).
			map(( res: Response ) => res.json() )
        }
        if ( querySel == "usage" ) {
            return this.http.get( this.usage, { headers: this.headers }).
			map(( res: Response ) => res.json() )
        }
        if ( querySel == "topMSURL" ) {
            return this.http.get( this.topMSURL, { headers: this.headers }).
			map(( res: Response ) => res.json() )
        }
        if ( querySel == "microServicesURL" ) {
            return this.http.get( this.microServicesURL, { headers: this.headers }).
			map(( res: Response ) => res.json() )
        }

    }
}
