import { Component, OnInit } from "@angular/core";
import { Configuration } from "../app.constants";
import { Router } from "@angular/router";
import {GlobalServiceService} from "../global-service.service";
import {AppDashboard, Latency, CPUUsage, UsersPerDay, Credits, Subscription} from "./appDashboardModel";
import {ProfileServiceService} from "../common-services/profile.service";
import { Profile } from "../common-services/profile.model";
import {MobileAppDashboardService} from "./mobile-app-dashboard.service";
import { SessionTimeout } from "../common-services/session-timeout";

@Component( {
    selector: "app-dashboard-mobileapp",
    templateUrl: "./dashboard-mobileapp.component.html",
    styleUrls: ["./dashboard-mobileapp.component.css"],
    providers: [Configuration, MobileAppDashboardService, ProfileServiceService,SessionTimeout]
})
export class DashboardMobileappComponent implements OnInit {
    public barChartData: Array<any>;
    public barChartColors: Array<any>;
    public barChartOptions: any;
    public barChartType: string;
    public lineChartLegend: boolean = true;
    public loading : boolean = false;
    private latencyData: Latency = new Latency();
    private cpuUsageData: CPUUsage = new CPUUsage();
    private userPerDay: UsersPerDay = new UsersPerDay();
    private totalSub: Subscription = new Subscription();
    private appDashboard: AppDashboard = new AppDashboard();
    private appDashboardLatency: AppDashboard = new AppDashboard();
    private topMicroService: AppDashboard = new AppDashboard();
    private userDetails = new Profile();
    private creditsObj: Credits = new Credits();
    private errorMessage: string;
    private creditsAvailable: number;
    private dataArray: number[] = [];
    private labelArray: string[] = [];
    private dataArrayLatency: string[][] = [[], [], []];
    private labelArrayLatency: string[] = [];
    private lineChartDataLatency: Array<any> = [];
    private lineChartOptionsLatency: any;
    private lineChartTypeLatency: string;
    private appNameLabels: string[] = [];
    private lineChartColorsLatency: Array<any>;
    private appNameLabelsUsers: string[] = [];
    private dataArrayLatencyUser: string[][] = [[], [], []];
    private labelArrayUser: string[] = [];
    private barRecordFlag: boolean = false;
    private divBarShow: boolean = false;
    private lineLatencyFlag: boolean = false;
    private divLatencyShow: boolean = false;
    private lineUserFlag: boolean = false;
    private userBarShow: boolean = false;
    private detailsError1: boolean = false;
    private detailsError2: boolean = false;
    private detailsError3: boolean = false;
    private detailsError4: boolean = false;
    private detailsError5: boolean = false;
    private detailsError6: boolean = false;
    private detailsError7: boolean = false;
    constructor( private publicConfiguration: Configuration, private router: Router,
        private globalServiceObj: GlobalServiceService, private mobileAppDashSer: MobileAppDashboardService,
        private profileObj: ProfileServiceService, private sessionTimeout : SessionTimeout ) {

    }

    public ngOnInit() {
        this.globalServiceObj.inDashboard = true;
        this.fetchDashboardData();
    }

    public fetchDashboardData() {
        this.loading = true;
        this.mobileAppDashSer.getAppsDash( 'latency' ).subscribe(
            data => {
                this.latencyData = <Latency>data;
                this.loading=false;
            },

            ( error ) => {
                this.detailsError1 = true;
                this.sessionTimeout.checkSession(error);
                if ( error.status ) {
                    this.errorMessage = error.json().message + " " + error.status;
                }
                else {
                    this.errorMessage = error.json().message;
                }
                this.loading=false;
            }
        );
        this.loading=true;
        this.mobileAppDashSer.getAppsDash( 'usersperday' ).subscribe(
            data => {
                this.userPerDay = <UsersPerDay>data;
                this.loading=false;
            },

            ( error ) => {
                this.detailsError2 = true;
                this.sessionTimeout.checkSession(error);
                if ( error.status ) {
                    this.errorMessage = error.json().message + " " + error.status;
                }
                else {
                    this.errorMessage = error.json().message;
                }
                this.loading=false;
            }
        );
        this.loading=true;
        this.mobileAppDashSer.getAppsDash( 'subscription' ).subscribe(
            data => {
                this.totalSub = <Subscription>data;
                this.loading=false;
            },

            ( error ) => {
                this.detailsError3 = true;
                this.sessionTimeout.checkSession(error);
                if ( error.status ) {
                    this.errorMessage = error.json().message + " " + error.status;
                }
                else {
                    this.errorMessage = error.json().message;
                }
                this.loading=false;
            }
        );
        this.loading=true;
        this.mobileAppDashSer.getAppsDash( 'appDash' ).subscribe(
            data => {
                this.appDashboard = <AppDashboard>data;
                if ( this.appDashboard.topEntities.length != 0 ) {
                    this.makeBarGraph();
                }
                else {
                this.barRecordFlag = false;
                this.divBarShow = true;
                this.loading=false;
                }
            },

            ( error ) => {
                this.detailsError4 = true;
                this.sessionTimeout.checkSession(error);
                if ( error.status ) {
                    this.errorMessage = error.json().message + " " + error.status;
                }
                else {
                    this.errorMessage = error.json().message;
                }
                this.loading=false;
            }
        );
        this.loading=true;
        this.mobileAppDashSer.getAppsDash( 'appDashLate' ).subscribe(
            data => {
                this.appDashboardLatency = <AppDashboard>data;
                if ( this.appDashboardLatency.dataMappings.length != 0 ) {
                    this.makeLineGraph();
                }
                else {
                this.lineLatencyFlag = false;
                this.divLatencyShow = true;
                this.loading=false;
                }
            },

            ( error ) => {
                this.detailsError5 = true;
                this.sessionTimeout.checkSession(error);
                if ( error.status ) {
                    this.errorMessage = error.json().message + " " + error.status;
                }
                else {
                    this.errorMessage = error.json().message;
                }
                this.loading=false;
            }
        );
        this.loading=true;
        this.mobileAppDashSer.getAppsDash( 'msDash' ).subscribe(
            data => {
                this.topMicroService = <AppDashboard>data;
                if(this.topMicroService.topEntities.length == 0) {
                  this.detailsError6 = true;
                }
                this.loading=false;
            },

            ( error ) => {
                this.detailsError6 = true;
                this.sessionTimeout.checkSession(error);
                if ( error.status ) {
                    this.errorMessage = error.json().message + " " + error.status;
                }
                else {
                    this.errorMessage = error.json().message;
                }
                this.loading=false;
            }
        );

        this.loading=true;
        this.profileObj.getUserDetail().subscribe(
            data => {
                this.userDetails = <Profile>data;
                this.creditsObj.creditsAvailable = this.userDetails.credits;
                this.loading=false;
            },
            ( error ) => {
                this.detailsError7 = true;
                this.sessionTimeout.checkSession(error);
                if ( error.status ) {
                    this.errorMessage = error.json().message + " " + error.status;
                }
                else {
                    this.errorMessage = error.json().message;
                }
                this.loading=false;
            }
        );
    }

    public makeBarGraph() {
        this.loading=true;
        this.barRecordFlag = true;
        this.divBarShow = true;
        let i: number = 0;
        for ( let value of this.appDashboard.topEntities ) {
            this.dataArray[i] = value.metricValue;
            this.labelArray[i] = value.name;
            i++;
        }
        this.barChartData = [
            {
                data: this.dataArray, label: "No. Of Users"
            }
        ];
        this.barChartOptions = {
            yAxes: [{
                stacked: true
            }]
        };
        this.barChartColors = [
            { // Green
                backgroundColor: 'rgba(0, 128, 0, 0.2)',
                borderColor: 'rgba(0, 128, 0, 1)'
            }
        ];
        this.barChartType = 'bar';
        this.loading=false;
    }

    public makeLineGraph() {
        this.loading=true;
        this.lineLatencyFlag = true;
        this.divLatencyShow = true;
        let i: number = 0;
        for ( let value of this.appDashboardLatency.dataMappings ) {
            this.appNameLabels[i] = value.name;

            if ( value.dataPoints.length == 1 ) {
                this.dataArrayLatency[i][0] = null;
                this.dataArrayLatency[i][1] = value.dataPoints[0].metric;
                this.dataArrayLatency[i][2] = null;
            }
            else {
                let j: number = 0;
                for ( let pointData of value.dataPoints ) {
                    this.dataArrayLatency[i][j] = pointData.metric;
                    j++;
                }
            }

            i++;
        }
        if ( this.appDashboardLatency.dataMappings[0].dataPoints.length == 1 ) {
            this.labelArrayLatency[0] = '';
            this.labelArrayLatency[1] = this.appDashboardLatency.dataMappings[0].dataPoints[0].dateAndTime;
            this.labelArrayLatency[2] = '';
        }
        else {
            let k: number = 0;
            for ( let labelVal of this.appDashboardLatency.dataMappings[0].dataPoints ) {

                this.labelArrayLatency[k] = labelVal.dateAndTime;
                k++;
            }
        }

        for ( let k = 0; k < this.appDashboardLatency.dataMappings.length; k++ ) {
            this.lineChartDataLatency[k] = { data: this.dataArrayLatency[k], label: this.appNameLabels[k] };
        }

        this.lineChartOptionsLatency = {
            responsive: true,
            scales: {
                xAxes: [{
                    ticks: {
                        beginAtZero: true
                    },
                }],
                yAxes: [{

                    ticks: {
                        beginAtZero: true
                    }
                }]
            }

        };
        this.lineChartColorsLatency = [
            { // Red
                backgroundColor: 'rgba(128, 0, 0, 0.2)',
                borderColor: 'rgba(128, 0, 0, 1)',
                fill: false
            },
            { // Amber
                backgroundColor: 'rgba(255, 194, 0, 0.2)',
                borderColor: 'rgba(255, 194, 0 , 1)',
                fill: false
            },
            { // Blue
                backgroundColor: 'rgba(0, 0, 128, 0.2)',
                borderColor: 'rgba(0, 0, 128, 1)',
                fill: false
            },
        ];
        this.lineChartTypeLatency = 'line';
        this.lineChartLegend = true;
        this.loading=false;
    }

}
