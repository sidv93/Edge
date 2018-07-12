import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Configuration } from "../app.constants";
import {CloudletUsageService} from "../common-services/cloudlet-usage.service";
import {TelcoUsage, UsageData} from "../common-services/cloudletUsageModel";
import {GlobalServiceService} from "../global-service.service";
import { SessionTimeout } from "../common-services/session-timeout";

@Component( {
    selector: "app-telco-usage",
    templateUrl: "./telco-usage.component.html",
    styleUrls: ["./telco-usage.component.css"],
    providers: [Configuration, CloudletUsageService,SessionTimeout],
})
export class TelcoUsageComponent implements OnInit {

    public initialDurSel: string = "Monthly";
    public initialOperator: string = "All";
    public initialItems: number;
    public loading:boolean = false;
    private usageData: TelcoUsage = new TelcoUsage();
    private errorMessage: string;

    private ErrorInfoFlag: boolean = false;
    constructor( private publicConfiguration: Configuration, private router: Router, private globalServiceObj: GlobalServiceService, private cloudletUsage: CloudletUsageService , private sessionTimeout : SessionTimeout) {
        this.initialItems = publicConfiguration.MinItemFirstLoad;
    }

    public ngOnInit() {
        this.fetchGraphData();
    }

    public checkSel() {
        this.fetchGraphData();
    }

    public fetchGraphData() {
        this.loading = true;
        this.cloudletUsage.getCloudletUsage( this.initialDurSel, this.initialOperator, "Telco" ).subscribe(
            ( data ) => {
                this.usageData = <TelcoUsage>data;
                if(this.usageData.telcoUsageData.length == 0) {
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

    public search( term ) {
        this.loading = true;
        this.cloudletUsage.search( this.initialDurSel, this.initialOperator, term ).subscribe(
            ( data ) => {
                this.usageData = <TelcoUsage>data;
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

}
