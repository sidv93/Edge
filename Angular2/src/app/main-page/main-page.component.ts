import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { Configuration } from "../app.constants";
import { MicroServiceMetadata } from "../common-services/microServiceMetadata";
import { MobileAppMetadata } from "../common-services/mobileAppsMetadata";
import { GlobalServiceService } from "../global-service.service";
import { MicroServiceService } from "../micro-service/micro-service.service";
import { MainPageService } from "./main-page.service";
import { MobileAppService } from "../mobile-app/mobile-app.service";
import { MonitoringComponent } from "../monitoring/monitoring.component";
import { VMIComponent } from "../vmi/vmi.component";
import { AppUsageDetailsForVMI } from "../vmi/vmi.service";
import { NewCoDashboardService } from "../dashboard-new-co/dashboard-new-co.service";
import { EdgePresent, Resources, UsageCharge } from "../paas-admin/edgePresent";
import { SignUp } from "../sign-up/sign-up.model";
import { SessionTimeout } from "../common-services/session-timeout";

@Component( {
    selector: "app-main-page",
    templateUrl: "./main-page.component.html",
    providers: [Configuration, MobileAppService, MonitoringComponent, MicroServiceService,
        VMIComponent, AppUsageDetailsForVMI, MainPageService, SessionTimeout],
} )
export class MainPageComponent implements OnInit {
    public microServiceDeveloper = false;
    public feedbackFile: string = "";
    public invalidFeedback: boolean = false;
    public feedbackSubmitted: boolean = false;
    public mobileAppDeveloper = false;
    public telcoDeveloper = false;
    public newcoDeveloper = false;
    public userName: string;
    public flagMicro: boolean = false;
    public flagMobile: boolean = false;
    public flagCloud: boolean = false;
    public roles: string[] = [];
    public rolesToDisplay: string[] = [];
    public selectedRole: string;
    public monitoring: boolean = false;
    public vmiMonitoring: boolean = false;
    public appName: string[] = [];
    public mobileAppMetadata: MobileAppMetadata[] = [];
    public microServiceMetadata: MicroServiceMetadata[] = [];
    public errorMessage: string;
    public checkboxName = "Last 30 Days";
    public maxCount = 3;
    public counterForName = 1;
    public count = 0;
    public feedbackText: string;
    public counter_Load: number = 1;
    public highlightedDiv: number = 1;
    public checks: check[] = [
        { name: "Last Hour", isPrepared: false },
        { name: "Last 24 Hours", isPrepared: false },
        { name: "Last 7 Days", isPrepared: false },
        { name: "Last 30 Days", isPrepared: true },
    ];
    public checkBoxValue: boolean[] = [false];
    private feedbackSource = "assets/image/icons/feedback.png";
    private accountSource = "assets/image/icons/user.png";
    private documentSource = "assets/image/icons/documentation.png";
    private dashSource = "assets/image/icons/dashboard_hover.png";
    private microSource = "assets/image/icons/microservices.png";
    private appSource = "assets/image/icons/apps.png";
    private monitorSource = "assets/image/icons/monitoring.png";
    private revenueSource = "assets/image/icons/revenue.png";
    private edgeSource = "assets/image/icons/edge.png";
    private cloudletSource = "assets/image/icons/cloudlet.png";
    public checkBoxValueOperator: boolean[] = [false];
    // 	private allOnboardedEdge: EdgePresent[];
    private userList: SignUp[];
    public edgePresentFlag = true;
    public operatorCheck: boolean = true;
    private telcoSource = "assets/image/icons/telco.png";
    private vmiSource = "assets/image/icons/vmi.png";
    public loading: boolean = false;
    public operatorsToDisplay = [];
    public mobileAppsToDisplay = [];
    public msToDisplay = [];
    public opsDisplayed: number = 0;
    public appsDisplayed: number = 0;
    public msDisplayed: number = 0;
    public showMore: boolean;
    public showLess: boolean;
    public showMoreMS: boolean;
    public showLessMS: boolean;
    public showMoreApp: boolean;
    public showLessApp: boolean;
    public oldPass: string;
    public newPass: string;
    public retypePass: string;
    public changeSubmit: boolean = false;
    public switchFlag: boolean = false;
    @Input() public counterValue = 0;
    @Output() public counterChange = new EventEmitter();

    constructor( private configuration: Configuration,
        private globalservice: GlobalServiceService,
        private route: Router,
        private mobileAppService: MobileAppService,
        private monitoringComponent: MonitoringComponent,
        private microServiceService: MicroServiceService,
        private edgeListService: NewCoDashboardService,
        private mainPageService: MainPageService ) {

        this.userName = globalservice.userName;
        if ( this.globalservice.role.length == 1 ) {
            if ( this.globalservice.role[0] == "MicroServiceDeveloper" ) {
                this.microServiceDeveloper = true;
                this.selectedRole = "MicroServiceDeveloper";
                this.globalservice.selectedRole = "MicroServiceDeveloper";
                this.roles.push( "MicroServiceDeveloper" );
                this.rolesToDisplay.push( "MS Developer" );
                this.globalservice.manage = false;
            }
            else if ( this.globalservice.role[0] == "MobileAppsDeveloper" ) {
                this.mobileAppDeveloper = true;
                this.selectedRole = "MobileAppsDeveloper";
                this.globalservice.selectedRole = "MobileAppsDeveloper";
                this.roles.push( "MobileAppsDeveloper" );
                this.rolesToDisplay.push( "App Developer" );
                this.globalservice.manage = false;
            }

            else if ( this.globalservice.role[0] == "NewCoDeveloper" ) {
                this.selectedRole = "NewCoDeveloper";
                this.newcoDeveloper = true;
                this.globalservice.selectedRole = "NewCoDeveloper";
                this.roles.push( "NewCoDeveloper" );
                this.rolesToDisplay.push( "Paas Admin" );
                this.globalservice.manage = true;
            }
            else if ( this.globalservice.role[0] == "TelcoDeveloper" ) {
                this.selectedRole = "TelcoDeveloper";
                this.telcoDeveloper = true;
                this.globalservice.selectedRole = "TelcoDeveloper";
                this.roles.push( "TelcoDeveloper" );
                this.rolesToDisplay.push( "Telco Operator" );
                this.globalservice.manage = false;
            }

        }
        else if ( this.globalservice.role.length == 2 ) {
            if ( this.globalservice.role[0] == "MobileAppsDeveloper" ||
                this.globalservice.role[0] == "MicroServiceDeveloper" ) {
                this.mobileAppDeveloper = true;
                this.selectedRole = "MobileAppsDeveloper";
                this.globalservice.selectedRole = "MobileAppsDeveloper";
                this.rolesToDisplay.push( "App Developer" );
                for ( let i = 0; i < this.globalservice.role.length; i++ ) {
                    this.roles.push( this.globalservice.role[i] );
                    if ( this.globalservice.role[i] == "MobileAppsDeveloper" )
                        continue;
                    else if ( this.globalservice.role[i] == "MicroServiceDeveloper" )
                        this.rolesToDisplay.push( "MS Developer" );
                }
            }
        }
    }

    public ngOnInit() {
        console.log( "in ng on init main" );
        this.globalservice.inDashboard = true;
        if ( this.roles.length == 1 ) {
            if ( this.roles[0] == "MicroServiceDeveloper" ) {
                this.flagMicro = true;
                this.globalservice.selectedRole = "MicroServiceDeveloper";
                this.selectedRole = "MicroServiceDeveloper";
            }
            else if ( this.roles[0] == "MobileAppsDeveloper" ) {
                this.flagMobile = true;
                this.globalservice.selectedRole = "MobileAppsDeveloper";
                this.selectedRole = "MobileAppsDeveloper";
            }
            else if ( this.roles[0] == "NewCoDeveloper" ) {
                this.getInitialDataForOperator();
                this.operatorCheck = true;
                //  this.flagCloud = true;
                this.globalservice.selectedRole = "NewCoDeveloper";
                this.selectedRole = "NewCoDeveloper";
                // this.getInitialDataForOperator();
                // this.operatorCheck= true;
            }
            else if ( this.roles[0] == "TelcoDeveloper" ) {
                this.flagCloud = true;
                this.globalservice.selectedRole = "TelcoDeveloper";
                this.selectedRole = "TelcoDeveloper";
            }
        }
        else if ( this.roles.length == 2 ) {
            this.flagMobile = true;
            this.globalservice.selectedRole = "MobileAppsDeveloper";
            this.selectedRole = "MobileAppsDeveloper";
        }

    }

    public pageRedirect() {
        this.highlightedDiv = 1;
        this.dashMouseEnter();
        this.microMouseOut();
        this.revenueMouseOut();
        this.monitorMouseOut();
        this.vmiMouseOut();
        this.appMouseOut();
        this.monitoring = false;

        if ( this.selectedRole == "MobileAppsDeveloper" ) {
            this.selectedRole = "MicroServiceDeveloper";
            this.globalservice.selectedRole = "MicroServiceDeveloper";
            this.microServiceDeveloper = true;
            this.mobileAppDeveloper = false;
            this.flagMobile = false;
            this.flagMicro = false;
            this.route.navigate( ["/dash"], { skipLocationChange: true } );
        }
        else if ( this.selectedRole == "MicroServiceDeveloper" ) {
            this.selectedRole = "MobileAppsDeveloper";
            this.globalservice.selectedRole = "MobileAppsDeveloper";
            this.microServiceDeveloper = false;
            this.mobileAppDeveloper = true;
            this.flagMicro = false;
            this.flagMobile = false;
            this.route.navigate( ["/dashMobile"], { skipLocationChange: true } );
        }
    }

    public logout() {
        this.loading = true;
        //this.microServiceDeveloper = false;
        //this.mobileAppDeveloper = false;
        //this.telcoDeveloper = false;
        //this.newcoDeveloper = false;
        //this.flagMicro = false;
        //this.flagMobile = false;
        //this.globalservice=new GlobalServiceService();
        //this.counterValue = 0;
        //this.counterChange.emit({
        //value: this.counterValue,
        //});
        this.mainPageService.logout().subscribe(
            ( data ) => {
                console.log( "Response = " + data );
                window.location.reload( false );
            },
            ( error ) => {
                if ( error.json().message == null || error.json().message == undefined ||
                    error.json().message == "" ) {
                    this.errorMessage = "Logout failed";
                }
                else {
                    this.errorMessage = error.json().message;
                }
                window.location.reload( false );
            } );

        //this.route.navigate(["/login"], { skipLocationChange: true });
        //window.location.assign(this.globalservice.baseURL);
    }

    public hideDash( route: string ) {
        this.globalservice.inDashboard = false;
        if ( this.flagMicro == true ) {
            this.flagMicro = false;
        }
        if ( this.flagMobile == true ) {
            this.flagMobile = false;
        }
        if ( this.flagCloud == true ) {
            this.flagCloud = false;
        }
        //this.globalservice.allMyApps = "allApps";
        this.monitoring = false;
        this.operatorCheck = false;
        this.counter_Load++;
        if ( route != "null" ) {
            this.globalservice.route = route;
            this.route.navigate( ["/routeReports"], { skipLocationChange: true } );
        }

    }

    public profile() {
        this.highlightedDiv = 0;
        this.hideDash( 'null' );
        this.dashMouseOut();
        this.microMouseOut();
        this.revenueMouseOut();
        this.monitorMouseOut();
        this.edgeMouseOut();
        this.cloudletMouseOut();
        this.telcoMouseOut();
        this.appMouseOut();
        this.feedbackMouseOut();
        this.documentMouseOut();
        this.route.navigate( ["/profile"], { skipLocationChange: true } );
    }

    public feedback() {
        this.globalservice.feedbackSubmitted = false;
        this.highlightedDiv = 0;
        //this.hideDash();
        this.dashMouseOut();
        this.microMouseOut();
        this.revenueMouseOut();
        this.monitorMouseOut();
        this.edgeMouseOut();
        this.cloudletMouseOut();
        this.telcoMouseOut();
        this.appMouseOut();
        this.feedbackMouseOut();
        this.documentMouseOut();

        this.feedbackFile = "";
        this.feedbackText = "";
        this.invalidFeedback = false
        this.feedbackSubmitted = false;
        this.globalservice.submitFeedback = true;
        this.globalservice.validation = false;
        this.globalservice.reload = true;
    }

    public submitFeedback() {
        this.feedbackSubmitted = true;
    }

    public redirectToMonitor() {
        this.globalservice.inDashboard = false;
        if ( this.flagMicro == true )
            this.flagMicro = false;
        if ( this.flagMobile == true )
            this.flagMobile = false;
        if ( this.globalservice.selectedRole == "MobileAppsDeveloper" ) {
            this.globalservice.allMyApps = "allApps";
        } else
            this.globalservice.allMyServices = "allServices";
        this.globalservice.appNames = [];
        this.globalservice.msNames = [];
        this.globalservice.timePeriod = "Last 30 Days";
        this.checkBoxValue = [false];
        this.counterForName = 1;
        this.checks = [
            { name: "Last Hour", isPrepared: false },
            { name: "Last 24 Hours", isPrepared: false },
            { name: "Last 7 Days", isPrepared: false },
            { name: "Last 30 Days", isPrepared: true },
        ];
        this.checkboxName = "Last 30 Days";
        this.count = 0;
        this.getInitialData();

    }

    public updateNumPreparedSpells( checked: check ) {
        if ( checked.name == "Last Hour" ) {
            this.checks[1].isPrepared = false;
            this.checks[2].isPrepared = false;
            this.checks[3].isPrepared = false;
            if ( checked.isPrepared ) {
                checked.isPrepared = false;
            } else {
                this.checkboxName = checked.name;
                this.globalservice.timePeriod = checked.name;
                this.globalservice.recordForMonitoring = false;
                if ( this.globalservice.selectedRole == "MobileAppsDeveloper" ) {
                    if ( this.globalservice.appNames.length > 0 ) {
                        this.route.navigate( ["/routeReports"], { skipLocationChange: true } );
                        setTimeout(() => this.route.navigate( ["/monitoring"], { skipLocationChange: true } ) );
                    }
                }
                if ( this.globalservice.selectedRole == "MicroServiceDeveloper" ) {
                    if ( this.globalservice.msNames.length > 0 ) {
                        this.route.navigate( ["/routeReports"], { skipLocationChange: true } );
                        setTimeout(() => this.route.navigate( ["/monitoring"], { skipLocationChange: true } ) );
                    }
                }
            }
        }
        if ( checked.name == "Last 24 Hours" ) {
            this.checks[0].isPrepared = false;
            this.checks[2].isPrepared = false;
            this.checks[3].isPrepared = false;
            if ( checked.isPrepared ) {
                checked.isPrepared = false;
            } else {
                this.checkboxName = checked.name;
                this.globalservice.timePeriod = checked.name;
                this.globalservice.recordForMonitoring = false;
                if ( this.globalservice.selectedRole == "MobileAppsDeveloper" ) {
                    if ( this.globalservice.appNames.length > 0 ) {
                        this.route.navigate( ["/routeReports"], { skipLocationChange: true } );
                        setTimeout(() => this.route.navigate( ["/monitoring"], { skipLocationChange: true } ) );
                    }
                }
                if ( this.globalservice.selectedRole == "MicroServiceDeveloper" ) {
                    if ( this.globalservice.msNames.length > 0 ) {
                        this.route.navigate( ["/routeReports"], { skipLocationChange: true } );
                        setTimeout(() => this.route.navigate( ["/monitoring"], { skipLocationChange: true } ) );
                    }
                }
            }
        }

        if ( checked.name == "Last 7 Days" ) {
            this.checks[0].isPrepared = false;
            this.checks[1].isPrepared = false;
            this.checks[3].isPrepared = false;
            if ( checked.isPrepared ) {
                checked.isPrepared = false;
            } else {
                this.checkboxName = checked.name;
                this.globalservice.timePeriod = checked.name;
                this.globalservice.recordForMonitoring = false;
                if ( this.globalservice.selectedRole == "MobileAppsDeveloper" ) {
                    if ( this.globalservice.appNames.length > 0 ) {
                        this.route.navigate( ["/routeReports"], { skipLocationChange: true } );
                        setTimeout(() => this.route.navigate( ["/monitoring"], { skipLocationChange: true } ) );
                    }
                }
                if ( this.globalservice.selectedRole == "MicroServiceDeveloper" ) {
                    if ( this.globalservice.msNames.length > 0 ) {
                        this.route.navigate( ["/routeReports"], { skipLocationChange: true } );
                        setTimeout(() => this.route.navigate( ["/monitoring"], { skipLocationChange: true } ) );
                    }
                }
            }
        }
        if ( checked.name == "Last 30 Days" ) {
            this.checks[0].isPrepared = false;
            this.checks[1].isPrepared = false;
            this.checks[2].isPrepared = false;
            if ( checked.isPrepared ) {
                checked.isPrepared = false;
            } else {
                this.checkboxName = checked.name;
                this.globalservice.timePeriod = checked.name;
                this.globalservice.recordForMonitoring = false;
                if ( this.globalservice.selectedRole == "MobileAppsDeveloper" ) {
                    if ( this.globalservice.appNames.length > 0 ) {
                        this.route.navigate( ["/routeReports"], { skipLocationChange: true } );
                        setTimeout(() => this.route.navigate( ["/monitoring"], { skipLocationChange: true } ) );
                    }
                }
                if ( this.globalservice.selectedRole == "MicroServiceDeveloper" ) {
                    if ( this.globalservice.msNames.length > 0 ) {
                        this.route.navigate( ["/routeReports"], { skipLocationChange: true } );
                        setTimeout(() => this.route.navigate( ["/monitoring"], { skipLocationChange: true } ) );
                    }
                }
            }
        }


        // if (checked.isPrepared) {
        //     this.checkboxName = "empty";
        //     checked.isPrepared = false;
        //     //  this.route.navigate(["/routeReports"]);
        //     //   setTimeout(()=>this.route.navigate(["/monitoring"]));
        //
        // }
        // else {
        //     checked.isPrepared = true;
        //     this.checkboxName = checked.name;
        //     this.globalservice.timePeriod = checked.name;
        //     this.globalservice.recordForMonitoring = false;
        //     this.route.navigate(["/routeReports"]);
        //     setTimeout(() => this.route.navigate(["/monitoring"]));
        //     //  this.monitoringComponent.fetchGraphData();
        // }
    }

    // updateNumPreparedSpells(checked: check) {
    //     if (checked.isPrepared) {
    //         this.checkboxName = "empty";
    //         checked.isPrepared = false;
    //         //  this.route.navigate(["/routeReports"]);
    //         //   setTimeout(()=>this.route.navigate(["/monitoring"]));
    //
    //     }
    //     else {
    //         checked.isPrepared = true;
    //         this.checkboxName = checked.name;
    //         this.globalservice.timePeriod = checked.name;
    //         this.globalservice.recordForMonitoring = false;
    //         this.route.navigate(["/routeReports"]);
    //         setTimeout(() => this.route.navigate(["/monitoring"]));
    //         //  this.monitoringComponent.fetchGraphData();
    //     }
    // }

    public onClick( check: boolean, num: number ) {
        if ( check ) {
            this.checkBoxValue[num] = false;
            this.counterForName--;
            this.globalservice.appNames.splice( this.globalservice.appNames.
                indexOf( this.mobileAppMetadata[num].applicationName ), 1 );
            if ( this.globalservice.appNames.length > 0 ) {
                // this.route.navigate(["/monitoring"],true);
                this.globalservice.recordForMonitoring = false;
                this.globalservice.monitoringFailApp = false;
                this.route.navigate( ["/routeReports"], { skipLocationChange: true } );
                setTimeout(() => this.route.navigate( ["/monitoring"], { skipLocationChange: true } ) );
                //  this.monitoringComponent.fetchGraphData();
            }
            else {
                this.globalservice.monitoringFailApp = true;
                this.route.navigate( ["/routeReports"], { skipLocationChange: true } );
                setTimeout(() => this.route.navigate( ["/monitoring"], { skipLocationChange: true } ) );
            }
        } else {
            this.globalservice.monitoringFailApp = false;
            this.checkBoxValue[num] = true;
            this.counterForName++;
            this.update( num );

        }

    }

    public update( num: number ) {
        if ( this.count < 3 ) {
            this.globalservice.appNames = null;
            this.globalservice.appNames = [];
            this.count = 0;
            for ( let i = 0; i < this.checkBoxValue.length; i++ ) {
                if ( this.checkBoxValue[i] ) {
                    this.globalservice.appNames[this.count] = this.mobileAppMetadata[i].applicationName;
                    this.count = this.count + 1;
                }
            }
        }

        if ( this.count >= 3 ) {
            this.count = 0;

        }
        this.globalservice.recordForMonitoring = false;
        this.route.navigate( ["/routeReports"], { skipLocationChange: true } );
        setTimeout(() => this.route.navigate( ["/monitoring"], { skipLocationChange: true } ) );
        // this.monitoringComponent.fetchGraphData();
    }

    public onClickMS( check: boolean, num: number ) {
        console.log( "in onclickms" );
        console.log( "check=" + check );
        if ( check ) {
            console.log( "in if check" );
            this.checkBoxValue[num] = false;
            this.counterForName--;
            this.globalservice.msNames.splice( this.globalservice.msNames.
                indexOf( this.microServiceMetadata[num].microServiceName ), 1 );
            if ( this.globalservice.msNames.length > 0 ) {
                console.log( "msnames is > 0" )
                // this.route.navigate(["/monitoring"],true);
                this.globalservice.monitoringFailMS = false;
                this.globalservice.recordForMonitoring = false;
                this.route.navigate( ["/routeReports"], { skipLocationChange: true } );
                setTimeout(() => this.route.navigate( ["/monitoring"], { skipLocationChange: true } ) );
                //  this.monitoringComponent.fetchGraphData();
            }
            else {
                console.log( "ms names < 0 " );
                this.globalservice.monitoringFailMS = true;
                this.route.navigate( ["/routeReports"], { skipLocationChange: true } );
                setTimeout(() => this.route.navigate( ["/monitoring"], { skipLocationChange: true } ) );
            }
        } else {
            console.log( "check is false" );
            this.globalservice.monitoringFailMS = false;
            this.checkBoxValue[num] = true;
            this.counterForName++;
            this.updateMS( num );

        }

    }

    public updateMS( num: number ) {
        if ( this.count < 3 ) {
            this.globalservice.msNames = null;
            this.globalservice.msNames = [];
            this.count = 0;
            for ( let i = 0; i < this.checkBoxValue.length; i++ ) {
                if ( this.checkBoxValue[i] ) {
                    this.globalservice.msNames[this.count] = this.microServiceMetadata[i].microServiceName;
                    this.count = this.count + 1;
                }
            }
        }

        if ( this.count >= 3 ) {
            this.count = 0;

        }
        this.globalservice.recordForMonitoring = false;
        this.route.navigate( ["/routeReports"], { skipLocationChange: true } );
        setTimeout(() => this.route.navigate( ["/monitoring"], { skipLocationChange: true } ) );
        // this.monitoringComponent.fetchGraphData();
    }



    public getInitialData() {
        if ( this.globalservice.selectedRole == "MobileAppsDeveloper" ) {
            this.mainPageService.getAllMobileApps().subscribe(
                ( data ) => {
                    this.mobileAppMetadata = <MobileAppMetadata[]>data;
                    this.checkBoxValue[0] = true;
                    this.globalservice.appNames[0] = this.mobileAppMetadata[0].applicationName;
                    this.globalservice.monitoringFailApp = false;
                    this.mobileAppsToDisplay = [];
                    if ( this.mobileAppMetadata.length > 10 ) {
                        for ( let i = 0; i < 10; i++ ) {
                            this.mobileAppsToDisplay.push( this.mobileAppMetadata[i] );
                        }
                        this.showMoreApp = true;
                    }
                    else {
                        for ( let i = 0; i < this.mobileAppMetadata.length; i++ ) {
                            this.mobileAppsToDisplay.push( this.mobileAppMetadata[i] );
                        }
                        this.showMoreApp = false;
                    }
                    this.appsDisplayed = this.mobileAppsToDisplay.length;
                    this.showLessApp = false;

                    this.route.navigate( ["/monitoring"], { skipLocationChange: true } );

                },
                ( error ) => {
                    this.globalservice.monitoringFailApp = true;
                    if ( error.json().message == null || error.json().message == undefined ||
                        error.json().message == "" ) {
                        this.errorMessage = "Mobile app data could not be fetched";
                    }
                    else {
                        this.errorMessage = error.json().message;
                    }
                    this.route.navigate( ["/monitoring"], { skipLocationChange: true } );
                } );

            this.monitoring = true;
        }
        if ( this.globalservice.selectedRole == "MicroServiceDeveloper" ) {
            this.mainPageService.getAllMicroServices().subscribe(
                ( data ) => {
                    this.microServiceMetadata = <MicroServiceMetadata[]>data;
                    this.checkBoxValue[0] = true;
                    this.globalservice.msNames[0] = this.microServiceMetadata[0].microServiceName;
                    this.globalservice.monitoringFailMS = false;
                    this.msToDisplay = [];
                    if ( this.microServiceMetadata.length > 10 ) {
                        for ( let i = 0; i < 10; i++ ) {
                            this.msToDisplay.push( this.microServiceMetadata[i] );
                        }
                        this.showMoreMS = true;
                    }
                    else {
                        for ( let i = 0; i < this.microServiceMetadata.length; i++ ) {
                            this.msToDisplay.push( this.microServiceMetadata[i] );
                        }
                        this.showMoreMS = false;
                    }
                    this.msDisplayed = this.msToDisplay.length;
                    this.showLessMS = false;

                    this.route.navigate( ["/monitoring"], { skipLocationChange: true } );

                },
                ( error ) => {
                    this.globalservice.monitoringFailMS = true;
                    if ( error.json().message == null || error.json().message == undefined ||
                        error.json().message == "" ) {
                        this.errorMessage = "Microservice data could not be fetched";
                    }
                    else {
                        this.errorMessage = error.json().message;
                    }
                    this.route.navigate( ["/monitoring"], { skipLocationChange: true } );
                } );

            this.monitoring = true;
        }

    }


    public getInitialDataForOperator() {
        this.loading = true;
        this.edgeListService.getEdgeList().subscribe(
            ( data ) => {

                this.userList = <SignUp[]>data;
                //   this.allOnboardedEdge = <EdgePresent[]>data;
                this.newcoDeveloper = true;

                this.edgePresentFlag = true;
                if ( this.userList.length != 0 ) {
                    for ( let i = 0; i < this.userList.length; i++ ) {
                        if ( this.checkUniqueOperator( this.userList[i].companyName ) && ( this.userList[i].companyName != null && this.userList[i].companyName != undefined && this.userList[i].companyName != "" ) ) {
                            this.globalservice.operatorsList.push( this.userList[i].companyName );
                        }
                    }

                    this.operatorsToDisplay = [];
                    if ( this.globalservice.operatorsList.length > 10 ) {
                        for ( let i = 0; i < 10; i++ ) {
                            this.operatorsToDisplay.push( this.globalservice.operatorsList[i] );
                        }
                        this.opsDisplayed = 10;
                        this.showMore = true;
                    }
                    else {
                        for ( let i = 0; i < this.globalservice.operatorsList.length; i++ ) {
                            this.operatorsToDisplay.push( this.globalservice.operatorsList[i] );
                        }
                        this.opsDisplayed = this.globalservice.operatorsList.length;
                        this.showMore = false;
                    }
                    this.showLess = false;

                    console.log( "operator list = " + JSON.stringify( this.operatorsToDisplay ) );
                    this.globalservice.operator = this.globalservice.operatorsList[0];
                    this.checkBoxValueOperator[0] = true;
                    this.flagCloud = false;
                    this.loading = false;
                    this.route.navigate( ["/newcodash"], { skipLocationChange: true } );
                }

                else {
                    this.loading = false;
                }

            },
            error => {
                //  this.edgePresentFlag=false;
                if ( error.json().message == null || error.json().message == undefined ||
                    error.json().message == "" ) {
                    this.errorMessage = "Edge data could not be fetched";
                }
                else {
                    this.errorMessage = error.json().message;
                }
                this.loading = false;
                this.route.navigate( ["/newcodash"], { skipLocationChange: true } );
            }
        );


    }

    public showOperator() {
        this.operatorCheck = true;
        this.checkBoxValueOperator = [];
        this.userList = [];
        this.globalservice.operatorsList = [];
        this.getInitialDataForOperator();
    }

    public checkUniqueOperator( operator: string ) {
        let flag = true;
        for ( let i = 0; i < this.globalservice.operatorsList.length; i++ ) {
            if ( this.globalservice.operatorsList[i] == operator )
                flag = false;
        }
        return flag;
    }

    public onClickOperator( check: boolean, num: number ) {
        if ( !check ) {
            this.checkBoxValueOperator[num] = true;
            for ( var i = 0; i < this.checkBoxValueOperator.length; i++ ) {
                if ( i != num ) {
                    this.checkBoxValueOperator[i] = false;
                }
            }
            this.globalservice.operator = this.globalservice.operatorsList[num];
            this.route.navigate( ["/routeReports"], { skipLocationChange: true } );
            setTimeout(() => this.route.navigate( ["/newcodash"], { skipLocationChange: true } ) );
        } else {
            this.checkBoxValueOperator[num] = false;
        }

    }

    public feedbackMouseEnter() {
        this.feedbackSource = 'assets/image/icons/feedback_hover.png';
    }
    public feedbackMouseOut() {
        this.feedbackSource = 'assets/image/icons/feedback.png';
    }

    public documentMouseEnter() {
        this.documentSource = "assets/image/icons/documentation_hover.png";
    }
    public documentMouseOut() {
        this.documentSource = "assets/image/icons/documentation.png";
    }

    public dashMouseEnter() {
        this.dashSource = "assets/image/icons/dashboard_hover.png";
    }
    public dashMouseOut() {
        if ( this.highlightedDiv != 1 ) {
            this.dashSource = "assets/image/icons/dashboard.png";
        }
    }

    public microMouseEnter() {
        this.microSource = "assets/image/icons/microservices_hover.png";
    }
    public microMouseOut() {
        if ( this.highlightedDiv != 2 ) {
            this.microSource = "assets/image/icons/microservices.png";
        }
    }

    public appMouseEnter() {
        this.appSource = "assets/image/icons/apps_hover.png";
    }
    public appMouseOut() {
        if ( this.highlightedDiv != 5 ) {
            this.appSource = "assets/image/icons/apps.png";
        }
    }

    public monitorMouseEnter() {
        this.monitorSource = "assets/image/icons/monitoring_hover.png";
    }
    public monitorMouseOut() {
        if ( this.highlightedDiv != 4 ) {
            this.monitorSource = "assets/image/icons/monitoring.png";
        }
    }

    public revenueMouseEnter() {
        this.revenueSource = "assets/image/icons/revenue_hover.png";
    }
    public revenueMouseOut() {
        if ( this.highlightedDiv != 3 ) {
            this.revenueSource = "assets/image/icons/revenue.png";
        }
    }

    public edgeMouseEnter() {
        this.edgeSource = "assets/image/icons/edge_hover.png";
    }
    public edgeMouseOut() {
        if ( this.highlightedDiv != 6 ) {
            this.edgeSource = "assets/image/icons/edge.png";
        }
    }

    public cloudletMouseEnter() {
        this.cloudletSource = "assets/image/icons/cloudlet_hover.png";
    }
    public cloudletMouseOut() {
        if ( this.highlightedDiv != 7 ) {
            this.cloudletSource = "assets/image/icons/cloudlet.png";
        }
    }

    public telcoMouseEnter() {
        this.telcoSource = "assets/image/icons/telco_hover.png";
    }
    public telcoMouseOut() {
        if ( this.highlightedDiv != 8 ) {
            this.telcoSource = "assets/image/icons/telco.png";
        }
    }

    public vmiMouseEnter() {
        this.vmiSource = "assets/image/icons/vmi_hover.png";
    }
    public vmiMouseOut() {
        if ( this.highlightedDiv != 9 ) {
            this.vmiSource = "assets/image/icons/vmi.png";
        }
    }

    public hideMonitoring() {
        this.monitoring = false;
        this.globalservice.inDashboard = true;
    }

    public toggleHighlight( newValue: number ) {
        if ( this.highlightedDiv === newValue ) {
            this.highlightedDiv = newValue;
        }
        else {
            this.highlightedDiv = newValue;
            if ( this.highlightedDiv == 1 ) {
                this.dashSource = "assets/image/icons/dashboard_hover.png";
                this.appSource = "assets/image/icons/apps.png";
                this.microSource = "assets/image/icons/microservices.png";
                this.monitorSource = "assets/image/icons/monitoring.png";
                this.revenueSource = "assets/image/icons/revenue.png";
                this.edgeSource = "assets/image/icons/edge.png";
                this.telcoSource = "assets/image/icons/telco.png";
                this.cloudletSource = "assets/image/icons/cloudlet.png";
                this.vmiSource = "assets/image/icons/vmi.png";
            }
            if ( this.highlightedDiv == 2 ) {
                this.dashSource = "assets/image/icons/dashboard.png";
                this.appSource = "assets/image/icons/apps.png";
                this.microSource = "assets/image/icons/microservices_hover.png";
                this.monitorSource = "assets/image/icons/monitoring.png";
                this.revenueSource = "assets/image/icons/revenue.png";
                this.edgeSource = "assets/image/icons/edge.png";
                this.telcoSource = "assets/image/icons/telco.png";
                this.cloudletSource = "assets/image/icons/cloudlet.png";
                this.vmiSource = "assets/image/icons/vmi.png";
            }
            if ( this.highlightedDiv == 3 ) {
                this.dashSource = "assets/image/icons/dashboard.png";
                this.appSource = "assets/image/icons/apps.png";
                this.microSource = "assets/image/icons/microservices.png";
                this.monitorSource = "assets/image/icons/monitoring.png";
                this.revenueSource = "assets/image/icons/revenue_hover.png";
                this.edgeSource = "assets/image/icons/edge.png";
                this.telcoSource = "assets/image/icons/telco.png";
                this.cloudletSource = "assets/image/icons/cloudlet.png";
                this.vmiSource = "assets/image/icons/vmi.png";
            }
            if ( this.highlightedDiv == 4 ) {
                this.dashSource = "assets/image/icons/dashboard.png";
                this.appSource = "assets/image/icons/apps.png";
                this.microSource = "assets/image/icons/microservices.png";
                this.monitorSource = "assets/image/icons/monitoring_hover.png";
                this.revenueSource = "assets/image/icons/revenue.png";
                this.edgeSource = "assets/image/icons/edge.png";
                this.telcoSource = "assets/image/icons/telco.png";
                this.cloudletSource = "assets/image/icons/cloudlet.png";
                this.vmiSource = "assets/image/icons/vmi.png";
            }
            if ( this.highlightedDiv == 5 ) {
                this.dashSource = "assets/image/icons/dashboard.png";
                this.appSource = "assets/image/icons/apps_hover.png";
                this.microSource = "assets/image/icons/microservices.png";
                this.monitorSource = "assets/image/icons/monitoring.png";
                this.revenueSource = "assets/image/icons/revenue.png";
                this.edgeSource = "assets/image/icons/edge.png";
                this.telcoSource = "assets/image/icons/telco.png";
                this.cloudletSource = "assets/image/icons/cloudlet.png";
                this.vmiSource = "assets/image/icons/vmi.png";
            }
            if ( this.highlightedDiv == 6 ) {
                this.dashSource = "assets/image/icons/dashboard.png";
                this.appSource = "assets/image/icons/apps.png";
                this.microSource = "assets/image/icons/microservices.png";
                this.monitorSource = "assets/image/icons/monitoring.png";
                this.revenueSource = "assets/image/icons/revenue.png";
                this.edgeSource = "assets/image/icons/edge_hover.png";
                this.telcoSource = "assets/image/icons/telco.png";
                this.cloudletSource = "assets/image/icons/cloudlet.png";
                this.vmiSource = "assets/image/icons/vmi.png";

            }
            if ( this.highlightedDiv == 7 ) {
                this.dashSource = "assets/image/icons/dashboard.png";
                this.appSource = "assets/image/icons/apps.png";
                this.microSource = "assets/image/icons/microservices.png";
                this.monitorSource = "assets/image/icons/monitoring.png";
                this.revenueSource = "assets/image/icons/revenue.png";
                this.edgeSource = "assets/image/icons/edge.png";
                this.telcoSource = "assets/image/icons/telco.png";
                this.cloudletSource = "assets/image/icons/cloudlet_hover.png";
                this.vmiSource = "assets/image/icons/vmi.png";
            }
            if ( this.highlightedDiv == 8 ) {
                this.dashSource = "assets/image/icons/dashboard.png";
                this.appSource = "assets/image/icons/apps.png";
                this.microSource = "assets/image/icons/microservices.png";
                this.monitorSource = "assets/image/icons/monitoring.png";
                this.revenueSource = "assets/image/icons/revenue.png";
                this.edgeSource = "assets/image/icons/edge.png";
                this.telcoSource = "assets/image/icons/telco_hover.png";
                this.cloudletSource = "assets/image/icons/cloudlet.png";
                this.vmiSource = "assets/image/icons/vmi.png";
            }
            if ( this.highlightedDiv == 9 ) {
                this.dashSource = "assets/image/icons/dashboard.png";
                this.appSource = "assets/image/icons/apps.png";
                this.microSource = "assets/image/icons/microservices.png";
                this.monitorSource = "assets/image/icons/monitoring.png";
                this.revenueSource = "assets/image/icons/revenue.png";
                this.edgeSource = "assets/image/icons/edge.png";
                this.telcoSource = "assets/image/icons/telco.png";
                this.cloudletSource = "assets/image/icons/cloudlet.png";
                this.vmiSource = "assets/image/icons/vmi_hover.png";
            }
        }
    }

    public onChangeTemplate( event: EventTarget ) {
        let file: File;
        let eventObj: MSInputMethodContext = <MSInputMethodContext>event;
        let target: HTMLInputElement = <HTMLInputElement>eventObj.target;
        let files: FileList = target.files;
        file = files[0];
        let myReader: FileReader = new FileReader();

        myReader.onloadend = ( e ) => {
            this.feedbackFile = myReader.result;
        };
        myReader.readAsDataURL( file );
        myReader.onerror = function( error ) {
        };

        if ( this.feedbackFile == undefined || this.feedbackFile == null || this.feedbackFile == "" ) {
            this.invalidFeedback = true;
        }
        else {
            this.invalidFeedback = false;
        }
    }


    public seeMore() {
        console.log( "In see more" );
        console.log( "displayed=" + this.opsDisplayed );
        if ( this.globalservice.operatorsList.length > ( this.opsDisplayed + 10 ) ) {
            for ( let i = this.opsDisplayed; i <= ( this.opsDisplayed + 10 - 1 ); i++ ) {
                this.operatorsToDisplay.push( this.globalservice.operatorsList[i] );
            }
            this.opsDisplayed = this.operatorsToDisplay.length;
            this.showMore = true;
        }
        else {
            console.log( "in else" );
            for ( let i = this.opsDisplayed; i < this.globalservice.operatorsList.length; i++ ) {
                this.operatorsToDisplay.push( this.globalservice.operatorsList[i] );
            }
            this.opsDisplayed = this.operatorsToDisplay.length;
            this.showMore = false;
            console.log( "show more = " + this.showMore );
        }
        this.showLess = true;

        console.log( "length of operators=" + this.operatorsToDisplay.length );
        //console.log("operatorsToDisplay= " + JSON.stringify(this.operatorsToDisplay));
        console.log( "opsDisplayed=" + this.opsDisplayed );
        console.log( "show less = " + this.showLess );
    }

    public seeLess() {
        console.log( "In see less" );
        if ( ( this.opsDisplayed - 10 ) >= 10 ) {
            for ( let i = ( this.operatorsToDisplay.length - 1 ); i >= ( this.opsDisplayed - 10 ); i-- ) {
                this.operatorsToDisplay.splice( i, 1 );
            }
            this.opsDisplayed = this.operatorsToDisplay.length;
        }
        else {
            for ( let i = ( this.opsDisplayed - 1 ); i >= 10; i-- ) {
                this.operatorsToDisplay.splice( i, 1 );
            }
            this.opsDisplayed = 10;
        }
        console.log( "opsdisplayed=" + this.opsDisplayed );
        if ( this.opsDisplayed > 10 ) {
            this.showLess = true;
        }
        else {
            this.showLess = false;
        }
        if ( this.globalservice.operatorsList.length >= this.opsDisplayed ) {
            this.showMore = true;
        }
        else {
            this.showMore = false;
        }
        console.log( "operators to display length=" + this.operatorsToDisplay.length );
        console.log( "operators to display=" + JSON.stringify( this.operatorsToDisplay ) );
        console.log( "opsDisplayed=" + this.opsDisplayed );

    }

    public seeMoreMS() {
        console.log( "In see more ms" );
        console.log( "displayed=" + this.msDisplayed );
        if ( this.microServiceMetadata.length > ( this.msToDisplay.length + 10 ) ) {
            console.log( "in if" );
            for ( let i = this.msDisplayed; i <= ( this.msDisplayed + 10 - 1 ); i++ ) {
                this.msToDisplay.push( this.microServiceMetadata[i] );
            }
            this.showMoreMS = true;
        }
        else {
            console.log( "in else" );
            for ( let i = this.msDisplayed; i < this.microServiceMetadata.length; i++ ) {
                this.msToDisplay.push( this.microServiceMetadata[i] );
            }
            this.showMoreMS = false;
        }
        this.msDisplayed = this.msToDisplay.length;
        this.showLessMS = true;

        console.log( "length of ms=" + this.msToDisplay.length );
        console.log( "msToDisplay= " + JSON.stringify( this.msToDisplay ) );
    }

    public seeLessMS() {
        console.log( "In see less ms" );
        if ( ( this.msDisplayed - 10 ) >= 10 ) {
            for ( let i = ( this.msDisplayed - 1 ); i >= ( this.msDisplayed - 10 ); i-- ) {
                this.msToDisplay.splice( i, 1 );
            }
            this.msDisplayed = this.msToDisplay.length;
        }
        else {
            for ( let i = ( this.msDisplayed - 1 ); i >= 10; i-- ) {
                this.msToDisplay.splice( i, 1 );
            }
            this.msDisplayed = 10;
        }
        if ( this.msDisplayed > 10 ) {
            this.showLessMS = true;
        }
        else {
            this.showLessMS = false;
        }
        if ( this.microServiceMetadata.length >= this.msDisplayed ) {
            this.showMoreMS = true;
        }
        else {
            this.showMoreMS = false;
        }
        console.log( "ms to display length=" + this.msToDisplay.length );
        console.log( "ms to display=" + JSON.stringify( this.msToDisplay ) );
    }

    public seeMoreApp() {
        console.log( "In see more app" );
        console.log( "displayed=" + this.appsDisplayed );
        if ( this.mobileAppMetadata.length > ( this.mobileAppsToDisplay.length + 10 ) ) {
            console.log( "in if" );
            for ( let i = this.appsDisplayed; i <= ( this.appsDisplayed + 10 - 1 ); i++ ) {
                this.mobileAppsToDisplay.push( this.mobileAppMetadata[i] );
            }
            this.showMoreApp = true;
        }
        else {
            console.log( "in else" );
            for ( let i = this.appsDisplayed; i < this.mobileAppMetadata.length; i++ ) {
                this.mobileAppsToDisplay.push( this.mobileAppMetadata[i] );
            }
            this.showMoreApp = false;
        }
        this.appsDisplayed = this.mobileAppsToDisplay.length;
        this.showLessApp = true;

        console.log( "length of apps=" + this.mobileAppsToDisplay.length );
        console.log( "appsToDisplay= " + JSON.stringify( this.mobileAppsToDisplay ) );
    }

    public seeLessApp() {
        console.log( "In see less app" );
        if ( ( this.appsDisplayed - 10 ) >= 10 ) {
            for ( let i = ( this.appsDisplayed - 1 ); i >= ( this.appsDisplayed - 10 ); i-- ) {
                this.mobileAppsToDisplay.splice( i, 1 );
            }
            this.appsDisplayed = this.mobileAppsToDisplay.length;
        }
        else {
            for ( let i = ( this.appsDisplayed - 1 ); i >= 10; i-- ) {
                this.mobileAppsToDisplay.splice( i, 1 );
            }
            this.appsDisplayed = 10;
        }
        if ( this.appsDisplayed > 10 ) {
            this.showLessApp = true;
        }
        else {
            this.showLessApp = false;
        }
        if ( this.mobileAppMetadata.length >= this.appsDisplayed ) {
            this.showMoreApp = true;
        }
        else {
            this.showMoreApp = false;
        }
    }

    public sdk() {
        console.log( "in sdk" );
        if ( this.flagMicro == true ) {
            this.flagMicro = false;
        }
        if ( this.flagMobile == true ) {
            this.flagMobile = false;
        }
        if ( this.flagCloud == true ) {
            this.flagCloud = false;
        }
        this.globalservice.route = "sdkManage";
        this.route.navigate( ['routeReports'], { skipLocationChange: true } );
    }

    public changePassword() {
      this.changeSubmit=true;
    }

    public switchFlagFunc() {
      this.switchFlag = !this.switchFlag;
    }
}

export class check {
    public name: string;
    public isPrepared: boolean;
}
