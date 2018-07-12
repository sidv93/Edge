import { Injectable }    from "@angular/core";
import { Headers, Http, RequestOptions, Response, URLSearchParams } from "@angular/http";
import "rxjs/add/operator/toPromise";
import { Observable } from "rxjs/Observable";
import "rxjs/Rx";
import { Configuration } from "../app.constants";
import { MicroServiceMetadata } from "../common-services/microServiceMetadata";
import {GlobalServiceService} from "../global-service.service";
import {ResponseOnboard} from "./responseOnboard";

@Injectable()
export class MicroServiceOnboardService {
    private msOnboardValidateNameUrl: string;
    private msOnboardSubmitUrl: string;
    private headers: Headers;
    constructor(private http: Http, private configuration: Configuration,
	private globalServiceObj: GlobalServiceService) {
        this.msOnboardValidateNameUrl = globalServiceObj.baseURL + configuration.msOnboardValidateName;
        this.msOnboardSubmitUrl = globalServiceObj.baseURL + configuration.msOnboardSubmit;

        this.headers = new Headers();
        this.headers.append("Content-Type", "application/json");
        this.headers.append("Accept", "application/json");
        this.headers.append("accessToken", globalServiceObj.accessToken);
    }
    public OnNext(serviceName: string): any {
        let toAdd = JSON.stringify({ microServiceName: serviceName });
        return this.http.post(this.msOnboardValidateNameUrl, toAdd, { headers: this.headers })
            .map((response: Response) => response.json());
        //   return "success"
    }

    public OnSubmit(marketServiceOnboard: MicroServiceMetadata): any {
        let toAdd = JSON.stringify(marketServiceOnboard);
        if (this.globalServiceObj.editMicroService){
			return this.http.put(this.msOnboardSubmitUrl + marketServiceOnboard.microServiceName,
			toAdd, { headers: this.headers }).
			map((response: Response) => <ResponseOnboard> response.json());
		}
        else{
				return this.http.post(this.msOnboardSubmitUrl, toAdd, { headers: this.headers })
                .map((response: Response) => <ResponseOnboard> response.json());
		}
    }

}
