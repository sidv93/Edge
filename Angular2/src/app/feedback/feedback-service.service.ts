import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response, URLSearchParams } from "@angular/http";
import "rxjs/add/operator/toPromise";
import { Observable } from "rxjs/Observable";
import { Configuration } from "../app.constants";
import { GlobalServiceService } from "../global-service.service";
import { FeedbackModal } from "./feedback.modal";

@Injectable()
export class FeedbackServiceService {
    private headers: Headers;
    private saveFeedbackURL: string;
    private saveFeedbackParam: URLSearchParams;
    private listFeedbackURL: string;
    private listFeedbackParam: URLSearchParams;

    constructor( private http: Http, private configuration: Configuration,
        private globalServiceObj: GlobalServiceService ) {
        this.saveFeedbackURL = this.globalServiceObj.baseURL + this.configuration.FEEDBACK_FETCH_URL;
        this.listFeedbackURL = this.globalServiceObj.baseURL + this.configuration.getFeedback;
        this.headers = new Headers();
        this.headers.append( "Content-Type", "application/json" );
        this.headers.append( "Accept", "application/json" );
        this.headers.append( "accessToken", globalServiceObj.accessToken );
        this.listFeedbackParam = new URLSearchParams();
        this.listFeedbackParam.set( configuration.pageSize, configuration.Limit );
        this.listFeedbackParam.set( configuration.pageNumber, configuration.Offset );
        this.listFeedbackParam.set( "sort_by", "timestamp" );
        this.listFeedbackParam.set( "sort_order", "-1" );
    }

    public saveFeedback( attachment: File[], feedbackInfo: FeedbackModal ) {
        this.headers = new Headers();
        this.headers.append( "Accept", "application/json" );
        this.headers.append( "accessToken", this.globalServiceObj.accessToken );
        let feedbackInfoToAdd = JSON.stringify( feedbackInfo );
        let fileCount: number = attachment.length;
        let formData: FormData = new FormData();
        for ( let i = 0; i < fileCount; i++ ) {
            formData.append( "files", attachment[i], attachment[i].name );
        }
        formData.append( "comments", feedbackInfo.comments );
        formData.append( "category", feedbackInfo.category );
        return this.http.post( this.saveFeedbackURL, formData, { headers: this.headers } )
            .map(( response: Response ) => <FeedbackModal> response.json() );
    }

    public getFeedback() {
        this.listFeedbackParam.delete("category");
        return this.http.get( this.listFeedbackURL, { headers: this.headers, search: this.listFeedbackParam } )
            .map(( response: Response ) => response.json() );
    }

    public sort( sortString: string ) {
        if ( sortString.toLowerCase() === "others") {
          this.listFeedbackParam.delete("category");
        } else {
          this.listFeedbackParam.set( "category", sortString );
        }
        return this.http.get( this.listFeedbackURL, { headers: this.headers, search: this.listFeedbackParam } )
            .map(( response: Response ) => response.json() );
    }

}
