import { Injectable }    from "@angular/core";
import { Headers, Http, RequestOptions, Response, URLSearchParams } from "@angular/http";
import "rxjs/add/operator/toPromise";
import { Observable } from "rxjs/Observable";
import "rxjs/Rx";
import { Configuration } from "../app.constants";
import {GlobalServiceService} from "../global-service.service";

@Injectable()
export class MobileAppService {
    private headers: Headers;
    private actionUrl: string;
    private validateUrl: string;
    private searchForView: URLSearchParams;
    private searchForName: URLSearchParams;
    private sortBy: URLSearchParams;
    private searchForApps: URLSearchParams;

    constructor( private http: Http, private configuration: Configuration,
        private globalservice: GlobalServiceService ) {
        this.actionUrl = globalservice.baseURL + configuration.getAllMobileApps;
        this.headers = new Headers();
        this.headers.append( "Content-Type", "application/json" );
        this.headers.append( "Accept", "application/json" );
        this.headers.append("accessToken", globalservice.accessToken);
        this.searchForView = new URLSearchParams();
        this.searchForView.set( configuration.pageSize, configuration.Limit );
        this.searchForView.set( configuration.pageNumber, configuration.Offset );
        this.searchForView.set( "sort_by", "applicationName" );
        this.searchForView.set( "sort_order", "1" );
        this.searchForApps = new URLSearchParams();
    }

    public getURLParam() {
        if ( this.globalservice.allMyApps == "myApps" ) {
            this.searchForView.set( "userId", this.globalservice.userName );
            this.searchForView.delete( "onBoardStatus" );
            this.searchForView.delete( "stage" );
        }
        else if ( this.globalservice.allMyApps == "allApps" ) {
            this.searchForView.set( "onBoardStatus", "Success" );
            this.searchForView.set( "stage", "all" ); //  all means certify and deploy
            this.searchForView.delete( "userId" );
        }
    }

    public getSortingDetail( sortCriteria: string ) {
        this.searchForView.set( "sort_by", sortCriteria );
        if ( sortCriteria == "rating" ) {
            this.searchForView.set( "sort_order", "-1" );
        }else{
            this.searchForView.set( "sort_order", "1" );
        }
        this.searchForView.delete( "applicationName" );
        this.getURLParam();
        return this.http.get( this.actionUrl, { headers: this.headers, search: this.searchForView })
            .map(( res ) => res.json() );
    }

    public validateCredits(): any {
        this.validateUrl = this.globalservice.baseURL + this.configuration.appOnboardValidateCredits +
            this.globalservice.userName;
        return this.http.get( this.validateUrl, { headers: this.headers }).map(( res ) => res.json() );
    }

    public search( term: string ) {
        this.searchForView.set( "applicationName", term );
        this.searchForView.set( "sort_by", "applicationName" );
        this.getURLParam();
        return this.http.get( this.actionUrl, { headers: this.headers, search: this.searchForView })
            .map(( res ) => res.json() );
    }

    public getAllMobileApps() {
        this.searchForView.delete( "applicationName" );
        this.getURLParam();
        return this.http.get( this.actionUrl, { headers: this.headers, search: this.searchForView }).
            map(( res: Response ) => res.json() );
    }

    public getMobileAppsScheduler( apps: string[] ) {
        let searchString: string = "";
        for ( let i = 0; i < apps.length; i++ ) {
            searchString += apps[i] + ",";
        }
        searchString = searchString.substring( 0, searchString.length - 1 );
        this.searchForApps.set( "applications", searchString );
        return this.http.get( this.actionUrl, { headers: this.headers, search: this.searchForApps }).
            map(( res: Response ) => res.json() );
    }

}
