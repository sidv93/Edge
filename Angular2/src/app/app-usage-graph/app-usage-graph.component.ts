import { Component, OnInit } from "@angular/core";
import { Configuration } from "../app.constants";
import { Router } from "@angular/router";
import {GlobalServiceService} from "../global-service.service";
import {AppDetailsGraph, DataPoints, UsageData} from "../common-services/appUsageModel";
import {AppGraphService} from "./app-graph.service";
import { SessionTimeout } from "../common-services/session-timeout";
import {MSDataPoints, MSDetailsGraph, MSUsageData} from "../common-services/microServiceUsageModel";

@Component( {
    selector: "app-app-usage-graph",
    styleUrls: ["./app-usage-graph.component.css"],
    templateUrl: "./app-usage-graph.component.html",
    providers: [Configuration, AppGraphService,SessionTimeout],
})
export class AppUsageGraphComponent implements OnInit {

    public timeCycle: string[] = ["Hourly", "Daily", "Weekly", "Monthly"];
    public initialDurSel: string = "Daily";
    public metricType: string[] = ["App Latency", "Session Length", "CPU Usage", "Memory Usage"];
    public initialType: string = "App Latency";
    public lineChartData: Array<any> = [];
    public lineChartColors: Array<any>;
    public lineChartLabels: string[] = [];
    public lineChartOptions: any;
    public lineChartLegend: boolean = true;
    public lineChartType: string;
    // 	private graphData: AppDetailsGraph;
    private graphData: AppDetailsGraph = new AppDetailsGraph();
    private applicationName: string;
    private errorMessage: string;

    private dataArray: string[] = [];
    private weekDaysArray: string[] = [];
    private splittedVal: string[] = [];
    private recordPresentFlag: boolean = false;
    private divToShow: boolean = false;
    private labelUnit: string;
    public loading:boolean = false;

    //micro
    public timeCycleMicro: string[] = ["Hourly", "Daily", "Weekly", "Monthly"];
    public initialDurSelMicro: string = "Daily";
    public metricTypeMicro: string[] ;
    public initialTypeMicro: string = "MS Latency";
    public lineChartDataMicro: Array<any> = [];
    public lineChartColorsMicro: Array<any>;
    public lineChartLabelsMicro: string[] = [];
    public lineChartOptionsMicro: any;
    public lineChartLegendMicro: boolean = true;
    public lineChartTypeMicro: string;
    private microServiceName: string;
    private graphDataMicro: MSDetailsGraph = new MSDetailsGraph();
    private dataArrayMicro: string[] = [];
    private weekDaysArrayMicro: string[] = [];
    private splittedValMicro: string[] = [];
    private recordPresentFlagMicro: boolean = false;
    private divToShowMicro: boolean = false;
    private labelUnitMicro: string;

    constructor( private publicConfiguration: Configuration, private router: Router,
        private globalServiceObj: GlobalServiceService, private appUsageDetails: AppGraphService,private sessionTimeout : SessionTimeout) {
        this.applicationName = globalServiceObj.applicationName;
        this.microServiceName = globalServiceObj.microServiceName;
    }

    public ngOnInit() {
        if(this.globalServiceObj.selectedRole == 'MobileAppsDeveloper') {
          console.log("in init mobile");
          this.fetchGraphData();
        }
        else if(this.globalServiceObj.selectedRole == 'MicroServiceDeveloper') {
          console.log("in init micro");
          if(this.globalServiceObj.userName==this.globalServiceObj.microserviceUserId){
            this.metricTypeMicro=["MS Latency", "Revenue", "CPU Usage", "Memory Usage"];
          } else {
            this.metricTypeMicro=["MS Latency", "CPU Usage", "Memory Usage"];
          }
          this.fetchGraphDataMicro();
        }
    }

    private checkDur() {
        this.fetchGraphData();
        // 	this.getInitialGraphData();
    }

    private checkType() {
        this.getInitialGraphData();
    }

    private fetchGraphData() {
        this.loading = true;
        this.reInitializeData();
        this.appUsageDetails.getAppUsage( this.initialDurSel, this.initialType ).subscribe(
            ( data ) => {
                this.graphData = <AppDetailsGraph>data;
                this.getInitialGraphData();
                this.loading = false;
            },

            ( error ) => {
            this.sessionTimeout.checkSession(error);
            if ( error.json().message == null || error.json().message == undefined
                || error.json().message == "" ) {
                this.errorMessage = "Graph data could not be fetched";
            }
            else {
                this.errorMessage = error.json().message;
            }
            this.loading = false;
            },
        );

    }

    private getIndex( appName: string, dataArray: UsageData[] ): number {
        let indexNo: number = 0;
        for ( let valueInd of dataArray ) {
            if ( valueInd.applicationName == appName ) {
                break;
            }
            else {
                indexNo++;
            }
        }
        return indexNo;
    }

    private reInitializeData() {
        this.dataArray = [];
        this.weekDaysArray = [];
        this.splittedVal = [];
        this.lineChartLabels = [];
        this.lineChartData = [];
        this.recordPresentFlag = false;
        this.divToShow = false;
    }

    private getInitialGraphData() {
        let indexNo: number = this.getIndex( this.applicationName, this.graphData.appUsageData );
        if ( indexNo < this.graphData.appUsageData.length ) {
            this.recordPresentFlag = true;
            this.divToShow = true;
            switch ( this.initialDurSel ) {
                case "Weekly":
                    {
                        switch ( this.initialType ) {
                            case "App Latency":
                                {
                                    let i: number = 0;
                                    for ( let value of this.graphData.appUsageData[indexNo].dataPoints ) {
                                        this.dataArray[i] = value.appLatency;
                                        this.splittedVal = value.plotDataPoint.split( "_" );
                                        this.weekDaysArray[i] = this.splittedVal[0];
                                        i++;
                                    }
                                    this.labelUnit = "(In milliseconds)";
                                    break;
                                }
                            case "Session Length":
                                {
                                    let i: number = 0;
                                    for ( let value of this.graphData.appUsageData[indexNo].dataPoints ) {
                                        this.dataArray[i] = value.sessionLength;
                                        this.splittedVal = value.plotDataPoint.split( "_" );
                                        this.weekDaysArray[i] = this.splittedVal[0];
                                        i++;
                                    }
                                    this.labelUnit = "(In hours)";
                                    break;
                                }
                            case "CPU Usage":
                                {
                                    let i: number = 0;
                                    for ( let value of this.graphData.appUsageData[indexNo].dataPoints ) {
                                        this.dataArray[i] = value.cpuUsage;
                                        this.splittedVal = value.plotDataPoint.split( "_" );
                                        this.weekDaysArray[i] = this.splittedVal[0];
                                        i++;
                                    }
                                    this.labelUnit = "(In %)";
                                    break;
                                }

                            case "Memory Usage":
                                {
                                    let i: number = 0;
                                    for ( let value of this.graphData.appUsageData[indexNo].dataPoints ) {
                                        this.dataArray[i] = value.memoryUsage;
                                        this.splittedVal = value.plotDataPoint.split( "_" );
                                        this.weekDaysArray[i] = this.splittedVal[0];
                                        i++;
                                    }
                                    this.labelUnit = "(In %)";
                                    break;
                                }
                            default:
                                { }
                        }
                        this.lineChartLabels = this.weekDaysArray;
                        this.lineChartData = [
                            // 	{data: [65, 59, 80, 81, 56, 55, 40], label: this.initialType}
                            { data: this.dataArray, label: this.initialType + " " + this.labelUnit },
                        ];

                        break;
                    }

                case "Daily":
                    {
                        switch ( this.initialType ) {
                            case "App Latency":
                                {
                                    let i: number = 0;
                                    for ( let value of this.graphData.appUsageData[indexNo].dataPoints ) {
                                        this.dataArray[i] = value.appLatency;
                                        this.splittedVal = value.plotDataPoint.split( "_" );
                                        if ( parseInt( this.splittedVal[1] ) < 10 ) {
                                            this.splittedVal[1] = "0" + this.splittedVal[1];
                                        }
                                        this.weekDaysArray[i] = this.splittedVal[0] + " " + this.splittedVal[1] + ":00";
                                        i++;
                                    }
                                    this.labelUnit = "(In milliseconds)";
                                    break;
                                }
                            case "Session Length":
                                {
                                    let i: number = 0;
                                    for ( let value of this.graphData.appUsageData[indexNo].dataPoints ) {
                                        this.dataArray[i] = value.sessionLength;
                                        this.splittedVal = value.plotDataPoint.split( "_" );
                                        if ( parseInt( this.splittedVal[1] ) < 10 ) {
                                            this.splittedVal[1] = "0" + this.splittedVal[1];
                                        }
                                        this.weekDaysArray[i] = this.splittedVal[0] + " " + this.splittedVal[1] + ":00";
                                        i++;
                                    }
                                    this.labelUnit = "(In mins)";
                                    break;
                                }
                            case "CPU Usage":
                                {
                                    let i: number = 0;
                                    for ( let value of this.graphData.appUsageData[indexNo].dataPoints ) {
                                        this.dataArray[i] = value.cpuUsage;
                                        this.splittedVal = value.plotDataPoint.split( "_" );
                                        if ( parseInt( this.splittedVal[1] ) < 10 ) {
                                            this.splittedVal[1] = "0" + this.splittedVal[1];
                                        }
                                        this.weekDaysArray[i] = this.splittedVal[0] + " " + this.splittedVal[1] + ":00";
                                        i++;
                                    }
                                    this.labelUnit = "(In %)";
                                    break;
                                }

                            case "Memory Usage":
                                {
                                    let i: number = 0;
                                    for ( let value of this.graphData.appUsageData[indexNo].dataPoints ) {
                                        this.dataArray[i] = value.memoryUsage;
                                        this.splittedVal = value.plotDataPoint.split( "_" );
                                        if ( parseInt( this.splittedVal[1] ) < 10 ) {
                                            this.splittedVal[1] = "0" + this.splittedVal[1];
                                        }
                                        this.weekDaysArray[i] = this.splittedVal[0] + " " + this.splittedVal[1] + ":00";
                                        i++;
                                    }
                                    this.labelUnit = "(In %)";
                                    break;
                                }

                        }
                        this.lineChartLabels = this.weekDaysArray;
                        this.lineChartData = [
                            // 	{data: [65, 59, 80, 81, 56, 55, 40], label: this.initialType}
                            { data: this.dataArray, label: this.initialType + " " + this.labelUnit },
                        ];

                        break;
                    }

                case "Hourly":
                    {
                        switch ( this.initialType ) {
                            case "App Latency":
                                {
                                    let i: number = 0;
                                    for ( let value of this.graphData.appUsageData[indexNo].dataPoints ) {
                                        this.dataArray[i] = value.appLatency;
                                        this.splittedVal = value.plotDataPoint.split( '_' );
                                        if ( parseInt( this.splittedVal[2] ) < 10 ) {
                                            this.splittedVal[2] = "0" + this.splittedVal[2];
                                        }
                                        if ( parseInt( this.splittedVal[1] ) < 10 ) {
                                            this.splittedVal[1] = "0" + this.splittedVal[1];
                                        }
                                        this.weekDaysArray[i] = this.splittedVal[0] + " " +
										this.splittedVal[1] + ":" + this.splittedVal[2];
                                        // this.weekDaysArray[i] = value.plotDataPoint;
                                        i++;
                                    }
                                    this.labelUnit = "(In milliseconds)";
                                    break;
                                }
                            case "Session Length":
                                {
                                    let i: number = 0;
                                    for ( let value of this.graphData.appUsageData[indexNo].dataPoints ) {
                                        this.dataArray[i] = value.sessionLength;
                                        this.splittedVal = value.plotDataPoint.split( '_' );
                                        if ( parseInt( this.splittedVal[2] ) < 10 ) {
                                            this.splittedVal[2] = "0" + this.splittedVal[2];
                                        }
                                        if ( parseInt( this.splittedVal[1] ) < 10 ) {
                                            this.splittedVal[1] = "0" + this.splittedVal[1];
                                        }
                                        this.weekDaysArray[i] = this.splittedVal[0] + " " +
										this.splittedVal[1] + ":" + this.splittedVal[2];
                                        // this.weekDaysArray[i] = value.plotDataPoint;
                                        i++;
                                    }
                                    this.labelUnit = "(In mins)";
                                    break;
                                }
                            case "CPU Usage":
                                {
                                    let i: number = 0;
                                    for ( let value of this.graphData.appUsageData[indexNo].dataPoints ) {
                                        this.dataArray[i] = value.cpuUsage;
                                        this.splittedVal = value.plotDataPoint.split( '_' );
                                        if ( parseInt( this.splittedVal[2] ) < 10 ) {
                                            this.splittedVal[2] = "0" + this.splittedVal[2];
                                        }
                                        if ( parseInt( this.splittedVal[1] ) < 10 ) {
                                            this.splittedVal[1] = "0" + this.splittedVal[1];
                                        }
                                        this.weekDaysArray[i] = this.splittedVal[0] + " " +
										this.splittedVal[1] + ":" + this.splittedVal[2];
                                        // this.weekDaysArray[i] = value.plotDataPoint;
                                        i++;
                                    }
                                    this.labelUnit = "(In %)";
                                    break;
                                }

                            case "Memory Usage":
                                {
                                    let i: number = 0;
                                    for ( let value of this.graphData.appUsageData[indexNo].dataPoints ) {
                                        this.dataArray[i] = value.memoryUsage;
                                        this.splittedVal = value.plotDataPoint.split( '_' );
                                        if ( parseInt( this.splittedVal[2] ) < 10 ) {
                                            this.splittedVal[2] = "0" + this.splittedVal[2];
                                        }
                                        if ( parseInt( this.splittedVal[1] ) < 10 ) {
                                            this.splittedVal[1] = "0" + this.splittedVal[1];
                                        }
                                        this.weekDaysArray[i] = this.splittedVal[0] + " " +
										this.splittedVal[1] + ":" + this.splittedVal[2];
                                        // this.weekDaysArray[i] = value.plotDataPoint;
                                        i++;
                                    }
                                    this.labelUnit = "(In %)";
                                    break;
                                }

                        }
                        this.lineChartLabels = this.weekDaysArray;
                        this.lineChartData = [
                            // 	{data: [65, 59, 80, 81, 56, 55, 40], label: this.initialType}
                            { data: this.dataArray, label: this.initialType + " " + this.labelUnit },
                        ];

                        break;
                    }

                case "Monthly":
                    {
                        switch ( this.initialType ) {
                            case "App Latency":
                                {
                                    let i: number = 0;
                                    for ( let value of this.graphData.appUsageData[indexNo].dataPoints ) {
                                        this.dataArray[i] = value.appLatency;
                                        this.splittedVal = value.plotDataPoint.split( "_" );
                                        this.weekDaysArray[i] = this.splittedVal[0];
                                        i++;
                                    }
                                    this.labelUnit = "(In milliseconds)";
                                    break;
                                }
                            case "Session Length":
                                {
                                    let i: number = 0;
                                    for ( let value of this.graphData.appUsageData[indexNo].dataPoints ) {
                                        this.dataArray[i] = value.sessionLength;
                                        this.splittedVal = value.plotDataPoint.split( "_" );
                                        this.weekDaysArray[i] = this.splittedVal[0];
                                        i++;
                                    }
                                    this.labelUnit = "(In hours)";
                                    break;
                                }
                            case "CPU Usage":
                                {
                                    let i: number = 0;
                                    for ( let value of this.graphData.appUsageData[indexNo].dataPoints ) {
                                        this.dataArray[i] = value.cpuUsage;
                                        this.splittedVal = value.plotDataPoint.split( "_" );
                                        this.weekDaysArray[i] = this.splittedVal[0];
                                        i++;
                                    }
                                    this.labelUnit = "(In %)";
                                    break;
                                }

                            case "Memory Usage":
                                {
                                    let i: number = 0;
                                    for ( let value of this.graphData.appUsageData[indexNo].dataPoints ) {
                                        this.dataArray[i] = value.memoryUsage;
                                        this.splittedVal = value.plotDataPoint.split( "_" );
                                        this.weekDaysArray[i] = this.splittedVal[0];
                                        i++;
                                    }
                                    this.labelUnit = "(In %)";
                                    break;
                                }

                        }
                        this.lineChartLabels = this.weekDaysArray;
                        this.lineChartData = [
                            // 	{data: [65, 59, 80, 81, 56, 55, 40], label: this.initialType}
                            { data: this.dataArray, label: this.initialType + " " + this.labelUnit },
                        ];

                        break;
                    }

            }
            this.lineChartOptions = {
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
            this.lineChartColors = [
                { //  grey
                    backgroundColor: "rgba(148,159,177,0.2)",
                    borderColor: "rgba(148,159,177,1)",
                    pointBackgroundColor: "rgba(148,159,177,1)",
                    pointBorderColor: "#fff",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgba(148,159,177,0.8)",
                },
            ];
            this.lineChartLegend = true;
            this.lineChartType = "line";
        }
        else {
            this.recordPresentFlag = false;
            this.divToShow = true;
        }
    }

    public getInitialGraphDataMicro() {
        console.log("in initial graph data micro");
        console.log("graph data micro=" + JSON.stringify(this.graphDataMicro));
        let indexNo: number = this.getIndexMicro( this.microServiceName, this.graphDataMicro.msUsageData );
        if ( indexNo < this.graphDataMicro.msUsageData.length ) {
            console.log("in if");
            this.recordPresentFlagMicro = true;
            this.divToShowMicro = true;
            switch ( this.initialDurSelMicro ) {
                case "Weekly":
                    {
                        switch ( this.initialTypeMicro ) {
                            case "MS Latency":
                                {
                                    let i: number = 0;
                                    for ( let value of this.graphDataMicro.msUsageData[0].dataPoints ) {
                                        this.dataArrayMicro[i] = value.msLatency;
                                        this.splittedValMicro = value.plotDataPoint.split( "_" );
                                        this.weekDaysArrayMicro[i] = this.splittedValMicro[0];
                                        i++;
                                    }
                                    this.labelUnitMicro = "(In milliseconds)";
                                    break;
                                }
                            case "Revenue":
                                {
                                    let i: number = 0;
                                    for ( let value of this.graphDataMicro.msUsageData[0].dataPoints ) {
                                        this.dataArrayMicro[i] = value.revenue;
                                        this.splittedValMicro = value.plotDataPoint.split( "_" );
                                        this.weekDaysArrayMicro[i] = this.splittedValMicro[0];
                                        i++;
                                    }
                                    this.labelUnitMicro = "(In $)";
                                    break;
                                }
                            case "CPU Usage":
                                {
                                    let i: number = 0;
                                    for ( let value of this.graphDataMicro.msUsageData[0].dataPoints ) {
                                        this.dataArrayMicro[i] = value.cpuUsage;
                                        this.splittedValMicro = value.plotDataPoint.split( "_" );
                                        this.weekDaysArrayMicro[i] = this.splittedValMicro[0];
                                        i++;
                                    }
                                    this.labelUnitMicro = "(In %)";
                                    break;
                                }

                            case "Memory Usage":
                                {
                                    let i: number = 0;
                                    for ( let value of this.graphDataMicro.msUsageData[0].dataPoints ) {
                                        this.dataArrayMicro[i] = value.memoryUsage;
                                        this.splittedValMicro = value.plotDataPoint.split( "_" );
                                        this.weekDaysArrayMicro[i] = this.splittedValMicro[0];
                                        i++;
                                    }
                                    this.labelUnitMicro = "(In %)";
                                    break;
                                }

                        }

                        this.lineChartLabelsMicro = this.weekDaysArrayMicro;
                        this.lineChartDataMicro = [
                            { data: this.dataArrayMicro, label: this.initialTypeMicro + " " + this.labelUnitMicro },
                        ];

                        break;
                    }

                case "Daily":
                    {
                        switch ( this.initialTypeMicro ) {
                            case "MS Latency":
                                {
                                    let i: number = 0;
                                    for ( let value of this.graphDataMicro.msUsageData[0].dataPoints ) {
                                        this.dataArrayMicro[i] = value.msLatency;
                                        this.splittedValMicro = value.plotDataPoint.split( "_" );
                                        if ( parseInt( this.splittedValMicro[1] ) < 10 ) {
                                            this.splittedValMicro[1] = "0" + this.splittedValMicro[1];
                                        }
                                        this.weekDaysArrayMicro[i] = this.splittedValMicro[0] + " " + this.splittedValMicro[1] + ":00";
                                        i++;
                                    }
                                    this.labelUnitMicro = "(In milliseconds)";
                                    break;
                                }
                            case "Revenue":
                                {
                                    let i: number = 0;
                                    for ( let value of this.graphDataMicro.msUsageData[0].dataPoints ) {
                                        this.dataArrayMicro[i] = value.revenue;
                                        this.splittedValMicro = value.plotDataPoint.split( "_" );
                                        if ( parseInt( this.splittedValMicro[1] ) < 10 ) {
                                            this.splittedValMicro[1] = "0" + this.splittedValMicro[1];
                                        }
                                        this.weekDaysArrayMicro[i] = this.splittedValMicro[0] + " " + this.splittedValMicro[1] + ":00";
                                        i++;
                                    }
                                    this.labelUnitMicro = "(In $)";
                                    break;
                                }
                            case "CPU Usage":
                                {
                                    let i: number = 0;
                                    for ( let value of this.graphDataMicro.msUsageData[0].dataPoints ) {
                                        this.dataArrayMicro[i] = value.cpuUsage;
                                        this.splittedValMicro = value.plotDataPoint.split( "_" );
                                        if ( parseInt( this.splittedValMicro[1] ) < 10 ) {
                                            this.splittedValMicro[1] = "0" + this.splittedValMicro[1];
                                        }
                                        this.weekDaysArrayMicro[i] = this.splittedValMicro[0] + " " + this.splittedValMicro[1] + ":00";
                                        i++;
                                    }
                                    this.labelUnitMicro = "(In %)";
                                    break;
                                }

                            case "Memory Usage":
                                {
                                    let i: number = 0;
                                    for ( let value of this.graphDataMicro.msUsageData[0].dataPoints ) {
                                        this.dataArrayMicro[i] = value.memoryUsage;
                                        this.splittedValMicro = value.plotDataPoint.split( "_" );
                                        if ( parseInt( this.splittedValMicro[1] ) < 10 ) {
                                            this.splittedValMicro[1] = "0" + this.splittedValMicro[1];
                                        }
                                        this.weekDaysArrayMicro[i] = this.splittedValMicro[0] + " " + this.splittedValMicro[1] + ":00";
                                        i++;
                                    }
                                    this.labelUnitMicro = "(In %)";
                                    break;
                                }

                        }
                        this.lineChartLabelsMicro = this.weekDaysArrayMicro;
                        this.lineChartDataMicro = [
                            { data: this.dataArrayMicro, label: this.initialTypeMicro + " " + this.labelUnitMicro },
                        ];

                        break;
                    }

                case "Hourly":
                    {
                        switch ( this.initialTypeMicro ) {
                            case "MS Latency":
                                {
                                    let i: number = 0;
                                    for ( let value of this.graphDataMicro.msUsageData[0].dataPoints ) {
                                        this.dataArrayMicro[i] = value.msLatency;
                                        this.splittedValMicro = value.plotDataPoint.split( '_' );
                                        if ( parseInt( this.splittedValMicro[2] ) < 10 ) {
                                            this.splittedValMicro[2] = "0" + this.splittedValMicro[2];
                                        }
                                        if ( parseInt( this.splittedValMicro[1] ) < 10 ) {
                                            this.splittedValMicro[1] = "0" + this.splittedValMicro[1];
                                        }
                                        this.weekDaysArrayMicro[i] = this.splittedValMicro[0] + " " + this.splittedValMicro[1] +
                                            ":" + this.splittedValMicro[2];

                                        i++;
                                    }
                                    this.labelUnitMicro = "(In milliseconds)";
                                    break;
                                }
                            case "Revenue":
                                {
                                    let i: number = 0;
                                    for ( let value of this.graphDataMicro.msUsageData[0].dataPoints ) {
                                        this.dataArrayMicro[i] = value.revenue;
                                        this.splittedValMicro = value.plotDataPoint.split( '_' );
                                        if ( parseInt( this.splittedValMicro[2] ) < 10 ) {
                                            this.splittedValMicro[2] = "0" + this.splittedValMicro[2];
                                        }
                                        if ( parseInt( this.splittedValMicro[1] ) < 10 ) {
                                            this.splittedValMicro[1] = "0" + this.splittedValMicro[1];
                                        }
                                        this.weekDaysArrayMicro[i] = this.splittedValMicro[0] + " " + this.splittedValMicro[1] +
                                            ":" + this.splittedValMicro[2];
                                        i++;
                                    }
                                    this.labelUnitMicro = "(In $)";
                                    break;
                                }
                            case "CPU Usage":
                                {
                                    let i: number = 0;
                                    for ( let value of this.graphDataMicro.msUsageData[0].dataPoints ) {
                                        this.dataArrayMicro[i] = value.cpuUsage;
                                        this.splittedValMicro = value.plotDataPoint.split( '_' );
                                        if ( parseInt( this.splittedValMicro[2] ) < 10 ) {
                                            this.splittedValMicro[2] = "0" + this.splittedValMicro[2];
                                        }
                                        if ( parseInt( this.splittedValMicro[1] ) < 10 ) {
                                            this.splittedValMicro[1] = "0" + this.splittedValMicro[1];
                                        }
                                        this.weekDaysArrayMicro[i] = this.splittedValMicro[0] + " " + this.splittedValMicro[1] +
                                            ":" + this.splittedValMicro[2];
                                        i++;
                                    }
                                    this.labelUnitMicro = "(In %)";
                                    break;
                                }

                            case "Memory Usage":
                                {
                                    let i: number = 0;
                                    for ( let value of this.graphDataMicro.msUsageData[0].dataPoints ) {
                                        this.dataArrayMicro[i] = value.memoryUsage;
                                        this.splittedValMicro = value.plotDataPoint.split( '_' );
                                        if ( parseInt( this.splittedValMicro[2] ) < 10 ) {
                                            this.splittedValMicro[2] = "0" + this.splittedValMicro[2];
                                        }
                                        if ( parseInt( this.splittedValMicro[1] ) < 10 ) {
                                            this.splittedValMicro[1] = "0" + this.splittedValMicro[1];
                                        }
                                        this.weekDaysArrayMicro[i] = this.splittedValMicro[0] + " " + this.splittedValMicro[1] +
                                            ":" + this.splittedValMicro[2];
                                        i++;
                                    }
                                    this.labelUnit = "(In %)";
                                    break;
                                }

                        }
                        this.lineChartLabelsMicro = this.weekDaysArrayMicro;
                        this.lineChartDataMicro = [
                            { data: this.dataArrayMicro, label: this.initialTypeMicro + " " + this.labelUnitMicro },
                        ];

                        break;
                    }

                case "Monthly":
                    {
                        switch ( this.initialTypeMicro ) {
                            case "MS Latency":
                                {
                                    let i: number = 0;
                                    for ( let value of this.graphDataMicro.msUsageData[0].dataPoints ) {
                                        this.dataArrayMicro[i] = value.msLatency;
                                        this.splittedValMicro = value.plotDataPoint.split( "_" );
                                        this.weekDaysArrayMicro[i] = this.splittedValMicro[0];
                                        i++;
                                    }
                                    this.labelUnitMicro = "(In milliseconds)";
                                    break;
                                }
                            case "Revenue":
                                {
                                    let i: number = 0;
                                    for ( let value of this.graphDataMicro.msUsageData[0].dataPoints ) {
                                        this.dataArrayMicro[i] = value.revenue;
                                        this.splittedValMicro = value.plotDataPoint.split( "_" );
                                        this.weekDaysArrayMicro[i] = this.splittedValMicro[0];
                                        i++;
                                    }
                                    this.labelUnitMicro = "(In $)";
                                    break;
                                }
                            case "CPU Usage":
                                {
                                    let i: number = 0;
                                    for ( let value of this.graphDataMicro.msUsageData[0].dataPoints ) {
                                        this.dataArrayMicro[i] = value.cpuUsage;
                                        this.splittedValMicro = value.plotDataPoint.split( "_" );
                                        this.weekDaysArrayMicro[i] = this.splittedValMicro[0];
                                        i++;
                                    }
                                    this.labelUnitMicro = "(In %)";
                                    break;
                                }

                            case "Memory Usage":
                                {
                                    let i: number = 0;
                                    for ( let value of this.graphDataMicro.msUsageData[0].dataPoints ) {
                                        this.dataArrayMicro[i] = value.memoryUsage;
                                        this.splittedValMicro = value.plotDataPoint.split( "_" );
                                        this.weekDaysArrayMicro[i] = this.splittedValMicro[0];
                                        i++;
                                    }
                                    this.labelUnitMicro = "(In %)";
                                    break;
                                }

                        }
                        this.lineChartLabelsMicro = this.weekDaysArrayMicro;
                        this.lineChartDataMicro= [
                            { data: this.dataArrayMicro, label: this.initialTypeMicro + " " + this.labelUnitMicro },
                        ];

                        break;
                    }

            }
            this.lineChartOptionsMicro = {
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
            this.lineChartColorsMicro = [
                { //  grey
                    backgroundColor: "rgba(148,159,177,0.2)",
                    borderColor: "rgba(148,159,177,1)",
                    pointBackgroundColor: "rgba(148,159,177,1)",
                    pointBorderColor: "#fff",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgba(148,159,177,0.8)",
                },
            ];
            this.lineChartLegendMicro = true;
            this.lineChartTypeMicro = "line";
        }
        else {
            console.log("in else");
            this.recordPresentFlagMicro = false;
            this.divToShowMicro = true;
        }
    }

    public fetchGraphDataMicro() {
        this.loading = true;
        this.reInitializeDataMicro();
        this.appUsageDetails.getMSUsage( this.initialDurSelMicro, this.initialTypeMicro ).subscribe(
            ( data ) => {
                this.graphDataMicro = <MSDetailsGraph>data;
                this.getInitialGraphDataMicro();
                this.loading = false;
            },

            ( error ) => {
            this.sessionTimeout.checkSession(error);
            this.recordPresentFlagMicro = false;
            this.divToShowMicro = true;
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
    public getIndexMicro( msName: string, dataArray: MSUsageData[] ): number {
        let indexNo: number = 0;
        for ( let valueInd of dataArray ) {
            if ( valueInd.microServiceName == msName ) {
                break;
            }
            else {
                indexNo++;
            }
        }
        return indexNo;
    }

    private reInitializeDataMicro() {
        this.dataArrayMicro = [];
        this.weekDaysArrayMicro = [];
        this.splittedValMicro = [];
        this.lineChartLabelsMicro = [];
        this.lineChartDataMicro = [];
        this.recordPresentFlagMicro = false;
        this.divToShowMicro = false;
    }

    public checkDurMicro() {
        this.fetchGraphDataMicro();
    }

    public checkTypeMicro() {
        this.getInitialGraphDataMicro();
    }
}
