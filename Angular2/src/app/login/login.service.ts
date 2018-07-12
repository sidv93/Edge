import { Injectable } from "@angular/core";
import { Headers, Http, Response } from "@angular/http";
import "rxjs/add/operator/map";
import { Observable } from "rxjs/Observable";
import { Configuration } from "../app.constants";
import { User } from "./login.model";
import { GlobalServiceService } from '../global-service.service';

@Injectable()
export class LoginService {

    private actionUrl: string;
    private headers: Headers;

    constructor(private http: Http, private configuration: Configuration,
	private globalServiceObj: GlobalServiceService) {
        this.actionUrl = globalServiceObj.baseURL + configuration.loginUrl;

        this.headers = new Headers();
        this.headers.append("Content-Type", "application/json");
        this.headers.append("Accept", "application/json");
    }

    public authenticateUser(loginModel: User): any {
        let toAdd = JSON.stringify({ loginModel });
        return this.http.post(this.actionUrl, toAdd, { headers: this.headers });
    }

}
