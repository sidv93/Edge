import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';
import { Configuration } from '../app.constants';
import { GlobalServiceService } from '../global-service.service';

@Injectable()
export class AppUsageDetailsForVMI {
	private headers: Headers;
	private appUsageURL: string;
	
	constructor(private http: Http,private configuration: Configuration,private globalServiceObj: GlobalServiceService)
	{
		this.appUsageURL = globalServiceObj.baseURL + configuration.vmiURL;	
		this.headers = new Headers();
		this.headers.append('Content-Type', 'application/json');		
		this.headers.append('Accept', 'application/json');
		
	}

	getAppUsage()
	{	
		return this.http.get(this.appUsageURL,{ headers: this.headers}).map((res:Response) => res.json());
	}

	getAppMonitoring(){
		return this.http.get(this.appUsageURL,{ headers: this.headers}).map((res:Response) => res.json());
	
	}
}
