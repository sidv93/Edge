import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response, URLSearchParams } from "@angular/http";
import "rxjs/add/operator/toPromise";
import { Observable } from "rxjs/Observable";
import "rxjs/Rx";
import { Configuration } from "../app.constants";
import {CloudletImages} from "../cloudlet/cloudletPresent";
import {CloudLetOnBoard} from "../common-services/cloudLetOnBoard";
import {GlobalServiceService} from "../global-service.service";
@Injectable()
export class CloudletDetailsService {
    private headers: Headers;
    private cloudletDetailsUrl: string;
    private cloudletImageDetailsUrl: string;
    private searchParameters: URLSearchParams;
    private deleteCloudletURL: string;
    private deleteImageUrl: string;
    constructor( private http: Http, private configuration: Configuration,
	private globalservice: GlobalServiceService ) {
        // this.cloudletDetailsUrl=globalservice.baseURL + configuration.cloudletDetailsUrl;
        // this.cloudletImageDetailsUrl=globalservice.baseURL + configuration.cloudletImageDetailsUrl;
        this.headers = new Headers();
        this.headers.append( "Content-Type", "application/json" );
        this.headers.append( "Accept", "application/json" );
        this.headers.append("accessToken", globalservice.accessToken);
    }
    public getCloudletDetails( cloudletName: string ) {
        this.cloudletDetailsUrl = this.globalservice.baseURL +
            this.configuration.cloudletDetailsUrl + cloudletName + "/";
        // this.cloudletDetailsUrl = this.cloudletDetailsUrl +cloudletName;
        return this.http.get( this.cloudletDetailsUrl, { headers: this.headers }).map(( res ) => res.json() );
    }
    public getCloudletImageDetails( cloudletImage: string ) {
        this.cloudletImageDetailsUrl = this.globalservice.baseURL +
            this.configuration.cloudletImageDetailsUrl + cloudletImage + "/";
        return this.http.get( this.cloudletImageDetailsUrl, { headers: this.headers }).map(( res ) => res.json() );
    }
    public submitDeleteData( cloudletName: string, edgeName: string ): any {
        this.deleteCloudletURL = this.globalservice.baseURL +
            "deleteCloudlets/" + edgeName + "/" + cloudletName + "/";

        return this.http.delete( this.deleteCloudletURL, { headers: this.headers })
            .map(( response: Response ) => <CloudLetOnBoard>response.json() );
    }

    public deleteImage( imageName: string, edgeName: string ) {
        this.deleteImageUrl = this.globalservice.baseURL + "deleteCloudletImage/" + edgeName + "/" + imageName + "/";

        return this.http.delete( this.deleteImageUrl, { headers: this.headers })
            .map(( response: Response ) => <CloudletImages>response.json() );
    }
}
