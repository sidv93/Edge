import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import { Router } from "@angular/router";
import * as moment from "moment";
import { Configuration } from "../app.constants";
import { GlobalServiceService } from "../global-service.service";
import {BillingService} from "./billing.service";
import {CreditsConsumed, CreditsEarned, MonthlyNewco, MonthlyTelco,
    NewcoBilling, Period, PeriodMS, TelcoBilling} from "./billingModel";
declare const jQuery: any;
import { SessionTimeout } from "../common-services/session-timeout";

@Component( {
    selector: "app-billing",
    templateUrl: "./billing.component.html",
    styleUrls: ["./billing.component.css"],
    providers: [Configuration, BillingService,SessionTimeout],
})

export class BillingComponent implements OnInit {

    public tableDetails: CreditsConsumed = new CreditsConsumed();
    public tableDetailsMS: CreditsEarned = new CreditsEarned();
    public tableDetailsTelco: TelcoBilling = new TelcoBilling();
    public tableDetailsNewco: NewcoBilling = new NewcoBilling();
    public creditsUsed: number[] = [];
    public totalRevenue: number;
    public totalCharges: number;
    public initialItems: number;
    public calendar: boolean = false;
    public startDate = new Date();
    public errorMessage: string;
    public loading:boolean = false;
    public monthArray: Array<any> = [{ "month": "January", "value": "01" }, { "month": "February", "value": "02" },
        { "month": "March", "value": "03" }, { "month": "April", "value": "04" }, { "month": "May", "value": "05" },
        { "month": "June", "value": "06" }, { "month": "July", "value": "07" }, { "month": "August", "value": "08" },
        { "month": "September", "value": "09" }, { "month": "October", "value": "10" },
		{ "month": "November", "value": "11" },
        { "month": "December", "value": "12" }];
    public calenderOptions = {

        initialDate: new Date(),
        format: "YYYY-MM-DD",
        maxDate: new Date(),
    };
    public finalDateArray: Array<any> = [];
    private roleType: string;
    private count: number = 0;
    private dateFormatString: string = null;
    private calendarValue: string;
    private currentYear: number;
    private countInd: number = 0;
    public errorApp : boolean = false;
    public errorMS : boolean = false;
    public errorNewCo : boolean = false;
    public errorTelco : boolean = false;

    constructor( private configuration: Configuration, private router: Router,
        private globalServiceObj: GlobalServiceService, private billingService: BillingService ,private sessionTimeout : SessionTimeout) {
        // 	let today = new Date();
        //   // this.calendarValue=today.toDateString().split(' ')[1];
        // 	let mm = today.getMonth()+1;
        // 	let mon:string;
        //
        // 	let yyyy = today.getFullYear();
        // 	if(mm<10){
        // 		 mon='0'+mm;
        // 	}
        //
        // 	let currentDate = mon+'-'+yyyy;
        //
        // 	this.calendarValue = currentDate;
        //   this.dateFormatString=this.calendarValue;
    }

    public ngOnInit() {

        //     this.calendarValue = moment().format("YYYY-MM-DD");
        const today = new Date();
        const mm = today.getMonth() + 1;
        let mon: string;

        const yyyy = today.getFullYear();
        this.currentYear = yyyy;
        if ( mm < 10 ) {
            mon = "0" + mm;
        }
        const currentDate = mon + "-" + yyyy;
        this.calendarValue = mon;
        this.dateFormatString = currentDate;
        this.roleType = this.globalServiceObj.selectedRole;
        this.countInd = 0;
        for ( let calVal of this.monthArray ) {
            if ( parseInt( calVal.value ) <= parseInt( this.calendarValue ) ) {
                this.finalDateArray[this.countInd] = calVal;
                this.countInd++;
            }
            else {
                break;
            }
        }
        this.fetchRevenueDetails();
    }

    /*fetchBillingDetails(){

        this.billingService.getBillingDetails(this.calendarValue).subscribe(
                 data => {
                    this.tableDetails = <CreditsConsumed>data;
                 },
                 (error) => {

                if (error.status){
                  this.errorMessage = error.json().message +" " +error.status;
                  }
                else{
                  this.errorMessage = error.json().message;
                }
              });

    }*/
    /*
    public mobileAppsDeveloper: string ="MobileAppsDeveloper";

    public telcoDeveloper: string ="TelcoDeveloper";
    public newCoDeveloper: string="NewCoDeveloper";

    public changeEvent(calendarValue: any) {
        this.dateFormatString = calendarValue.month + "-" + calendarValue.year;
        this.fetchRevenueDetails();
    }
	*/

    public checkDate() {
        this.dateFormatString = this.calendarValue + "-" + this.currentYear;
        this.fetchRevenueDetails();
    }

    public fetchRevenueDetails() {
        this.loading = true;
        this.billingService.getRevenueDetails( this.dateFormatString ).subscribe(
            ( data ) => {
                if ( this.roleType == this.configuration.mobileAppsDeveloper ) {
                    this.tableDetails = <CreditsConsumed>data;
                }
                else if ( this.roleType == this.configuration.microServiceDeveloper ) {
                    this.tableDetailsMS = <CreditsEarned>data;
                }
                else if ( this.roleType == this.configuration.telcoDeveloper ) {
                    this.tableDetailsTelco = <TelcoBilling>data;
                }
                else if ( this.roleType == this.configuration.newCoDeveloper ) {
                    this.tableDetailsNewco = <NewcoBilling>data;
                    this.calculateCredits();
                }
                this.loading = false;
            },
            ( error ) => {
                this.sessionTimeout.checkSession(error);
                if ( this.roleType == this.configuration.mobileAppsDeveloper ) {
                    this.errorApp = true;
                }
                else if ( this.roleType == this.configuration.microServiceDeveloper ) {
                    this.errorMS = true;
                }
                else if ( this.roleType == this.configuration.telcoDeveloper ) {
                    this.errorTelco = true;
                }
                else if ( this.roleType == this.configuration.newCoDeveloper ) {
                    this.errorNewCo = true;
                }
                if ( error.json().message == null || error.json().message == undefined || error.json().message == "" ) {
                    this.errorMessage = "Revenue details could not be fetched";
                }
                else {
                    this.errorMessage = error.json().message;
                }
                this.loading = false;
            });
    }


    calculateCredits() {

        this.totalRevenue = 0;
        this.totalCharges = 0;
        for ( let value of this.tableDetailsNewco.monthly ) {

            this.totalRevenue = this.totalRevenue + parseInt( value.usageRevenue );
            this.totalCharges = this.totalCharges + parseInt( value.telcoCharges );

        }
    }

}
