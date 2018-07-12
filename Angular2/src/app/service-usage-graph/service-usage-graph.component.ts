import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Configuration } from "../app.constants";
import {MSDataPoints, MSDetailsGraph, MSUsageData} from "../common-services/microServiceUsageModel";
import {GlobalServiceService} from "../global-service.service";
import {MicroServiceGraphService} from "./micro-service-graph.service";
import { SessionTimeout } from "../common-services/session-timeout";

@Component( {
    selector: "app-service-usage-graph",
    templateUrl: "./service-usage-graph.component.html",
    styleUrls: ["./service-usage-graph.component.css"],
    providers: [Configuration, MicroServiceGraphService,SessionTimeout],
})
export class ServiceUsageGraphComponent implements OnInit {
    public timeCycle: string[] = ["Hourly", "Daily", "Weekly", "Monthly"];
    public initialDurSel: string = "Daily";
    public metricType: string[] ;
    public initialType: string = "MS Latency";
    // 	private graphData: MSDetailsGraph;
    public lineChartData: Array<any> = [];
    public lineChartColors: Array<any>;
    public lineChartLabels: string[] = [];
    public lineChartOptions: any;
    public lineChartLegend: boolean = true;
    public lineChartType: string;
    private microServiceName: string;
    private errorMessage: string;
    private graphData: MSDetailsGraph = new MSDetailsGraph();
    private dataArray: string[] = [];
    private weekDaysArray: string[] = [];
    private splittedVal: string[] = [];
    private recordPresentFlag: boolean = false;
    private divToShow: boolean = false;
    private labelUnit: string;
    public loading:boolean = false;

    constructor( private publicConfiguration: Configuration, private router: Router, private globalServiceObj: GlobalServiceService, private microServiceUsage: MicroServiceGraphService, private sessionTimeout : SessionTimeout ) {
        this.microServiceName = globalServiceObj.microServiceName;
    }

    public ngOnInit() {
      if(this.globalServiceObj.userName==this.globalServiceObj.microserviceUserId){
        this.metricType=["MS Latency", "Revenue", "CPU Usage", "Memory Usage"];
      } else {
        this.metricType=["MS Latency", "CPU Usage", "Memory Usage"];
      }
        this.fetchGraphData();

    }

    public checkDur() {
        this.fetchGraphData();
        // 	this.getInitialGraphData();
    }

    public checkType() {
        this.getInitialGraphData();
    }

    public fetchGraphData() {
        this.loading = true;
        this.reInitializeData();
        this.microServiceUsage.getMSUsage( this.initialDurSel, this.initialType ).subscribe(
            ( data ) => {
                this.graphData = <MSDetailsGraph>data;
                this.getInitialGraphData();
                this.loading = false;
            },

            ( error ) => {
            this.sessionTimeout.checkSession(error);
            this.recordPresentFlag = false;
            this.divToShow = true;
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

    public getIndex( msName: string, dataArray: MSUsageData[] ): number {
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
    private reInitializeData() {
        this.dataArray = [];
        this.weekDaysArray = [];
        this.splittedVal = [];
        this.lineChartLabels = [];
        this.lineChartData = [];
        this.recordPresentFlag = false;
        this.divToShow = false;
    }
    public getInitialGraphData() {
        let indexNo: number = this.getIndex( this.microServiceName, this.graphData.msUsageData );
        if ( indexNo < this.graphData.msUsageData.length ) {
            this.recordPresentFlag = true;
            this.divToShow = true;
            switch ( this.initialDurSel ) {
                case "Weekly":
                    {
                        switch ( this.initialType ) {
                            case "MS Latency":
                                {
                                    let i: number = 0;
                                    for ( let value of this.graphData.msUsageData[0].dataPoints ) {
                                        this.dataArray[i] = value.msLatency;
                                        this.splittedVal = value.plotDataPoint.split( "_" );
                                        this.weekDaysArray[i] = this.splittedVal[0];
                                        i++;
                                    }
                                    this.labelUnit = "(In milliseconds)";
                                    break;
                                }
                            case "Revenue":
                                {
                                    let i: number = 0;
                                    for ( let value of this.graphData.msUsageData[0].dataPoints ) {
                                        this.dataArray[i] = value.revenue;
                                        this.splittedVal = value.plotDataPoint.split( "_" );
                                        this.weekDaysArray[i] = this.splittedVal[0];
                                        i++;
                                    }
                                    this.labelUnit = "(In $)";
                                    break;
                                }
                            case "CPU Usage":
                                {
                                    let i: number = 0;
                                    for ( let value of this.graphData.msUsageData[0].dataPoints ) {
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
                                    for ( let value of this.graphData.msUsageData[0].dataPoints ) {
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

                case "Daily":
                    {
                        switch ( this.initialType ) {
                            case "MS Latency":
                                {
                                    let i: number = 0;
                                    for ( let value of this.graphData.msUsageData[0].dataPoints ) {
                                        this.dataArray[i] = value.msLatency;
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
                            case "Revenue":
                                {
                                    let i: number = 0;
                                    for ( let value of this.graphData.msUsageData[0].dataPoints ) {
                                        this.dataArray[i] = value.revenue;
                                        this.splittedVal = value.plotDataPoint.split( "_" );
                                        if ( parseInt( this.splittedVal[1] ) < 10 ) {
                                            this.splittedVal[1] = "0" + this.splittedVal[1];
                                        }
                                        this.weekDaysArray[i] = this.splittedVal[0] + " " + this.splittedVal[1] + ":00";
                                        i++;
                                    }
                                    this.labelUnit = "(In $)";
                                    break;
                                }
                            case "CPU Usage":
                                {
                                    let i: number = 0;
                                    for ( let value of this.graphData.msUsageData[0].dataPoints ) {
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
                                    for ( let value of this.graphData.msUsageData[0].dataPoints ) {
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
                        // 		this.lineChartLabels = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday','Monday'];
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
                            case "MS Latency":
                                {
                                    let i: number = 0;
                                    for ( let value of this.graphData.msUsageData[0].dataPoints ) {
                                        this.dataArray[i] = value.msLatency;
                                        this.splittedVal = value.plotDataPoint.split( '_' );
                                        if ( parseInt( this.splittedVal[2] ) < 10 ) {
                                            this.splittedVal[2] = "0" + this.splittedVal[2];
                                        }
                                        if ( parseInt( this.splittedVal[1] ) < 10 ) {
                                            this.splittedVal[1] = "0" + this.splittedVal[1];
                                        }
                                        this.weekDaysArray[i] = this.splittedVal[0] + " " + this.splittedVal[1] +
                                            ":" + this.splittedVal[2];

                                        i++;
                                    }
                                    this.labelUnit = "(In milliseconds)";
                                    break;
                                }
                            case "Revenue":
                                {
                                    let i: number = 0;
                                    for ( let value of this.graphData.msUsageData[0].dataPoints ) {
                                        this.dataArray[i] = value.revenue;
                                        this.splittedVal = value.plotDataPoint.split( '_' );
                                        if ( parseInt( this.splittedVal[2] ) < 10 ) {
                                            this.splittedVal[2] = "0" + this.splittedVal[2];
                                        }
                                        if ( parseInt( this.splittedVal[1] ) < 10 ) {
                                            this.splittedVal[1] = "0" + this.splittedVal[1];
                                        }
                                        this.weekDaysArray[i] = this.splittedVal[0] + " " + this.splittedVal[1] +
                                            ":" + this.splittedVal[2];
                                        i++;
                                    }
                                    this.labelUnit = "(In $)";
                                    break;
                                }
                            case "CPU Usage":
                                {
                                    let i: number = 0;
                                    for ( let value of this.graphData.msUsageData[0].dataPoints ) {
                                        this.dataArray[i] = value.cpuUsage;
                                        this.splittedVal = value.plotDataPoint.split( '_' );
                                        if ( parseInt( this.splittedVal[2] ) < 10 ) {
                                            this.splittedVal[2] = "0" + this.splittedVal[2];
                                        }
                                        if ( parseInt( this.splittedVal[1] ) < 10 ) {
                                            this.splittedVal[1] = "0" + this.splittedVal[1];
                                        }
                                        this.weekDaysArray[i] = this.splittedVal[0] + " " + this.splittedVal[1] +
                                            ":" + this.splittedVal[2];
                                        i++;
                                    }
                                    this.labelUnit = "(In %)";
                                    break;
                                }

                            case "Memory Usage":
                                {
                                    let i: number = 0;
                                    for ( let value of this.graphData.msUsageData[0].dataPoints ) {
                                        this.dataArray[i] = value.memoryUsage;
                                        this.splittedVal = value.plotDataPoint.split( '_' );
                                        if ( parseInt( this.splittedVal[2] ) < 10 ) {
                                            this.splittedVal[2] = "0" + this.splittedVal[2];
                                        }
                                        if ( parseInt( this.splittedVal[1] ) < 10 ) {
                                            this.splittedVal[1] = "0" + this.splittedVal[1];
                                        }
                                        this.weekDaysArray[i] = this.splittedVal[0] + " " + this.splittedVal[1] +
                                            ":" + this.splittedVal[2];
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
                            case "MS Latency":
                                {
                                    let i: number = 0;
                                    for ( let value of this.graphData.msUsageData[0].dataPoints ) {
                                        this.dataArray[i] = value.msLatency;
                                        this.splittedVal = value.plotDataPoint.split( "_" );
                                        this.weekDaysArray[i] = this.splittedVal[0];
                                        i++;
                                    }
                                    this.labelUnit = "(In milliseconds)";
                                    break;
                                }
                            case "Revenue":
                                {
                                    let i: number = 0;
                                    for ( let value of this.graphData.msUsageData[0].dataPoints ) {
                                        this.dataArray[i] = value.revenue;
                                        this.splittedVal = value.plotDataPoint.split( "_" );
                                        this.weekDaysArray[i] = this.splittedVal[0];
                                        i++;
                                    }
                                    this.labelUnit = "(In $)";
                                    break;
                                }
                            case "CPU Usage":
                                {
                                    let i: number = 0;
                                    for ( let value of this.graphData.msUsageData[0].dataPoints ) {
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
                                    for ( let value of this.graphData.msUsageData[0].dataPoints ) {
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

}
