import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response, URLSearchParams } from "@angular/http";
import "rxjs/add/operator/toPromise";
import { Observable } from "rxjs/Observable";
import { Configuration } from "../app.constants";
import { GlobalServiceService } from "../global-service.service";
import { CardDetails, Credits, Profile } from "./profile.model";

@Injectable()
export class ProfileServiceService {
    private headers: Headers;
    private userAPIURL: string;
    private saveUserURL: string;
    private addCreditsURL: string;
    private userUpdateURL: string;
    private userIDParam: URLSearchParams;
    private companyName: string = "Aricent";

    constructor( private http: Http, private configuration: Configuration,
        private globalServiceObj: GlobalServiceService ) {
        this.userAPIURL = this.globalServiceObj.baseURL + this.configuration.USER_PROFILE_URL;
        this.saveUserURL = this.globalServiceObj.baseURL + this.configuration.SAVE_USER_URL;
        this.addCreditsURL = this.globalServiceObj.baseURL + this.configuration.ADD_CREDITS_URL;

        this.headers = new Headers();
        this.headers.append( "Content-Type", "application/json" );
        this.headers.append( "Accept", "application/json" );
        this.headers.append("accessToken", globalServiceObj.accessToken);

        this.userIDParam = new URLSearchParams();
        this.userIDParam.set( "userId", this.globalServiceObj.userName );
        /*  this.userCredits = new URLSearchParams();
          this.userCredits.set("userId", this.globalServiceObj.userName);
          this.userCredits.set("fields", "credits");

          this.userCardInfo = new URLSearchParams();
          this.userCardInfo.set("userId", this.globalServiceObj.userName);
          this.userCardInfo.set("fields", "cardinfo");

          this.userCreditInfo = new URLSearchParams();
          this.userCreditInfo.set("fields", "credits");

          this.userCircleSearch = new URLSearchParams();
          this.userCircleSearch.set("company", this.companyName);*/
    }

    public getUserDetail() {
        return this.http.get( this.userAPIURL, {
            headers: this.headers,
            search: this.userIDParam
        }).map(( res: Response ) => res.json() );
    }
    public saveProfileInfo( profileInfo: Profile ) {
        let profileInfoToAdd = JSON.stringify( profileInfo );
        return this.http.put( this.saveUserURL, profileInfoToAdd, { headers: this.headers })
            .map(( response: Response ) => <Profile>response.json() );
    }
    public submitCreditInfo( creditInfo: Credits ) {
        let creditsToAdd = JSON.stringify( creditInfo );
        return this.http.post( this.addCreditsURL, creditsToAdd, { headers: this.headers })
            .map(( response: Response ) => <any>response.json() );
    }
    /*public updateUserDetail(editUserModel: Profile) {
        let toEdit = JSON.stringify( editUserModel );
        return this.http.put(this.userAPIURL, toEdit, { headers: this.headers })
		.map((response: Response) => <any> response.json());
    }

   public getCardDetail() {
        return this.http.get(this.userAPIURL, { headers: this.headers,
		search: this.userCardInfo }).map((res: Response) => res.json());
  }*/

}
