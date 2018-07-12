import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response, URLSearchParams } from "@angular/http";
import "rxjs/add/operator/toPromise";
import { Observable } from "rxjs/Observable";
import "rxjs/Rx";
import { Configuration } from "../app.constants";
import {GlobalServiceService} from "../global-service.service";
import { CloudletImages } from "./cloudletPresent";

@Injectable()
export class CloudletListingService {

    private headers: Headers;
    private cloudletListingUrl: string;
    private cloudletImageURL: string;
    private searchParameters: URLSearchParams;
    private searchForCloudlets: URLSearchParams;
    private cloudletOperatorUrl: string;
    private searchForOperators: URLSearchParams;
    private searchForImages: URLSearchParams;
    private usersList: URLSearchParams;
    private edgeList: URLSearchParams;
    private operatorUrl: string;
    private imageUploadUrl: string;
    private edgeValidateUrl: string;
    private edgeListingUrl: string;

    constructor( private http: Http, private configuration: Configuration,
	private globalservice: GlobalServiceService ) {
        // 	this.cloudletListingUrl = globalservice.baseURL + configuration.cloudletFetchingURL;
        this.headers = new Headers();
        this.headers.append( "Content-Type", "application/json" );
        this.headers.append( "Accept", "application/json" );
        this.headers.append("accessToken", globalservice.accessToken);
        this.searchParameters = new URLSearchParams();
        // this.searchParameters.set('userId',globalservice.userName);
        //  this.searchParameters.set(configuration.pageSize,configuration.Limit);
        //  this.searchParameters.set(configuration.pageNumber,configuration.Offset);
        //  this.searchParameters.set('sort_order',"1");

        this.searchForCloudlets = new URLSearchParams();
        this.searchForOperators = new URLSearchParams();
        this.searchForImages = new URLSearchParams();
    }

    public getCloudletList() {
        this.setURLParams( 1 );
        this.usersList = new URLSearchParams(); //  to be added to operator url
        this.usersList.set( this.configuration.pageSize, this.configuration.Limit );
        this.usersList.set( this.configuration.pageNumber, this.configuration.Offset );
        this.usersList.set( "sort_by", "companyName" );
        this.usersList.set( "sort_order", "1" );
        this.searchParameters.set( "sort_by", "cloudletName" );
        this.cloudletListingUrl = this.globalservice.baseURL + this.configuration.cloudletFetchingURL;
        this.operatorUrl = this.globalservice.baseURL + this.configuration.edgeOperatorListURL;

        // 	return this.http.get(this.cloudletListingUrl,  {headers: this.headers ,search: this.searchParameters })
        //   .map(res => res.json());
        return Observable.forkJoin(
            this.http.get( this.cloudletListingUrl, { headers: this.headers, search: this.searchParameters })
                .map(( res: Response ) => res.json() ),
            this.http.get( this.operatorUrl, { headers: this.headers, search: this.usersList }).
			map(( res: Response ) => res.json() ),
        );
    }

    public getImageList() {
        this.setURLParams( 2 );
        this.searchParameters.set( "sort_by", "imageName" );
        this.cloudletImageURL = this.globalservice.baseURL + this.configuration.cloudletImageURL;
        return this.http.get( this.cloudletImageURL, { headers: this.headers, search: this.searchParameters })
            .map(( res: Response ) => res.json() );


    }

    public getEdgeList() {
        this.edgeList = new URLSearchParams();
        this.edgeList.set( this.configuration.pageSize, this.configuration.Limit );
        this.edgeList.set( this.configuration.pageNumber, this.configuration.Offset );
        this.edgeList.set( "sort_by", "edgeName" );
        this.edgeList.set( "sort_order", "1" );
        this.edgeListingUrl = this.globalservice.baseURL + this.configuration.edgeFetchingURL;
        return this.http.get( this.edgeListingUrl, { headers: this.headers, search: this.edgeList }).
		map(( res: Response ) => res.json() );
    }

    public getSortingDetail( sortCriteria: string ) {
        this.setURLParams( this.globalservice.cloudletsFlag );
        if ( this.globalservice.cloudletsFlag == 1 ) {
            if ( sortCriteria != "0" )
                this.searchParameters.set( "operator", sortCriteria );
            return this.http.get( this.cloudletListingUrl, { headers: this.headers, search: this.searchParameters })
                .map(( res ) => res.json() );
        }
        else if ( this.globalservice.cloudletsFlag == 2 ) {
            if ( sortCriteria != "0" )
                this.searchParameters.set( "edgeName", sortCriteria );
            return this.http.get( this.cloudletImageURL, { headers: this.headers, search: this.searchParameters })
                .map(( res ) => res.json() );
        }
    }

    public setURLParams( tab: number ) {
        this.searchParameters = new URLSearchParams();
        // this.searchParameters.set('userId',globalservice.userName);
        this.searchParameters.set( this.configuration.pageSize, this.configuration.Limit );
        this.searchParameters.set( this.configuration.pageNumber, this.configuration.Offset );
        this.searchParameters.set( "sort_order", "1" );
        if ( tab == 1 ) {
            this.searchParameters.set( "sort_by", "cloudletName" );
            // this.searchParameters.set('cloudletName', term);
        }
        else if ( tab == 2 ) {
            this.searchParameters.set( "sort_by", "imageName" );
            // this.searchParameters.set('imageName', term);
        }
        else if ( tab == 3 ) {
            this.searchParameters.set( "sort_by", "userId" );
            // this.searchParameters.set('imageName', term);
        }
    }
    public search( term: string ) {

        this.setURLParams( this.globalservice.cloudletsFlag );
        if ( this.globalservice.cloudletsFlag == 1 ) {
            this.searchParameters.set( "cloudletName", term );
            return this.http.get( this.cloudletListingUrl, { headers: this.headers, search: this.searchParameters })
                .map(( res ) => res.json() );
        }
        else if ( this.globalservice.cloudletsFlag == 2 ) {
            this.searchParameters.set( "imageName", term );
            return this.http.get( this.cloudletImageURL, { headers: this.headers, search: this.searchParameters })
                .map(( res ) => res.json() );
        }
    }

    public getCloudlets( cloudlets: string[] ) {
        let searchString = "";
        for ( let i = 0; i < cloudlets.length; i++ ) {
            searchString = searchString + cloudlets[i] + ",";
        }

        searchString = searchString.substring( 0, searchString.length - 1 );
        this.searchForCloudlets.set( "cloudlets", searchString );
        return this.http.get( this.cloudletListingUrl, { headers: this.headers, search: this.searchForCloudlets })
            .map(( res ) => res.json() );

    }

    public getCloudletImages( images: string[] ) {
        let searchString = "";
        for ( let i = 0; i < images.length; i++ ) {
            searchString = searchString + images[i] + ",";
        }

        searchString = searchString.substring( 0, searchString.length - 1 );
        this.searchForImages.set( "cloudletImages", searchString );
        return this.http.get( this.cloudletImageURL, { headers: this.headers, search: this.searchForImages })
            .map(( res ) => res.json() );

    }

    public getOperators() {
        this.setURLParams( 3 );
        return this.http.get( this.cloudletOperatorUrl, { headers: this.headers, search: this.searchForOperators })
            .map(( res ) => res.json() );
    }

    public uploadImage( image: CloudletImages ) {
        this.imageUploadUrl = this.globalservice.baseURL + this.configuration.cloudletImageUploadUrl
            + "/" + image.imageName + "/" + image.edgeName;
        return this.http.post( this.imageUploadUrl, image, { headers: this.headers })
            .map(( res ) => res.json() );
    }

    public validateImageName( imageName: string ): any {
        this.edgeValidateUrl = this.globalservice.baseURL + this.configuration.cloudletImageValidateUrl;
        let toAdd = JSON.stringify( { imageName });
        return this.http.post( this.edgeValidateUrl, toAdd, { headers: this.headers })
            .map(( response: Response ) => response.json() );
    }
}
