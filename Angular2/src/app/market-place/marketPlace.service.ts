import { Injectable }    from "@angular/core";
import { Headers, Http, RequestOptions, Response, URLSearchParams } from "@angular/http";
import "rxjs/add/operator/toPromise";
import { Observable } from "rxjs/Observable";
import "rxjs/Rx";
import { Configuration } from "../app.constants";
import {GlobalServiceService} from "../global-service.service";
@Injectable()
export class MarketPlaceService {
    private headers: Headers;
    private actionUrl: string;
    private searchForView: URLSearchParams;
    private searchForUserMS: URLSearchParams;
    private searchForMP: URLSearchParams;
    private searchForRA: URLSearchParams;
    private searchForName: URLSearchParams;
    private sortBy: URLSearchParams;
    private configurationL: Configuration;
    private searchForMSUser: URLSearchParams;
    private searchForMPUser: URLSearchParams;
    private searchForRAUser: URLSearchParams;

    constructor(private http: Http, private configuration: Configuration,
	private globalservice: GlobalServiceService) {
        this.configurationL = configuration;
        this.actionUrl = globalservice.baseURL + "getAllMicroservices";
        this.headers = new Headers();
        this.headers.append("Content-Type", "application/json");
        this.headers.append("Accept", "application/json");
        this.headers.append("accessToken", globalservice.accessToken);
        this.searchForView = new URLSearchParams();
        this.searchForView.set("limit", configuration.Limit);
        this.searchForView.set("offset", configuration.Offset);
        this.searchForView.set("sortCriteria", "microServiceName");
        this.searchForView.set("onboardStatus", "success");
        this.searchForView.set("stage", "certify,deploy");
        this.searchForUserMS = new URLSearchParams();
        this.searchForUserMS.set("limit", configuration.Limit);
        this.searchForUserMS.set("offset", configuration.Offset);
        this.searchForUserMS.set("sortCriteria", "microServiceName");
        this.searchForMP = new URLSearchParams();
        this.searchForMP.set("limit", configuration.twoDivLimit);
        this.searchForMP.set("offset", configuration.twoDivOffset);
        this.searchForMP.set("sortCriteria", "ratings");
        this.searchForMP.set("onboardStatus", "success");
        this.searchForMP.set("stage", "certify,deploy");
        this.searchForRA = new URLSearchParams();
        this.searchForRA.set("limit", configuration.twoDivLimit);
        this.searchForRA.set("offset", configuration.twoDivOffset);
        this.searchForRA.set("sortCriteria", "releaseDate");
        this.searchForRA.set("onboardStatus", "success");
        this.searchForRA.set("stage", "certify,deploy");

        this.searchForMSUser = new URLSearchParams();
        this.searchForMSUser.set("limit", configuration.Limit);
        this.searchForMSUser.set("offset", configuration.Offset);
        this.searchForMSUser.set("sortCriteria", "microServiceName");
        this.searchForMSUser.set("userId", this.globalservice.userId);

        this.searchForMPUser = new URLSearchParams();
        this.searchForMPUser.set("limit", configuration.twoDivLimit);
        this.searchForMPUser.set("offset", configuration.twoDivOffset);
        this.searchForMPUser.set("sortCriteria", "ratings");
        this.searchForMPUser.set("userId", this.globalservice.userId);

        this.searchForRAUser = new URLSearchParams();
        this.searchForRAUser.set("limit", configuration.twoDivLimit);
        this.searchForRAUser.set("offset", configuration.twoDivOffset);
        this.searchForRAUser.set("sortCriteria", "releaseDate");
        this.searchForRAUser.set("userId", this.globalservice.userId);
    }

    public credits = { credits: "1200" };

    public getSortingDetail(sortCriteria: string) {
        let srt = new URLSearchParams();
        srt.set("limit", this.configurationL.Limit);
        srt.set("offset", this.configurationL.Offset);
        srt.set("sortCriteria", sortCriteria);
        srt.set("onboardStatus", "success");
        srt.set("stage", "certify,deploy");
        return this.http.get(this.actionUrl, { headers: this.headers, search: srt })
            .map((res) => res.json());
    }
    public getSortingDetailUser(sortCriteria: string, userId: string) {
        let srt = new URLSearchParams();
        srt.set("limit", this.configurationL.Limit);
        srt.set("offset", this.configurationL.Offset);
        srt.set("sortCriteria", sortCriteria);
        srt.set("userId", this.globalservice.userId);
        return this.http.get(this.actionUrl, { headers: this.headers, search: srt })
            .map((res) => res.json());
    }

    public validateCredits(): any {
        this.actionUrl = this.globalservice.baseURL + this.configuration.msOnboardValidateCredits +
		this.globalservice.userName;
        return this.http.get(this.actionUrl, { headers: this.headers }).map((res) => res.json());
    }

    public search(term: string) {
        let search = new URLSearchParams();
        search.set("limit", this.configurationL.Limit);
        search.set("offset", this.configurationL.Offset);
        search.set("microServiceName", term);
        search.set("onboardStatus", "success");
        search.set("stage", "certify,deploy");
        // search.set('format', 'json');
        return this.http.get(this.actionUrl, { headers: this.headers, search })
            .map((res) => res.json());
    }
    public searchUser(term: string, userId: string) {
        let search = new URLSearchParams();
        search.set("limit", this.configurationL.Limit);
        search.set("offset", this.configurationL.Offset);
        search.set("microServiceName", term);
        search.set("userId", this.globalservice.userId);
        // search.set('format', 'json');
        return this.http.get(this.actionUrl, { headers: this.headers, search })
            .map((res) => res.json());
    }

    public getMarketPlace() {
        return this.http.get(this.actionUrl, { headers: this.headers, search: this.searchForView }).
		map((res: Response) => res.json());
        /*this.http.get(this.actionUrl,{ headers: this.headers ,search: this.searchForMP}).
		map((res:Response) => res.json()),
        this.http.get(this.actionUrl,{ headers: this.headers ,search: this.searchForRA}).
		map((res:Response) => res.json())*/
    }
    public getViewData(): any {
        return this.http.get(this.actionUrl, { headers: this.headers, search: this.searchForMSUser })
            .map((res: Response) => res.json());
    }

    public getMarketPlaceMyServices() {
        return Observable.forkJoin(
            this.http.get(this.actionUrl, { headers: this.headers, search: this.searchForMSUser }).
			map((res: Response) => res.json()),
            this.http.get(this.actionUrl, { headers: this.headers, search: this.searchForMPUser }).
			map((res: Response) => res.json()),
            this.http.get(this.actionUrl, { headers: this.headers, search: this.searchForRAUser }).
			map((res: Response) => res.json()),
        );
    }
}
