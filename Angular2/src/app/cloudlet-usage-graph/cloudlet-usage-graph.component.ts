import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Configuration } from "../app.constants";
import {CloudletUsageService} from "../common-services/cloudlet-usage.service";
import {CloudletGraph, UsageData,TelcoUsage} from "../common-services/cloudletUsageModel";
import {GlobalServiceService} from "../global-service.service";
import {SignUp} from "../sign-up/sign-up.model";
import { SessionTimeout } from "../common-services/session-timeout";


@Component( {
    selector: "app-cloudlet-usage-graph",
    templateUrl: "./cloudlet-usage-graph.component.html",
    styleUrls: ["./cloudlet-usage-graph.component.css"],
    providers: [Configuration, CloudletUsageService,SessionTimeout],
})
export class CloudletUsageGraphComponent implements OnInit {

    public initialDurSel: string = "Monthly";
    public initialOperator: string = "All";
    private userList: SignUp[];
    private usageData: CloudletGraph = new CloudletGraph();
    private errorMessage: string;
    private initialItems: number;
    public loading:boolean = false;
    private ErrorInfoFlag: boolean = false;
    private usageDataTelco: TelcoUsage = new TelcoUsage();

    constructor( private publicConfiguration: Configuration, private router: Router,
        private globalServiceObj: GlobalServiceService, private cloudletUsage: CloudletUsageService, private sessionTimeout : SessionTimeout ) {
        this.initialItems = publicConfiguration.MinItemFirstLoad;
    }

    public ngOnInit() {
        if(this.globalServiceObj.selectedRole == 'NewCoDeveloper') {
          this.getInitialCloudletUsage();
        }
        else if(this.globalServiceObj.selectedRole == 'TelcoDeveloper') {
          console.log("in telco init");
          this.fetchGraphDataTelco();
        }
    }

    public getInitialCloudletUsage() {
        this.loading= true;
        this.cloudletUsage.getInitialCloudletUsage( this.initialDurSel ).subscribe(
            ( data ) => {
                this.usageData = <CloudletGraph>data[0];
                this.userList = <SignUp[]>data[1];

                if ( this.usageData == null || this.usageData.paasUsageData.length == 0) {
                    this.ErrorInfoFlag = true;
                    this.errorMessage = "No records found";
                }
                else {
                    if ( this.userList.length != 0 ) {
                        for ( let i = 0; i < this.userList.length; i++ ) {
                            if ( this.checkUniqueOperator( this.userList[i].companyName ) ) {
                                this.globalServiceObj.operatorsList.push( this.userList[i].companyName );
                            }
                        }
                    }
                }
                this.loading = false;
            },

            ( error ) => {
                this.ErrorInfoFlag = true;
                this.sessionTimeout.checkSession(error);
                if ( error.json().message == null || error.json().message == undefined || error.json().message == "" ) {
                    this.errorMessage = "Cloudlet usage data could not be fetched";
                }
                else {
                    this.errorMessage = error.json().message;
                }
                this.loading = false;
                }
        );
    }

    public checkUniqueOperator( operator: string ) {
        let flag = true;
        for ( let i = 0; i < this.globalServiceObj.operatorsList.length; i++ ) {
            if ( this.globalServiceObj.operatorsList[i] == operator )
                flag = false;
        }
        return flag;
    }

    public checkSel() {
        this.fetchGraphData();
    }

    public fetchGraphData() {
        this.loading = true;
        this.cloudletUsage.getCloudletUsage( this.initialDurSel, this.initialOperator, "Cloudlet" ).subscribe(
            ( data ) => {
                this.usageData = <CloudletGraph>data;
                if(this.usageData.paasUsageData.length == 0) {
                  this.ErrorInfoFlag = true;
                }
                else {
                  this.ErrorInfoFlag = false;
                }
                this.loading = false;
            },

            ( error ) => {
                this.ErrorInfoFlag = true;
                this.sessionTimeout.checkSession(error);
                if ( error.json().message == null || error.json().message == undefined || error.json().message == "" ) {
                    this.errorMessage = "Graph data could not be fetched";
                }
                else {
                    this.errorMessage = error.json().message;
                }
                this.loading = false;
            }
        );
    }

    public search( term ) {
        this.loading = true;
        console.log("in telco search");
        this.cloudletUsage.search( this.initialDurSel, this.initialOperator, term ).subscribe(
            ( data ) => {
                this.usageDataTelco = <TelcoUsage>data;
                this.loading = false;
            },

            ( error ) => {
                this.ErrorInfoFlag = true;
                this.sessionTimeout.checkSession(error);
                if ( error.json().message == null || error.json().message == undefined || error.json().message == "" ) {
                    this.errorMessage = term + " could not be fetched";
                }
                else {
                    this.errorMessage = error.json().message;
                }
                this.loading = false;
            }
        );
    }

    public fetchGraphDataTelco() {
        this.loading = true;
        console.log("in fetch telco");
        this.cloudletUsage.getCloudletUsage( this.initialDurSel, this.initialOperator, "Telco" ).subscribe(
            ( data ) => {
                this.usageDataTelco = <TelcoUsage>data;
                if(this.usageDataTelco.telcoUsageData.length == 0) {
                  this.ErrorInfoFlag = true;
                }
                this.loading = false;
            },

            ( error ) => {
                this.ErrorInfoFlag = true;
                this.sessionTimeout.checkSession(error);
                if ( error.json().message == null || error.json().message == undefined || error.json().message == "" ) {
                    this.errorMessage = "Graph data could not be fetched";
                }
                else {
                    this.errorMessage = error.json().message;
                }
                this.loading = false;
            }
        );
    }
}
