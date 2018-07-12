import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Configuration } from "../app.constants";
import {GlobalServiceService} from "../global-service.service";
import { Profile } from "../common-services/profile.model";
import {ProfileServiceService} from "../common-services/profile.service";
import {Credits, CloudletUsage, CloudletDashboard, DataMappings} from "./dashboardNewCoModel";
import {SignUp} from "../sign-up/sign-up.model";
import {EdgeListingService} from "../paas-admin/edge-listing.service";
import { EdgePresent, Resources, UsageCharge} from "../paas-admin/edgePresent";
import {NewCoDashboardService} from "./dashboard-new-co.service";
import { SessionTimeout } from "../common-services/session-timeout";

@Component({
    selector: "app-dashboard-new-co",
    templateUrl: "./dashboard-new-co.component.html",
    styleUrls: ["./dashboard-new-co.component.css"],
    providers: [NewCoDashboardService,SessionTimeout]
})
export class DashboardNewCoComponent implements OnInit {
    public edgePresentFlag = true;
    public cloudletUsage = new CloudletUsage();
    public barChartData: Array<any>;
    public barChartColors: Array<any>;
    public barChartOptions: any;
    public barChartType: string;
    public lineChartLegend: boolean = true;
    public loading:boolean = false;
    private userDetails = new Profile();
    private creditsObj: Credits = new Credits();
    private errorMessage: string;
    private allOnboardedEdge: EdgePresent[];
    private userList: SignUp[];
    private detailsError1: boolean = false;
    private detailsError2: boolean = false;
    private detailsError3: boolean = false;
    private detailsError4: boolean = false;
    private detailsError5: boolean = false;
    private detailsError6: boolean = false;
    private detailsError7: boolean = false;
    private memoryGraph: CloudletDashboard;
    private cpuGraph: CloudletDashboard;
    private latencyGraph: CloudletDashboard;
    private dataArray: number[] = [];
    private labelArray: string[] = [];
    private dataArrayLatency: string[][] = [[], [], []];
    private labelArrayLatency: string[] = [];
    private lineChartDataLatency: Array<any> = [];
    private lineChartOptionsLatency: any;
    private lineChartTypeLatency: string;
    private labelArrayMemory: string[] = [];
    private labelArrayCPU: string[] = [];
    private appNameLabels: string[] = [];
    private appNameLabelsCPU: string[] = [];
    private appNameLabelsMemory: string[] = [];
    private lineChartColorsLatency: Array<any>;
    private lineChartDataCPU: Array<any> = [];
    private lineChartDataMemory: Array<any> = [];
    private lineChartOptionsCPU: any;
    private lineChartOptionsMemory: any;
    private lineChartColorsCPU: Array<any>;
    private lineChartColorsMemory: Array<any>;
    private dataArrayCPU: string[][] = [[], [], []];
    private dataArrayMemory: string[][] = [[], [], []];
    private appNameLabelsUsers: string[] = [];
    private dataArrayLatencyUser: string[][] = [[], [], []];
    private labelArrayUser: string[] = [];
    private barRecordFlag: boolean = false;
    private divBarShow: boolean = false;
    private lineLatencyFlag: boolean = false;
    private divLatencyShow: boolean = false;
    private lineCPUFlag: boolean = false;
    private divCPUShow: boolean = false;
    private lineMemoryFlag: boolean = false;
    private divMemoryShow: boolean = false;
    private lineUserFlag: boolean = false;
    private userBarShow: boolean = false;


    constructor(private publicConfiguration: Configuration, private router: Router,
        private edgeListService: EdgeListingService,
        private globalServiceObj: GlobalServiceService,
        private newCoDashboardService: NewCoDashboardService,
        private profileObj: ProfileServiceService, private sessionTimeout : SessionTimeout) {

    }

    public ngOnInit() {
        if (this.globalServiceObj.selectedRole == "TelcoDeveloper") {
            this.globalServiceObj.operator = this.globalServiceObj.companyName;
            this.fetchDashboardData();
        } else {
            //this.globalservice.selectedRole = "TelcoDeveloper"
            this.fetchDashboardData();
        }

    }

    public changeOperator() {
        //this.globalServiceObj.operator = operator;
        this.fetchDashboardData();

    }

    public fetchPresentEdge() {
        this.loading = true;
        this.edgeListService.getEdgeList().subscribe(
            (data) => {
                this.allOnboardedEdge = <EdgePresent[]>data[0];
                this.userList = <SignUp[]>data[1];
                //   this.allOnboardedEdge = <EdgePresent[]>data;
                if (this.allOnboardedEdge.length == 0) {
                    this.edgePresentFlag = false;
                    this.errorMessage = "No records found";
                }
                else {
                    this.edgePresentFlag = true;
                    if (this.userList.length != 0) {
                        for (let i = 0; i < this.userList.length; i++) {
                            if (this.checkUniqueOperator(this.userList[i].companyName)) {
                                this.globalServiceObj.operatorsList.push(this.userList[i].companyName);
                            }
                        }
                        this.globalServiceObj.operator = this.globalServiceObj.operatorsList[0];

                        this.fetchDashboardData();
                    }
                }

            },
            (error) => {
                this.edgePresentFlag = false;
                this.sessionTimeout.checkSession(error);
                if (error.json().message == null || error.json().message == undefined || error.json().message == "") {
                    this.errorMessage = "Edge data could not be fetched";
                }
                else {
                    this.errorMessage = error.json().message;
                }
                this.loading = false;
            }
        );

    }
    public checkUniqueOperator(operator: string) {
        let flag = true;
        for (let i = 0; i < this.globalServiceObj.operatorsList.length; i++) {
            if (this.globalServiceObj.operatorsList[i] == operator)
                flag = false;
        }
        return flag;
    }


    public fetchDashboardData() {
        this.loading = true;
        this.reinitialize();
        this.profileObj.getUserDetail().subscribe(
            data => {
                this.userDetails = <Profile>data;
                this.creditsObj.creditsAvailable = this.userDetails.credits;
                this.loading = false;
            },
            (error) => {
                this.detailsError7 = true;
                this.sessionTimeout.checkSession(error);
                if (error.status) {
                    this.errorMessage = error.json().message + " " + error.status;
                }
                else {
                    this.errorMessage = error.json().message;
                }
                this.loading = false;
            }
        );

        this.loading = true;
        this.newCoDashboardService.getAppsDash('memoryUsage').subscribe(
            data => {
                this.cloudletUsage = <CloudletUsage>data;
                this.loading = false;
            },

            (error) => {
                this.detailsError1 = true;
                this.sessionTimeout.checkSession(error);
                if (error.status) {
                    this.errorMessage = error.json().message + " " + error.status;
                }
                else {
                    this.errorMessage = error.json().message;
                }
                this.loading = false;
            }
    		  );

          this.loading = true;
        this.latencyGraph = new CloudletDashboard();
        this.newCoDashboardService.getAppsDash('latency').subscribe(
            data => {
                this.latencyGraph.dataMappings = <DataMappings[]>data;
                if (this.latencyGraph.dataMappings.length != 0) {
                    this.makeLineGraphForLatency(this.latencyGraph);
                }
                else {
                  this.lineLatencyFlag = false;
                  this.divLatencyShow = true;
                  this.loading = false;
                }
            },

            (error) => {
                this.detailsError3 = true;
                this.sessionTimeout.checkSession(error);
                if (error.status) {
                    this.errorMessage = error.json().message + " " + error.status;
                }
                else {
                    this.errorMessage = error.json().message;
                }
                this.loading = false;
            }
    		  );
        //
        this.loading = true;
        this.cpuGraph = new CloudletDashboard();
        this.newCoDashboardService.getAppsDash('cpuUsage').subscribe(
            data => {
                this.cpuGraph.dataMappings = <DataMappings[]>data;
                if (this.cpuGraph.dataMappings.length != 0) {
                    this.makeLineGraphForCPU(this.cpuGraph);
                }
                else {
                this.lineCPUFlag = false;
                this.divCPUShow = true;
                this.loading = false;
                }
            },

            (error) => {
                this.detailsError5 = true;
                this.sessionTimeout.checkSession(error);
                if (error.status) {
                    this.errorMessage = error.json().message + " " + error.status;
                }
                else {
                    this.errorMessage = error.json().message;
                }
                this.loading = false;
            }
    		  );
          this.loading = true;
        this.memoryGraph = new CloudletDashboard();
        this.newCoDashboardService.getAppsDash('memory').subscribe(
            data => {
                this.memoryGraph.dataMappings = <DataMappings[]>data;
                if (this.memoryGraph.dataMappings.length != 0) {
                    this.makeLineGraphForMemory(this.memoryGraph);
                }
                else {
                this.lineMemoryFlag = false;
                this.divMemoryShow = true;
                this.loading = false;
                }
            },

            (error) => {
                this.detailsError5 = true;
                this.sessionTimeout.checkSession(error);
                if (error.status) {
                    this.errorMessage = error.json().message + " " + error.status;
                }
                else {
                    this.errorMessage = error.json().message;
                }
                this.loading = false;
            }
        );


    }

    public makeLineGraphForLatency(graph: CloudletDashboard) {
      this.loading = true;
        this.lineLatencyFlag = true;
        this.divLatencyShow = true;
        let i: number = 0;
        for (let value of graph.dataMappings) {
            this.appNameLabels[i] = value.name;
			if ( value.dataPoints.length == 1 ) {
                this.dataArrayLatency[i][0] = null;
                this.dataArrayLatency[i][1] = value.dataPoints[0].metric;
                this.dataArrayLatency[i][2] = null;
            }
            else {
				let j: number = 0;
				for (let pointData of value.dataPoints) {
					this.dataArrayLatency[i][j] = pointData.metric;
					j++;
				}
			}
            i++;
        }
		if ( graph.dataMappings[0].dataPoints.length == 1 ) {
            this.labelArrayLatency[0] = '';
            this.labelArrayLatency[1] = graph.dataMappings[0].dataPoints[0].dateAndTime;
            this.labelArrayLatency[2] = '';
        }
        else {
			let k: number = 0;
			for (let labelVal of graph.dataMappings[0].dataPoints) {
				this.labelArrayLatency[k] = labelVal.dateAndTime;
				k++;
			}
		}
		for (let k = 0; k < graph.dataMappings.length; k++) {
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
        this.loading = false;
    }


    public makeLineGraphForCPU(graph: CloudletDashboard) {
        this.lineCPUFlag = true;
        this.loading = true;
        this.divCPUShow = true;
        let i: number = 0;
        for (let value of graph.dataMappings) {
            this.appNameLabelsCPU[i] = value.name;
			if ( value.dataPoints.length == 1 ) {
                this.dataArrayCPU[i][0] = null;
                this.dataArrayCPU[i][1] = value.dataPoints[0].metric;
                this.dataArrayCPU[i][2] = null;
            }
            else {
				let j: number = 0;
				for (let pointData of value.dataPoints) {
					this.dataArrayCPU[i][j] = pointData.metric;
					j++;
				}
			}
			i++;
        }
		if ( graph.dataMappings[0].dataPoints.length == 1 ) {
            this.labelArrayCPU[0] = '';
            this.labelArrayCPU[1] = graph.dataMappings[0].dataPoints[0].dateAndTime;
            this.labelArrayCPU[2] = '';
        }
        else {
			let k: number = 0;
			for (let labelVal of graph.dataMappings[0].dataPoints) {
				this.labelArrayCPU[k] = labelVal.dateAndTime;
				k++;
			}
		}
        for (let k = 0; k < graph.dataMappings.length; k++) {
            this.lineChartDataCPU[k] = { data: this.dataArrayCPU[k], label: this.appNameLabelsCPU[k] };
        }
        this.lineChartOptionsCPU = {
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
        this.lineChartColorsCPU = [
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
        this.loading = false;
    }

    public makeLineGraphForMemory(graph: CloudletDashboard) {
        this.loading = true;
        this.lineMemoryFlag = true;
        this.divMemoryShow = true;
        let i: number = 0;
        for (let value of graph.dataMappings) {
            this.appNameLabelsMemory[i] = value.name;
			if ( value.dataPoints.length == 1 ) {
                this.dataArrayMemory[i][0] = null;
                this.dataArrayMemory[i][1] = value.dataPoints[0].metric;
                this.dataArrayMemory[i][2] = null;
            }
            else {
				let j: number = 0;
				for (let pointData of value.dataPoints) {
					this.dataArrayMemory[i][j] = pointData.metric;
					j++;
				}
			}
            i++;
        }
		if ( graph.dataMappings[0].dataPoints.length == 1 ) {
            this.labelArrayMemory[0] = '';
            this.labelArrayMemory[1] = graph.dataMappings[0].dataPoints[0].dateAndTime;
            this.labelArrayMemory[2] = '';
        }
        else {
			let k: number = 0;
			for (let labelVal of graph.dataMappings[0].dataPoints) {
				this.labelArrayMemory[k] = labelVal.dateAndTime;
				k++;
			}
		}
        for (let k = 0; k < graph.dataMappings.length; k++) {
            this.lineChartDataMemory[k] = { data: this.dataArrayMemory[k], label: this.appNameLabelsMemory[k] };
        }
        this.lineChartOptionsMemory = {
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
        this.lineChartColorsMemory = [
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
        this.loading = false;
    }

    public reinitialize() {
        this.detailsError1 = false;
        this.detailsError2 = false;
        this.detailsError3 = false;
        this.detailsError4 = false;
        this.detailsError5 = false;
        this.detailsError6 = false;
        this.detailsError7 = false;
        this.dataArray = [];
        this.labelArray = [];
        this.dataArrayLatency = [[], [], []];
        this.labelArrayLatency = [];
        this.lineChartDataLatency = [];
        this.lineChartLegend = true;
        this.labelArrayMemory = [];
        this.labelArrayCPU = [];
        this.appNameLabels = [];
        this.appNameLabelsCPU = [];
        this.appNameLabelsMemory = [];
        this.lineChartDataCPU = [];
        this.lineChartDataMemory = [];

        this.dataArrayCPU = [[], [], []];
        this.dataArrayMemory = [[], [], []];
        this.appNameLabelsUsers = [];
        this.dataArrayLatencyUser = [[], [], []];
        this.labelArrayUser = [];
        this.barRecordFlag = false;
        this.divBarShow = false;
        this.lineLatencyFlag = false;
        this.divLatencyShow = false;
        this.lineCPUFlag = false;
        this.divCPUShow = false;
        this.lineMemoryFlag = false;
        this.divMemoryShow = false;
        this.lineUserFlag = false;
        this.userBarShow = false;
    }

}
