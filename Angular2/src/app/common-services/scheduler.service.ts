import { Injectable } from "@angular/core";
import { Headers, Http, Response, URLSearchParams } from "@angular/http";
import "rxjs/add/operator/map";
import { Observable } from "rxjs/Observable";
import { Configuration } from "../app.constants";
import { SignUp } from "../sign-up/sign-up.model";
import { GlobalServiceService } from "../global-service.service";

@Injectable()
export class SchedulerService {
    private fetchOnboardStatusURL: string;
    private headers: Headers;
    private fetchOnboardStatus: URLSearchParams;

    constructor( private http: Http, private configuration: Configuration,
        private globalservice: GlobalServiceService ) {
        this.fetchOnboardStatusURL = globalservice.baseURL + configuration.getMicroServiceOnboardStatus;
        this.headers = new Headers();
        this.headers.append( "Content-Type", "application/json" );
        this.headers.append( "Accept", "application/json" );
    }
    public callService( microServiceName: string ): any {
        this.fetchOnboardStatus = new URLSearchParams();
        this.fetchOnboardStatus.set( "fields", "onBoardStatus" );
        this.fetchOnboardStatusURL = this.fetchOnboardStatusURL + "/" + microServiceName;
        return this.http.get( this.fetchOnboardStatusURL,
            { headers: this.headers, search: this.fetchOnboardStatus })
            .map(( res: Response ) => res.json() );

        /*  return this.http.get(this.fetchOnboardStatusURL,
		{ headers: this.headers, search: this.fetchOnboardStatus})
              .map(res => res.json());*/
    }
}
