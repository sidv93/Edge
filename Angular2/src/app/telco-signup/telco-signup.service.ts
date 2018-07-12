import { Injectable } from "@angular/core";
import { Headers, Http, Response } from "@angular/http";
import "rxjs/add/operator/map";
import { Observable } from "rxjs/Observable";
import { Configuration } from "../app.constants";
import { SignUp } from "../sign-up/sign-up.model";
import { GlobalServiceService } from "../global-service.service";

@Injectable()
export class TelcoSignUpService {
    private actionUrl: string;
    private headers: Headers;

    constructor(private http: Http, private configuration: Configuration,
        private globalServiceObj: GlobalServiceService) {
        this.actionUrl = globalServiceObj.baseURL + configuration.createSignUpUrl;
        this.headers = new Headers();
        this.headers.append("Content-Type", "application/json");
        this.headers.append("Accept", "application/json");
        this.headers.append("accessToken", globalServiceObj.accessToken);
    }

    public createSignUp(telcoSignUpObject: SignUp): any {
        let toAdd = JSON.stringify({ telcoSignUpObject });
        return this.http.post(this.actionUrl, toAdd, { headers: this.headers })
            .map((response: Response) => <SignUp>response.json());
    }
}
