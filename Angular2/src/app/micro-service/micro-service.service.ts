import { Injectable }    from "@angular/core";
import { Headers, Http, RequestOptions, Response, URLSearchParams } from "@angular/http";
import "rxjs/add/operator/toPromise";
import { Observable } from "rxjs/Observable";
import "rxjs/Rx";
import { Configuration } from "../app.constants";
import {GlobalServiceService} from "../global-service.service";

@Injectable()
export class MicroServiceService {
    private headers: Headers;
    private actionUrl: string;
    private validateUrl: string;
    private searchForView: URLSearchParams;
    private searchForName: URLSearchParams;
    private sortBy: URLSearchParams;
    private seachForServices: URLSearchParams;
    private marketPlace: URLSearchParams;
    private subscribedServices: URLSearchParams;
    private searchSubscriptions: URLSearchParams;
    private sortAll: URLSearchParams;
    private searchAll: URLSearchParams;

    constructor( private http: Http, private configuration: Configuration,
	private globalservice: GlobalServiceService ) {
        this.actionUrl = globalservice.baseURL + configuration.getAllMicroservices;
        this.headers = new Headers();
        this.headers.append( "Content-Type", "application/json" );
        this.headers.append( "Accept", "application/json" );
        this.headers.append("accessToken", globalservice.accessToken);
        this.searchForView = new URLSearchParams();
        this.searchForView.set( configuration.pageSize, configuration.Limit );
        this.searchForView.set( configuration.pageNumber, configuration.Offset );
        this.searchForView.set( "sort_by", "microServiceName" );
        this.searchForView.set( "sort_order", "1" );
        this.seachForServices = new URLSearchParams();
        this.marketPlace = new URLSearchParams();
        this.marketPlace.set( configuration.pageSize, configuration.Limit );
        this.marketPlace.set( configuration.pageNumber, configuration.Offset );
        this.marketPlace.set( "sort_by", "microServiceName" );
        this.marketPlace.set( "sort_order", "1" );
        this.subscribedServices = new URLSearchParams();
        this.subscribedServices.set( configuration.pageSize, configuration.Limit );
        this.subscribedServices.set( configuration.pageNumber, configuration.Offset );
        this.subscribedServices.set( "sort_by", "microServiceName" );
        this.subscribedServices.set( "sort_order", "1" );
        this.searchSubscriptions = new URLSearchParams();
        this.searchSubscriptions.set( configuration.pageSize, configuration.Limit );
        this.searchSubscriptions.set( configuration.pageNumber, configuration.Offset );
        this.searchSubscriptions.set( "sort_by", "microServiceName" );
        this.searchSubscriptions.set( "sort_order", "1" );
        this.searchAll = new URLSearchParams();
        this.searchAll.set( configuration.pageSize, configuration.Limit );
        this.searchAll.set( configuration.pageNumber, configuration.Offset );
        this.searchAll.set( "sort_by", "microServiceName" );
        this.searchAll.set( "sort_order", "1" );
        this.sortAll = new URLSearchParams();
        this.sortAll.set( configuration.pageSize, configuration.Limit );
        this.sortAll.set( configuration.pageNumber, configuration.Offset );
    }

    public getURLParam() {
        if ( this.globalservice.allMyServices == "myServices" ) {
            this.searchForView.set( "userId", this.globalservice.userName );
            this.searchForView.delete( "onBoardStatus" );
            this.searchForView.delete( "stage" );
        }
        else if ( this.globalservice.allMyServices == "allServices" ) {
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
        this.searchForView.delete( "microServiceName" );
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
        this.searchForView.set( "microServiceName", term );
        this.searchForView.set( "sort_by", "microServiceName" );
        this.getURLParam();
        return this.http.get( this.actionUrl, { headers: this.headers, search: this.searchForView })
            .map(( res ) => res.json() );
    }

    public sortMarketPlace( sortCriteria: string ) {
        if ( this.globalservice.marketPlaceView == "viewSubscriptions" ) {
            this.searchSubscriptions.delete( "microServiceName" );
            this.searchSubscriptions.set( "sort_by", sortCriteria );
            if ( sortCriteria == "rating" ) {
            this.searchSubscriptions.set( "sort_order", "-1" );
        }else{
            this.searchSubscriptions.set( "sort_order", "1" );
        }
            this.searchSubscriptions.set( "userId", this.globalservice.userName );
            return this.http.get( this.globalservice.baseURL + this.configuration.getAllMSSubscriptions,
			{ headers: this.headers, search: this.searchSubscriptions }).map(( res: Response ) => res.json() );
        }
        else if ( this.globalservice.marketPlaceView == "viewAll" ) {
            this.sortAll.set( "sort_by", sortCriteria );
            if ( sortCriteria == "rating" ) {
            this.sortAll.set( "sort_order", "-1" );
        }else{
            this.sortAll.set( "sort_order", "1" );
                }
            this.sortAll.set( "stage", "all" );
            this.sortAll.set( "onBoardStatus", "Success" );
            return this.http.get( this.actionUrl, { headers: this.headers, search: this.sortAll }).
			map(( res: Response ) => res.json() );
        }
    }
    public searchMarketPlace( term: string ) {
        if ( this.globalservice.marketPlaceView == "viewSubscriptions" ) {
            this.searchSubscriptions.set( "microServiceName", term );
            this.searchSubscriptions.set( "sort_by", "microServiceName" );
            this.searchSubscriptions.set( "userId", this.globalservice.userName );
            return this.http.get( this.globalservice.baseURL + this.configuration.getAllMSSubscriptions,
			{ headers: this.headers, search: this.searchSubscriptions }).map(( res: Response ) => res.json() );
        }
        else if ( this.globalservice.marketPlaceView == "viewAll" ) {
            this.searchAll.set( "microServiceName", term );
            this.searchAll.set( "sort_by", "microServiceName" );
            this.searchAll.set( "stage", "all" );
            this.searchAll.set( "onBoardStatus", "Success" );
            return this.http.get( this.actionUrl, { headers: this.headers, search: this.searchAll }).
			map(( res: Response ) => res.json() );
        }
    }

    public getAllMicroServices() {
        this.getURLParam();
        this.searchForView.delete( "microServiceName" );
        return this.http.get( this.actionUrl, { headers: this.headers, search: this.searchForView }).
		map(( res: Response ) => res.json() );
    }

    public getMicroServicesScheduler( services: string[] ) {
        let searchString: string = "";
        for ( let i = 0; i < services.length; i++ ) {
            searchString += services[i] + ",";
        }
        searchString = searchString.substring( 0, searchString.length - 1 );
        this.seachForServices.set( "microservices", searchString );
        return this.http.get( this.actionUrl, { headers: this.headers, search: this.seachForServices }).
		map(( res: Response ) => res.json() );
    }

    public getSubscribedServices() {
        //  this.subscribedServices.set('stage','all');
        //  this.subscribedServices.set('onBoardStatus', 'success');
        this.subscribedServices.set( "userId", this.globalservice.userName );
        return this.http.get( this.globalservice.baseURL + this.configuration.getAllMSSubscriptions,
		{ headers: this.headers, search: this.subscribedServices }).map(( res: Response ) => res.json() );
    }

    public getServicesForMarketPlace() {
        this.marketPlace.set( "stage", "all" );
        this.marketPlace.set( "onBoardStatus", "Success" );
        return this.http.get( this.actionUrl, { headers: this.headers, search: this.marketPlace }).
		map(( res: Response ) => res.json() );
    }
}
