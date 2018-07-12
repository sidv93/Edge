import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response, URLSearchParams } from "@angular/http";
import "rxjs/add/operator/toPromise";
import { Observable } from "rxjs/Observable";
import { Configuration } from "../app.constants";
import { Approval } from "../common-services/approval";
import { MicroServiceMetadata } from "../common-services/microServiceMetadata";
import { GlobalServiceService } from "../global-service.service";

@Injectable()
export class MicroServiceDetailsService {
    private headers: Headers;
    private serviceDetailURL: string;
    private editMSURL: string;
    private deleteMSURL: string;
    private searchForDetail: URLSearchParams;
    private deleteDetail: URLSearchParams;
    private searchSubscribed: URLSearchParams;
    private search: URLSearchParams;
    private microServiceName: string;
    private category: string;
    private editMAURL: string;
    private errorURL: string;
    private approveURL: string;
    private msRatingURL : string;
    private sandboxingURL : string;
    private ratingsReview: string;
    private ratingsCount: string;
    private topReviews: string;

    constructor( private http: Http, private configuration: Configuration,
	private globalServiceObj: GlobalServiceService ) {
        this.serviceDetailURL = globalServiceObj.baseURL + configuration.getMicroService;
        this.errorURL = globalServiceObj.baseURL + configuration.viewErrorsLinkMS;
        this.approveURL = globalServiceObj.baseURL + configuration.approveLinkMS;
        this.msRatingURL = globalServiceObj.baseURL + configuration.msRatingUrl;
        this.microServiceName = globalServiceObj.microServiceName;
        this.sandboxingURL = globalServiceObj.baseURL + configuration.MSSandboxing;
        this.ratingsReview = globalServiceObj.baseURL + configuration.getRatingReviews;
        this.ratingsCount= globalServiceObj.baseURL + configuration.getCountOfRecords;
        this.topReviews= globalServiceObj.baseURL + configuration.topReviews;
        this.search = new URLSearchParams();
        this.search.set( configuration.pageSize, configuration.Limit );
        this.search.set( configuration.pageNumber, configuration.Offset );
        this.search.set( "sort_by", "timestamp");
        this.search.set( "sort_order", "-1" );
        this.search.set( "microServiceName", this.microServiceName );
        this.headers = new Headers();
        this.headers.append( "Content-Type", "application/json" );
        this.headers.append( "Accept", "application/json" );
        this.headers.append("accessToken", globalServiceObj.accessToken);
        this.searchForDetail = new URLSearchParams();
        this.searchForDetail.set( "microServiceName", this.microServiceName );
    }

    public getServiceDetail( microServiceName: string ) {
        return this.http.get( this.serviceDetailURL + "/" + microServiceName,
		{ headers: this.headers }).map(( res: Response ) => res.json() );
    }

    public submitDeleteData(): any {
        //   let toDelete = JSON.stringify({ deleteDataModel });
        this.deleteMSURL = this.serviceDetailURL + "/" + this.microServiceName;

        return this.http.delete( this.deleteMSURL, { headers: this.headers })
            .map(( response: Response ) => <MicroServiceMetadata>response.json() );
    }

    public submitEditData( editDataModel: MicroServiceMetadata ): any {
        let toAdd = JSON.stringify( { editDataModel });
        this.editMAURL = this.serviceDetailURL + "/" + this.microServiceName;
        return this.http.put( this.editMAURL, toAdd, { headers: this.headers })
            .map(( response: Response ) => <MicroServiceMetadata>response.json() );
    }

    /*
     public getSubscribedServices(allMicroServiceName: string []): any {
             this.searchSubscribed = new URLSearchParams()
             let param: string ="";
             let count: number =0;
             for (let value of allMicroServiceName){
               if ( count == 0)
               {
                   param = param + value;
               }
               else
               {
                   param = param + "," + value;
               }
               count++;
           }
               this.searchSubscribed.set('microServiceName',param);
             this.http.get(this.similarAppURL,{ headers: this.headers, search: this.searchSubscribed}).
			 map((res:Response) => res.json())

     }
     */

    public getSubscribedServices( microServiceNamePass: string ): any {
        // return this.http.get(this.similarAppURL+"/"+microServiceNamePass,{ headers: this.headers }).map((res:Response) => res.json())
    }

    public getMicroServiceEditDetail( microServiceNamePass: string ): any {
        return this.http.get( this.serviceDetailURL + "/" + microServiceNamePass, { headers: this.headers }).
		map(( res: Response ) => res.json() );
    }

    public getErrorDetail( selectedErrorService: string ): any {

        return this.http.get( this.errorURL + "/" + selectedErrorService, { headers: this.headers }).
		map(( res: Response ) => res.json() );
    }

    public approveService( userId: string, userInput: string, serviceName: string ): any {
        return this.http.post( this.approveURL + "/" + serviceName + "/" + userInput,null, { headers: this.headers }).
		map(( res: Response ) => res.json() );
    }

    public getEndpoints() {
        return this.http.get(this.sandboxingURL + this.microServiceName, {headers: this.headers})
          .map((res : Response) => res.json());
    }

    public submitRating(feedbackObj : any) {
        return this.http.post( this.msRatingURL,feedbackObj, { headers: this.headers }).
    map(( res: Response ) => res.json() );
    }

    public getRatings(star : string) {
      this.search.set('rating',star);
      return this.http.get(this.ratingsReview, { headers : this.headers, search: this.search}).
      map((res : Response) => res.json());
    }

    public editReview(ratings : any) {
      return this.http.put( this.msRatingURL,ratings, { headers: this.headers }).
      map(( res: Response ) => res.json() );
    }

    public getUserRatings() {
      this.searchForDetail.delete('rating');
      return this.http.get(this.msRatingURL, { headers : this.headers, search: this.searchForDetail}).
      map((res : Response) => res.json());
    }

    public getCountOfRecords() {
      this.searchForDetail.delete('rating');
      return this.http.get(this.ratingsCount, { headers : this.headers, search: this.searchForDetail}).
      map((res : Response) => res.json());
    }

    public getTopReviews() {
      this.search.delete('rating');
      return this.http.get(this.topReviews, { headers : this.headers, search: this.search}).
      map((res : Response) => res.json());
    }
}
