import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import {AppGraphService} from "../app-usage-graph/app-graph.service";
import { Configuration } from "../app.constants";
import {AppDetailsGraph, DataPoints, UsageData} from "../common-services/appUsageModel";
import {MSDetailsGraph} from "../common-services/microServiceUsageModel";
import {GlobalServiceService} from "../global-service.service";
import {MicroServiceGraphService} from "../service-usage-graph/micro-service-graph.service";
import { SessionTimeout } from "../common-services/session-timeout";

@Component( {
    selector: "app-monitoring",
    templateUrl: "./monitoring.component.html",
    styleUrls: ["./monitoring.component.css"],
    providers: [MicroServiceGraphService,SessionTimeout],
})
export class MonitoringComponent implements OnInit {

    public timeCycle: string;
    public initialDurSel: string = "Last Hour";
    public metricType: string[] = ["App Latency", "Session Length", "CPU Usage", "Memory Usage"];
    public initialType: string = "App Latency";
    // 	private graphData: AppDetailsGraph;
    public lineChartData: any[];
    public lineChartDataLatency: any[] = [];
    public lineChartSessionLength: any[] = [];
    public lineChartCPUUsage: any[] = [];
    public lineChartDataMemoryUsage: any[] = [];
    public lineChartOptions: any;
    public lineChartLegend: boolean = true;
    public lineChartType: string;
    public lineChartLabels: string[] = [];
    public lineLabels: string[] = [];
    public lineChartLabelsLatency: string[] = [];
    public lineChartLabelsSessionLength: string[] = [];
    public lineChartLabelsCPUUsage: string[] = [];
    public lineChartLabelsMemoryUsage: string[] = [];
    public lineChartColors: any[] = [];
    public recordPresentFlag: boolean = false;
    private graphDataMS: MSDetailsGraph = new MSDetailsGraph();
    private graphData: AppDetailsGraph = new AppDetailsGraph();
    private applicationName: string;
    private errorMessage: string;
    private dataArray: string[] = [];
    private dataArrayLatency: string[][] = [[], [], []];
    private dataArraySessionLength: string[][] = [[], [], []];
    private dataArrayCPUUsage: string[][] = [[], [], []];
    private dataArrayMemoryUsage: string[][] = [[], [], []];
    private weekDaysArray: string[] = [];
    private splittedVal: string[] = [];
    private hourArray: string[] = [];
    public sessionLengthLabel:string="";
    public durationSelected:string="";
    public loading:boolean = false;
    constructor( private publicConfiguration: Configuration, private router: Router,
        private globalServiceObj: GlobalServiceService, private appUsageDetails: AppGraphService,
        private microServiceUsage: MicroServiceGraphService, private sessionTimeout : SessionTimeout ) {
        this.applicationName = globalServiceObj.applicationName;
    }

    public ngOnInit() {
        this.initialDurSel = this.globalServiceObj.timePeriod;
        this.globalServiceObj.recordForMonitoring = false;
        // this.initializeData();
        if(this.globalServiceObj.selectedRole == "MobileAppsDeveloper") {
            if(this.globalServiceObj.monitoringFailApp) {
                this.errorMessage = "No records found";
                console.log("no records found");
            }
            else {
                console.log("calling fetch graph data");
                this.fetchGraphData();
            }
        }
        else {
        if(this.globalServiceObj.selectedRole == "MicroServiceDeveloper" ) {
            console.log("monitoring fail ms =" + this.globalServiceObj.monitoringFailMS);
            if(this.globalServiceObj.monitoringFailMS) {
                this.errorMessage = "No records found";
                console.log("no records found");
            }
            else {
                console.log("calling fetch graph data");
                this.fetchGraphData();
            }
        }
      }
    }

    //   public lineChartLegend:boolean = true;
    //   public lineChartType:string = 'line';

    public fetchGraphData() {
      console.log("in fetch graph data");
        this.loading = true;
        this.initialDurSel = this.globalServiceObj.timePeriod;
        if ( this.initialDurSel == "Last Hour" ) {
            this.timeCycle = "Hourly";
            this.sessionLengthLabel="In mins";
        } else if ( this.initialDurSel == "Last 24 Hours" ) {
            this.timeCycle = "Daily";
            this.sessionLengthLabel="In mins"
        } else if ( this.initialDurSel == "Last 7 Days" ) {
            this.timeCycle = "Weekly";
            this.sessionLengthLabel="In hours"
        } else {
            this.timeCycle = "Monthly";
            this.sessionLengthLabel="In hours";
        }

        if ( this.globalServiceObj.selectedRole == "MobileAppsDeveloper" ) {
            this.appUsageDetails.getAppMonitoring( this.timeCycle, this.initialType ).subscribe(
                ( data ) => {
                    this.graphData = <AppDetailsGraph>data;

                    if(this.graphData.appUsageData.length > 0) {
                      this.getInitialGraphData();
                    }
                    else {
                      this.loading = false;
                    }
                },

                ( error ) => {
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

        if ( this.globalServiceObj.selectedRole == "MicroServiceDeveloper" ) {
            this.appUsageDetails.getMSMonitoring( this.timeCycle, this.initialType ).subscribe(
                ( data ) => {
                    this.graphDataMS = <MSDetailsGraph>data;
                    if(this.graphDataMS.msUsageData.length > 0) {
                      this.getInitialGraphDataForMS();
                    }
                    else {
                      this.loading = false;
                    }

                },

                ( error ) => {
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
    public getInitialGraphDataForMS() {
    console.log("in initial graph data");
        switch ( this.initialDurSel ) {
            case "Last Hour":
                {
                    this.globalServiceObj.recordForMonitoring = true;
                    //   this.lineChartDataLatency = null;
                    //      this.lineChartDataLatency =[];
                    //  //     this.lineChartLabels = null;
                    //      this.lineChartLabels = [];
                    //      this.lineChartSessionLength=[];
                    //      this.lineChartDataMemoryUsage=[];
                    //      this.lineChartCPUUsage=[];
                    let s: number = 0;
                    let initial: number = 0;
                    this.graphDataMS.msUsageData.forEach(( x ) => {
                        s = 0;
                        if(x.dataPoints.length > 0) {
                        x.dataPoints.forEach(( y ) => {
                            this.dataArrayLatency[initial][s] = y.msLatency;
                            this.dataArraySessionLength[initial][s] = y.revenue;
                            this.dataArrayMemoryUsage[initial][s] = y.memoryUsage;
                            this.dataArrayCPUUsage[initial][s] = y.cpuUsage;
                            s = s + 1;

                        });
                      }
                        initial = initial + 1;
                    });

                    initial = 0;

                    for(var m =0; m < this.graphDataMS.msUsageData.length ; m++ ) {
                      let i: number = 0;
                    if(this.graphDataMS.msUsageData[m].dataPoints.length > 0) {
                    for ( let value of this.graphDataMS.msUsageData[0].dataPoints ) {
                        //   this.dataArrayLatency[i] = value.appLatency;
                        this.splittedVal = value.plotDataPoint.split( "_" );
                        //this.lineLabels[i] = value.plotDataPoint;
                        if ( parseInt( this.splittedVal[2] ) < 10 ) {
                            this.splittedVal[2] = "0" + this.splittedVal[2];
                        }
                        if ( parseInt( this.splittedVal[1] ) < 10 ) {
                            this.splittedVal[1] = "0" + this.splittedVal[1];
                        }
                        this.lineLabels[i] = this.splittedVal[0] + " " +
                        this.splittedVal[1] + ":" + this.splittedVal[2];
                        i++;
                    }
                    break;
                  }
                }

                    for ( let k = 0; k < this.graphDataMS.msUsageData.length; k++ ) {
                      if(this.graphDataMS.msUsageData[k].dataPoints.length > 0) {
                        this.lineChartDataLatency[k] = { data: this.dataArrayLatency[k], label: this.graphDataMS.msUsageData[k].microServiceName };
                        this.lineChartSessionLength[k] = { data: this.dataArraySessionLength[k], label: this.graphDataMS.msUsageData[k].microServiceName };
                        this.lineChartDataMemoryUsage[k] = { data: this.dataArrayMemoryUsage[k], label: this.graphDataMS.msUsageData[k].microServiceName };
                        this.lineChartCPUUsage[k] = { data: this.dataArrayCPUUsage[k], label: this.graphDataMS.msUsageData[k].microServiceName };
                      }
                    }
                    //   this.globalServiceObj.recordForMonitoring = true;
                    break;

                } case "Last 24 Hours":
                {
                    this.globalServiceObj.recordForMonitoring = true;

                    //  this.dataArrayLatency=[[],[]];
                    //  this.dataArraySessionLength=[[],[]];
                    //    this.dataArrayMemoryUsage=[[],[]];
                    //    this.dataArraySessionLength=[[],[]];
                    let s: number = 0;
                    let initial: number = 0;
                    this.graphDataMS.msUsageData.forEach(( x ) => {
                        s = 0;
                          if(x.dataPoints.length > 0) {
                        x.dataPoints.forEach(( y ) => {
                            this.dataArrayLatency[initial][s] = y.msLatency;
                            this.dataArraySessionLength[initial][s] = y.revenue;
                            this.dataArrayMemoryUsage[initial][s] = y.memoryUsage;
                            this.dataArrayCPUUsage[initial][s] = y.cpuUsage;
                            s = s + 1;
                        });
                      }
                        initial = initial + 1;
                    });

                    initial = 0;

                    for(var m =0; m < this.graphDataMS.msUsageData.length ; m++ ) {
                        let i: number = 0;
                    if(this.graphDataMS.msUsageData[m].dataPoints.length > 0) {
                    for ( let value of this.graphDataMS.msUsageData[m].dataPoints ) {
                        //   this.dataArrayLatency[i] = value.appLatency;
                        this.splittedVal = value.plotDataPoint.split( "_" );
                        //this.lineLabels[i] = this.splittedVal[0] + "_" + this.splittedVal[1];
                        if ( parseInt( this.splittedVal[1] ) < 10 ) {
                            this.splittedVal[1] = "0" + this.splittedVal[1];
                        }
                        this.lineLabels[i] = this.splittedVal[0] + " " + this.splittedVal[1] + ":00";
                        i++;
                    }
                    break;
                  }
                }

                    for ( let k = 0; k < this.graphDataMS.msUsageData.length; k++ ) {
                        if(this.graphDataMS.msUsageData[k].dataPoints.length > 0) {
                        this.lineChartDataLatency[k] = { data: this.dataArrayLatency[k], label: this.graphDataMS.msUsageData[k].microServiceName };
                        this.lineChartSessionLength[k] = { data: this.dataArraySessionLength[k], label: this.graphDataMS.msUsageData[k].microServiceName };
                        this.lineChartDataMemoryUsage[k] = { data: this.dataArrayMemoryUsage[k], label: this.graphDataMS.msUsageData[k].microServiceName };
                        this.lineChartCPUUsage[k] = { data: this.dataArrayCPUUsage[k], label: this.graphDataMS.msUsageData[k].microServiceName };
                    }
                  }
                    // this.globalServiceObj.recordForMonitoring = true;
                    break;

                }

            case "Last 7 Days":
                {
                    this.globalServiceObj.recordForMonitoring = true;
                    let s: number = 0;
                    let initial: number = 0;
                    this.graphDataMS.msUsageData.forEach(( x ) => {
                        s = 0;
                        if(x.dataPoints.length > 0) {
                        x.dataPoints.forEach(( y ) => {
                            this.dataArrayLatency[initial][s] = y.msLatency;
                            this.dataArraySessionLength[initial][s] = y.revenue;
                            this.dataArrayMemoryUsage[initial][s] = y.memoryUsage;
                            this.dataArrayCPUUsage[initial][s] = y.cpuUsage;
                            s = s + 1;
                        });
                      }
                        initial = initial + 1;
                    });

                    initial = 0;

                    for(var m =0; m < this.graphDataMS.msUsageData.length ; m++ ) {
                        let i: number = 0;
                    if(this.graphDataMS.msUsageData[m].dataPoints.length > 0) {
                    for ( let value of this.graphDataMS.msUsageData[m].dataPoints ) {
                        //   this.dataArrayLatency[i] = value.appLatency;
                        this.splittedVal = value.plotDataPoint.split( "_" );
                        this.lineLabels[i] = value.plotDataPoint;
                        i++;
                    }
                    break;
                  }
                }
                    for ( let k = 0; k < this.graphDataMS.msUsageData.length; k++ ) {
                      if(this.graphDataMS.msUsageData[k].dataPoints.length >0){
                        this.lineChartDataLatency[k] = { data: this.dataArrayLatency[k], label: this.graphDataMS.msUsageData[k].microServiceName };
                        this.lineChartSessionLength[k] = { data: this.dataArraySessionLength[k], label: this.graphDataMS.msUsageData[k].microServiceName };
                        this.lineChartDataMemoryUsage[k] = { data: this.dataArrayMemoryUsage[k], label: this.graphDataMS.msUsageData[k].microServiceName };
                        this.lineChartCPUUsage[k] = { data: this.dataArrayCPUUsage[k], label: this.graphDataMS.msUsageData[k].microServiceName };
                    }
                  }
                    break;

                }
            case "Last 30 Days":
                {
                    this.globalServiceObj.recordForMonitoring = true;
                    let s: number = 0;
                    let initial: number = 0;
                    this.graphDataMS.msUsageData.forEach(( x ) => {
                        s = 0;
                        if(x.dataPoints.length > 0) {
                        x.dataPoints.forEach(( y ) => {
                            this.dataArrayLatency[initial][s] = y.msLatency;
                            this.dataArraySessionLength[initial][s] = y.revenue;
                            this.dataArrayMemoryUsage[initial][s] = y.memoryUsage;
                            this.dataArrayCPUUsage[initial][s] = y.cpuUsage;
                            s = s + 1;
                        });
                      }
                        initial = initial + 1;
                    });

                    initial = 0;

                    for(var m =0; m < this.graphDataMS.msUsageData.length ; m++ ) {
                        let i: number = 0;
                    if(this.graphDataMS.msUsageData[m].dataPoints.length > 0) {
                    for ( let value of this.graphDataMS.msUsageData[m].dataPoints ) {
                        //   this.dataArrayLatency[i] = value.appLatency;
                        this.splittedVal = value.plotDataPoint.split( "_" );
                        this.lineLabels[i] = value.plotDataPoint;
                        i++;
                    }
                  }
                }
                    for ( let k = 0; k < this.graphDataMS.msUsageData.length; k++ ) {
                      if(this.graphDataMS.msUsageData[k].dataPoints.length > 0) {
                        this.lineChartDataLatency[k] = { data: this.dataArrayLatency[k], label: this.graphDataMS.msUsageData[k].microServiceName };
                        this.lineChartSessionLength[k] = { data: this.dataArraySessionLength[k], label: this.graphDataMS.msUsageData[k].microServiceName };
                        this.lineChartDataMemoryUsage[k] = { data: this.dataArrayMemoryUsage[k], label: this.graphDataMS.msUsageData[k].microServiceName };
                        this.lineChartCPUUsage[k] = { data: this.dataArrayCPUUsage[k], label: this.graphDataMS.msUsageData[k].microServiceName };
                    }
                  }
                    break;
                }

        }
        console.log("after switch");
        this.lineChartLabels = this.lineLabels;

        if ( this.graphDataMS.msUsageData.length == 1 ) {

            //  Yellow
            this.lineChartColors = [{
                backgroundColor: "rgba(255,194,0,0.2)",
                borderColor: "rgba(255,194,0,1)",
                pointBackgroundColor: "rgba(255,194,0,1)",
                pointBorderColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "rgba(148,159,177,0.8)",
                fill: false,
            }];
        } else if ( this.graphDataMS.msUsageData.length == 2 ) {

            this.lineChartColors = [{
                backgroundColor: "rgba(255,194,0,0.2)",
                borderColor: "rgba(255,194,0,1)",
                pointBackgroundColor: "rgba(255,194,0,1)",
                pointBorderColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "rgba(148,159,177,0.8)",
                fill: false,
            },
                {
                    //  grey
                    backgroundColor: "rgba(0,0,255,0.2)",
                    borderColor: "rgba(0,0,255,1)",
                    pointBackgroundColor: "rgba(0,0,255,1)",
                    pointBorderColor: "#fff",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgba(148,159,177,0.8)",
                    fill: false,
                }];

        } else if ( this.graphDataMS.msUsageData.length == 3 ) {
            this.lineChartColors = [{
                backgroundColor: "rgba(255,194,0,0.2)",
                borderColor: "rgba(255,194,0,1)",
                pointBackgroundColor: "rgba(255,194,0,1)",
                pointBorderColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "rgba(148,159,177,0.8)",
                fill: false,
            },
                {
                    //  grey
                    backgroundColor: "rgba(0,0,255,0.2)",
                    borderColor: "rgba(0,0,255,1)",
                    pointBackgroundColor: "rgba(0,0,255,1)",
                    pointBorderColor: "#fff",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgba(148,159,177,0.8)",
                    fill: false,
                },

                {
                    //  grey
                    backgroundColor: "rgba(128,0,128,0.2)",
                    borderColor: "rgba(128,0,128,1)",
                    pointBackgroundColor: "rgba(128,0,128,1)",
                    pointBorderColor: "#fff",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgba(148,159,177,0.8)",
                    fill: false,
                }];
        }
        console.log("if over");
        this.lineChartLegend = true;
        this.lineChartType = "line";
		this.lineChartOptions = {
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
            this.loading = false;
            console.log("end. loading = "+ this.loading)
    }

    public getInitialGraphData() {

      console.log("in get initial graph data");
        switch ( this.initialDurSel ) {
            case "Last Hour":
                {
                    this.globalServiceObj.recordForMonitoring = true;
                    //   this.lineChartDataLatency = null;
                    //      this.lineChartDataLatency =[];
                    //  //     this.lineChartLabels = null;
                    //      this.lineChartLabels = [];
                    //      this.lineChartSessionLength=[];
                    //      this.lineChartDataMemoryUsage=[];
                    //      this.lineChartCPUUsage=[];
                    let s: number = 0;
                    let initial: number = 0;
                    this.graphData.appUsageData.forEach(( x ) => {
                        s = 0;
                        if(x.dataPoints.length >0) {
                        x.dataPoints.forEach(( y ) => {
                            this.dataArrayLatency[initial][s] = y.appLatency;
                            this.dataArraySessionLength[initial][s] = y.sessionLength;
                            this.dataArrayMemoryUsage[initial][s] = y.memoryUsage;
                            this.dataArrayCPUUsage[initial][s] = y.cpuUsage;
                            s = s + 1;
                        });
                      }
                        initial = initial + 1;
                    });

                    initial = 0;

                    for(var m =0 ; m < this.graphData.appUsageData.length ; m++) {
                        let i: number = 0;
                      if(this.graphData.appUsageData[m].dataPoints.length > 0) {
                    for ( let value of this.graphData.appUsageData[0].dataPoints ) {
                        //   this.dataArrayLatency[i] = value.appLatency;
                        this.splittedVal = value.plotDataPoint.split( "_" );
                        //this.lineLabels[i] = value.plotDataPoint;
                        if ( parseInt( this.splittedVal[2] ) < 10 ) {
                            this.splittedVal[2] = "0" + this.splittedVal[2];
                        }
                        if ( parseInt( this.splittedVal[1] ) < 10 ) {
                            this.splittedVal[1] = "0" + this.splittedVal[1];
                        }
                        this.lineLabels[i] = this.splittedVal[0] + " " +
                        this.splittedVal[1] + ":" + this.splittedVal[2];
                        i++;
                      }
                    break;
                    }
                  }
                    for ( let k = 0; k < this.graphData.appUsageData.length; k++ ) {
                      if(this.graphData.appUsageData[k].dataPoints.length > 0) {
                        this.lineChartDataLatency[k] = { data: this.dataArrayLatency[k], label: this.graphData.appUsageData[k].applicationName };
                        this.lineChartSessionLength[k] = { data: this.dataArraySessionLength[k], label: this.graphData.appUsageData[k].applicationName };
                        this.lineChartDataMemoryUsage[k] = { data: this.dataArrayMemoryUsage[k], label: this.graphData.appUsageData[k].applicationName };
                        this.lineChartCPUUsage[k] = { data: this.dataArrayCPUUsage[k], label: this.graphData.appUsageData[k].applicationName };
                    }
                  }
                    //   this.globalServiceObj.recordForMonitoring = true;
                    break;

                } case "Last 24 Hours":
                {
                    this.globalServiceObj.recordForMonitoring = true;

                    //  this.dataArrayLatency=[[],[]];
                    //  this.dataArraySessionLength=[[],[]];
                    //    this.dataArrayMemoryUsage=[[],[]];
                    //    this.dataArraySessionLength=[[],[]];
                    let s: number = 0;
                    let initial: number = 0;
                    this.graphData.appUsageData.forEach(( x ) => {
                        s = 0;
                          if(x.dataPoints.length >0) {
                        x.dataPoints.forEach(( y ) => {
                            this.dataArrayLatency[initial][s] = y.appLatency;
                            this.dataArraySessionLength[initial][s] = y.sessionLength;
                            this.dataArrayMemoryUsage[initial][s] = y.memoryUsage;
                            this.dataArrayCPUUsage[initial][s] = y.cpuUsage;
                            s = s + 1;
                        });
                      }
                        initial = initial + 1;
                    });

                    initial = 0;

                    for(var m =0 ; m < this.graphData.appUsageData.length ; m++) {
                        let i: number = 0;

                      if(this.graphData.appUsageData[m].dataPoints.length > 0) {
                    for ( let value of this.graphData.appUsageData[m].dataPoints ) {
                        //   this.dataArrayLatency[i] = value.appLatency;
                        this.splittedVal = value.plotDataPoint.split( "_" );
                        //this.lineLabels[i] = this.splittedVal[0] + "_" + this.splittedVal[1];
                        if ( parseInt( this.splittedVal[1] ) < 10 ) {
                            this.splittedVal[1] = "0" + this.splittedVal[1];
                        }
                        this.lineLabels[i] = this.splittedVal[0] + " " + this.splittedVal[1] + ":00";
                        i++;
                    }
                    break;
                  }
                }

                    for ( let k = 0; k < this.graphData.appUsageData.length; k++ ) {
                      if(this.graphData.appUsageData[k].dataPoints.length > 0) {
                        this.lineChartDataLatency[k] = { data: this.dataArrayLatency[k], label: this.graphData.appUsageData[k].applicationName };
                        this.lineChartSessionLength[k] = { data: this.dataArraySessionLength[k], label: this.graphData.appUsageData[k].applicationName };
                        this.lineChartDataMemoryUsage[k] = { data: this.dataArrayMemoryUsage[k], label: this.graphData.appUsageData[k].applicationName };
                        this.lineChartCPUUsage[k] = { data: this.dataArrayCPUUsage[k], label: this.graphData.appUsageData[k].applicationName };
                    }
                  }
                    // this.globalServiceObj.recordForMonitoring = true;
                    break;

                }

            case "Last 7 Days":
                {
                    this.globalServiceObj.recordForMonitoring = true;
                    let s: number = 0;
                    let initial: number = 0;
                    this.graphData.appUsageData.forEach(( x ) => {
                        s = 0;
                        if(x.dataPoints.length > 0) {
                        x.dataPoints.forEach(( y ) => {
                            this.dataArrayLatency[initial][s] = y.appLatency;
                            this.dataArraySessionLength[initial][s] = y.sessionLength;
                            this.dataArrayMemoryUsage[initial][s] = y.memoryUsage;
                            this.dataArrayCPUUsage[initial][s] = y.cpuUsage;
                            s = s + 1;
                        });
                      }
                        initial = initial + 1;
                    });

                    initial = 0;

                    for(var m =0 ; m < this.graphData.appUsageData.length ; m++) {
                        let i: number = 0;
                      if(this.graphData.appUsageData[m].dataPoints.length > 0) {
                    for ( let value of this.graphData.appUsageData[m].dataPoints ) {
                        //   this.dataArrayLatency[i] = value.appLatency;
                        this.splittedVal = value.plotDataPoint.split( "_" );
                        this.lineLabels[i] = value.plotDataPoint;
                        i++;
                    }
                    break;
                  }
                }

                    for ( let k = 0; k < this.graphData.appUsageData.length; k++ ) {
                      if(this.graphData.appUsageData[k].dataPoints.length > 0) {
                        this.lineChartDataLatency[k] = { data: this.dataArrayLatency[k], label: this.graphData.appUsageData[k].applicationName };
                        this.lineChartSessionLength[k] = { data: this.dataArraySessionLength[k], label: this.graphData.appUsageData[k].applicationName };
                        this.lineChartDataMemoryUsage[k] = { data: this.dataArrayMemoryUsage[k], label: this.graphData.appUsageData[k].applicationName };
                        this.lineChartCPUUsage[k] = { data: this.dataArrayCPUUsage[k], label: this.graphData.appUsageData[k].applicationName };
                    }
                  }
                    break;

                }
            case "Last 30 Days":
                {
                    this.globalServiceObj.recordForMonitoring = true;
                    let s: number = 0;
                    let initial: number = 0;
                    this.graphData.appUsageData.forEach(( x ) => {
                        s = 0;
                        if(x.dataPoints.length > 0) {
                        x.dataPoints.forEach(( y ) => {
                            this.dataArrayLatency[initial][s] = y.appLatency;
                            this.dataArraySessionLength[initial][s] = y.sessionLength;
                            this.dataArrayMemoryUsage[initial][s] = y.memoryUsage;
                            this.dataArrayCPUUsage[initial][s] = y.cpuUsage;
                            s = s + 1;
                        });
                      }
                        initial = initial + 1;
                    });

                    initial = 0;

                    for(var m =0 ; m < this.graphData.appUsageData.length ; m++) {
                        let i: number = 0;
                      if(this.graphData.appUsageData[m].dataPoints.length > 0) {
                    for ( let value of this.graphData.appUsageData[m].dataPoints ) {
                        //   this.dataArrayLatency[i] = value.appLatency;
                        this.splittedVal = value.plotDataPoint.split( "_" );
                        this.lineLabels[i] = value.plotDataPoint;
                        i++;
                    }
                    break;
                  }
                }

                    for ( let k = 0; k < this.graphData.appUsageData.length; k++ ) {
                      if(this.graphData.appUsageData[k].dataPoints.length > 0) {
                        this.lineChartDataLatency[k] = { data: this.dataArrayLatency[k], label: this.graphData.appUsageData[k].applicationName };
                        this.lineChartSessionLength[k] = { data: this.dataArraySessionLength[k], label: this.graphData.appUsageData[k].applicationName };
                        this.lineChartDataMemoryUsage[k] = { data: this.dataArrayMemoryUsage[k], label: this.graphData.appUsageData[k].applicationName };
                        this.lineChartCPUUsage[k] = { data: this.dataArrayCPUUsage[k], label: this.graphData.appUsageData[k].applicationName };
                    }
                  }
                    break;

                }

        }
        console.log("switch over");

        this.lineChartLabels = this.lineLabels;

        if ( this.graphData.appUsageData.length == 1 ) {

            //  Yellow
            this.lineChartColors = [{
                backgroundColor: "rgba(255,194,0,0.2)",
                borderColor: "rgba(255,194,0,1)",
                pointBackgroundColor: "rgba(255,194,0,1)",
                pointBorderColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "rgba(148,159,177,0.8)",
                fill: false,
            }];
        } else if ( this.graphData.appUsageData.length == 2 ) {

            this.lineChartColors = [{
                backgroundColor: "rgba(255,194,0,0.2)",
                borderColor: "rgba(255,194,0,1)",
                pointBackgroundColor: "rgba(255,194,0,1)",
                pointBorderColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "rgba(148,159,177,0.8)",
                fill: false,
            },
                {
                    //  grey
                    backgroundColor: "rgba(0,0,255,0.2)",
                    borderColor: "rgba(0,0,255,1)",
                    pointBackgroundColor: "rgba(0,0,255,1)",
                    pointBorderColor: "#fff",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgba(148,159,177,0.8)",
                    fill: false,
                }];

        } else if ( this.graphData.appUsageData.length == 3 ) {
            this.lineChartColors = [{
                backgroundColor: "rgba(255,194,0,0.2)",
                borderColor: "rgba(255,194,0,1)",
                pointBackgroundColor: "rgba(255,194,0,1)",
                pointBorderColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "rgba(148,159,177,0.8)",
                fill: false,
            },
                {
                    //  grey
                    backgroundColor: "rgba(0,0,255,0.2)",
                    borderColor: "rgba(0,0,255,1)",
                    pointBackgroundColor: "rgba(0,0,255,1)",
                    pointBorderColor: "#fff",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgba(148,159,177,0.8)",
                    fill: false,
                },

                {
                    //  grey
                    backgroundColor: "rgba(128,0,128,0.2)",
                    borderColor: "rgba(128,0,128,1)",
                    pointBackgroundColor: "rgba(128,0,128,1)",
                    pointBorderColor: "#fff",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgba(148,159,177,0.8)",
                    fill: false,
                }];
        }
        console.log("after if");
        //  this.lineChartColors = [
        //    { //  grey
        //      backgroundColor: 'rgba(148,159,177,0.2)',
        //      borderColor: 'rgba(148,159,177,1)',
        //      pointBackgroundColor: 'rgba(148,159,177,1)',
        //      pointBorderColor: '#fff',
        //      pointHoverBackgroundColor: '#fff',
        //      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
        //    }
        //  ];
        this.lineChartLegend = true;
        this.lineChartType = "line";
		this.lineChartOptions = {
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
            console.log("colors done");
        this.loading = false;
        console.log("loading=" + this.loading);
    }


}
