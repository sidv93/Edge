import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response, URLSearchParams } from "@angular/http";
import "rxjs/add/operator/toPromise";
import { Observable } from "rxjs/Observable";
import { Configuration } from "../app.constants";
import { GlobalServiceService } from "../global-service.service";

@Injectable()
export class SDKManagerService {
    private headers: Headers;
    private uploadSDKUrl: string;
    private deleteSDKUrl: string;
    private listSDKUrl: string;

    constructor( private http: Http,
        private configuration: Configuration,
        private globalservice: GlobalServiceService ) {
        this.listSDKUrl = globalservice.baseURL + configuration.listSDK;
        this.uploadSDKUrl = globalservice.baseURL + configuration.uploadSDK;
        this.deleteSDKUrl = globalservice.baseURL + configuration.deleteSDK;
        this.headers = new Headers();
        this.headers.append( "Content-Type", "application/json" );
        this.headers.append( "Accept", "application/json" );
        this.headers.append( "accessToken", globalservice.accessToken );
    }

    public getSDK() {
        this.headers.set( "Content-Type", "application/json" );
        return this.http.get( this.listSDKUrl, { headers: this.headers } ).
            map(( res: Response ) => res.json() );
    }

    public uploadSDK( attachment: File, language: string, version: string, description: string ) {
        this.headers = new Headers();
        this.headers.append( "Accept", "application/json" );
        this.headers.append( "accessToken", this.globalservice.accessToken );
        let formData: FormData = new FormData();
        formData.append( "files", attachment, attachment.name );
        formData.append("description", description);
        return this.http.put( this.uploadSDKUrl + language + "/" + version + "/" + attachment.name + "/", formData, { headers: this.headers } ).
            map(( res: Response ) => res.json() );
    }

    public deleteSDK(identifier: string) {
        this.headers.set( "Content-Type", "application/json" );
        return this.http.delete( this.deleteSDKUrl + "/" + identifier + "/", { headers: this.headers } ).
            map(( res: Response ) => res.json() );
    }
}
