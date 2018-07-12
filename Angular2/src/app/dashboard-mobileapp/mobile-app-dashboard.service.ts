import { Injectable } from "@angular/core";
import { Headers, Http, Response, RequestOptions, URLSearchParams } from "@angular/http";
import "rxjs/add/operator/toPromise";
import { Observable } from "rxjs/Observable";
import { Configuration } from "../app.constants";
import { GlobalServiceService } from "../global-service.service";

@Injectable()
export class MobileAppDashboardService {
    private headers: Headers;
    private appDashURL: string;
    private searchForLatency: URLSearchParams;
    private searchForCPUUsage: URLSearchParams;
    private searchForCount: URLSearchParams;
    private searchForSubscription: URLSearchParams;
    private searchForTopAppUsers: URLSearchParams;
    private searchForTopAppLatency: URLSearchParams;
    private userName: string;
    private appLatencyURL: string;
    private CPUUsageURL: string;
    private usersCountURL: string;
    private microServicesURL: string;
    private subscriptionUrl: string;
    private topAppUserCountURL: string;
    private topAppLatencyURL: string;

    constructor( private http: Http, private configuration: Configuration,
	private globalServiceObj: GlobalServiceService ) {
        this.appDashURL = globalServiceObj.baseURL + configuration.mobileAppDashboardURL;
        this.userName = globalServiceObj.userName;
        this.appLatencyURL = this.appDashURL + configuration.mobileAppLatencyURL + this.userName + "/all/DAY";
        this.CPUUsageURL = this.appDashURL + configuration.mobileAppCPUURL + this.userName + "/all/HOUR";
        this.usersCountURL = this.appDashURL + configuration.mobileAppUsersURL + this.userName + "/all/DAY";
        this.subscriptionUrl = this.appDashURL + configuration.subscriptionURL + this.userName;
        this.topAppUserCountURL = this.appDashURL + configuration.topAppURL + this.userName + "/usercount/DAY";
        this.topAppLatencyURL = this.appDashURL + configuration.topAppURL + this.userName + "/latency/DAY";
        this.microServicesURL = this.appDashURL + configuration.topMicroServicesURL + this.userName + "/apicalls/DAY";

        this.headers = new Headers();
        this.headers.append( 'Content-Type', 'application/json' );
        this.headers.append( 'Accept', 'application/json' );
        this.headers.append("accessToken", globalServiceObj.accessToken);
        /*
                this.searchForLatency = new URLSearchParams();
                this.searchForLatency.set('userId',this.userName);
                this.searchForLatency.set('applicationName','all');
                this.searchForLatency.set('duration','DAY');

                this.searchForSubscription = new URLSearchParams();
                this.searchForSubscription.set('userId',this.userName);

                this.searchForTopAppUsers = new URLSearchParams();
                this.searchForTopAppUsers.set('userId',this.userName);
                this.searchForTopAppUsers.set('metric','usercount');
                this.searchForTopAppUsers.set('duration','WEEK');

                this.searchForTopAppLatency = new URLSearchParams();
                this.searchForTopAppLatency.set('userId',this.userName);
                this.searchForTopAppLatency.set('metric','latency');
                this.searchForTopAppLatency.set('duration','DAY');

                this.searchForCPUUsage = new URLSearchParams();
                this.searchForCPUUsage.set('userId',this.userName);
                this.searchForCPUUsage.set('applicationName','all');
                this.searchForCPUUsage.set('duration','HOUR');

                this.searchForCount = new URLSearchParams();
                this.searchForCount.set('userId',this.userName);
                this.searchForCount.set('applicationName','all');
                this.searchForCount.set('duration','DAY');
        */
    }

    public getAppsDash( querySel: string ) {
        if ( querySel == "latency" ) {
            return this.http.get( this.appLatencyURL, { headers: this.headers }).
			map(( res: Response ) => res.json() );
        }
        else if ( querySel == "usersperday" ) {
            return this.http.get( this.usersCountURL, { headers: this.headers }).
			map(( res: Response ) => res.json() );
        }
        else if ( querySel == "subscription" ) {
            return this.http.get( this.subscriptionUrl, { headers: this.headers }).
			map(( res: Response ) => res.json() );
        }
        else if ( querySel == "appDash" ) {
            return this.http.get( this.topAppUserCountURL, { headers: this.headers }).
			map(( res: Response ) => res.json() );
        }
        else if ( querySel == "appDashLate" ) {
            return this.http.get( this.topAppLatencyURL, { headers: this.headers }).
			map(( res: Response ) => res.json() );
        }
        else if ( querySel == "msDash" ) {
            return this.http.get( this.microServicesURL, { headers: this.headers }).
			map(( res: Response ) => res.json() );
        }
    }
}
