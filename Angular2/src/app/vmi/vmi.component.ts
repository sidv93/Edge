import { Component, OnInit } from '@angular/core';
import { Configuration } from '../app.constants';
import { Router } from '@angular/router';
import {GlobalServiceService} from '../global-service.service';
import {AppUsageDetailsForVmi,client_Report,session_Details} from '../common-services/vmiUsageModel';
import {AppUsageDetailsForVMI} from '../vmi/vmi.service';

@Component({
  selector: 'app-vmi',
  templateUrl: './vmi.component.html',
  providers: [AppUsageDetailsForVMI]
})
export class VMIComponent implements OnInit {

	private errorMessage : string;
	public vmiData : AppUsageDetailsForVmi = new AppUsageDetailsForVmi();
	private date : Date = new Date(); 
	public Client_Report : client_Report[] = [];
	public count : number =0;
	public arr : boolean[] = [];
	constructor(private publicConfiguration: Configuration, private router: Router,
		private globalServiceObj: GlobalServiceService, public appUsageDetails : AppUsageDetailsForVMI)
	{
		console.log("Inside VMI Monitoring constructor");
	}
	
	ngOnInit() {
		console.log("Inside VMI Monitoring --- ngOnInit");
		this.globalServiceObj.recordForVmiMonitoring= false;
		this.fetchVmiData();
	}
	fetchVmiData() { 
		console.log("Inside VMI Monitoring -- fetchVmiData");
		this.appUsageDetails.getAppMonitoring().subscribe(
	         data => {
	              this.vmiData = <AppUsageDetailsForVmi>data;
		      console.log(JSON.stringify(this.vmiData));
	              this.getVmiData(this.count);
	          },
	
	      	(error) => {
	            if (error.status){
	              this.errorMessage = error.json().message + " " + error.status;
	              }
	            else{
	              this.errorMessage = error.json().message;
	            }
	
	          }
	      );
  	}
	getVmiData( i : number){
		
		this.globalServiceObj.recordForVmiMonitoring= true;	
		this.count=i;	
			
		this.Client_Report = this.vmiData.client_Report;
		console.log("client report "+this.Client_Report);
		let dataDiv = document.getElementById("session");
		
	    	if(dataDiv.style.visibility == "hidden")
	    	{
	        	 dataDiv.style.visibility = "visible";
	    	}				
		
	}
}

