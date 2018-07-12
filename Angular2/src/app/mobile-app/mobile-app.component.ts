import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Configuration } from "../app.constants";
import {MobileAppMetadata} from "../common-services/mobileAppsMetadata";
import {OnBoardStatus} from "../common-services/onBoardStatus";
import { GlobalServiceService } from "../global-service.service";
import {MobileAppService} from "./mobile-app.service";
import { SessionTimeout } from "../common-services/session-timeout";

@Component( {
    selector: "",
    templateUrl: "./mobile-app.component.html",
    providers: [Configuration, MobileAppService,SessionTimeout],
})

export class MobileAppComponent implements OnInit {

    public mobileP: MobileAppMetadata[] = [];
    public mobileScheduler: MobileAppMetadata[] = [];
    public onBoardStatus: OnBoardStatus[] = [];
    public sort = new OnBoardStatus( "rating", "none" );
    public initialItems: number;
    public ItemDifferenceDropdown: number;
    public MaxItemDropdown: number;
    public dropDownArray: number[] = [];
    public appsPresent = true;
    public credit: string;
    public errorMessage: string;
    public userId: string;
    public sortDropdown: string = "Most Popular";
    public role: boolean;
    public myAllApps: boolean;
    public clearTimer;
    public errorFlag: boolean = false;
    private tempValue: number = 0;
    private ModalFlag: boolean = false;
    public loading: boolean = false;
    public counter:number = 1;
    public timerForLogout;

    constructor( private publicConfiguration: Configuration,
	private router: Router, private globalServiceObj: GlobalServiceService,
	private mobileAppService: MobileAppService, private sessionTimeout : SessionTimeout ) {
        this.initialItems = publicConfiguration.MinItemFirstLoad;
        this.ItemDifferenceDropdown = publicConfiguration.ItemDifference;
        this.MaxItemDropdown = publicConfiguration.MaxItemsInDrop;
    }

    public ngOnInit() {
        this.userId = this.globalServiceObj.userName;
        this.sort.name = "applicationName";
        if ( this.globalServiceObj.selectedRole == "MicroServiceDeveloper" )
            this.role = false;
        else if ( this.globalServiceObj.selectedRole == "MobileAppsDeveloper" )
            this.role = true;
        this.getInitialData();
    }

    public ngOnDestroy() {
        clearInterval( this.clearTimer );
        clearInterval( this.timerForLogout);
    }

    public getInitialData() {
        this.loading = true;
        this.mobileAppService.getAllMobileApps().subscribe(
            ( data ) => {
                this.appsPresent = true;
                this.mobileP = <MobileAppMetadata[]>data;
                if ( this.mobileP.length == 0 ) {
                    this.appsPresent = false;
                    this.errorMessage = "No records found";
                }
                else
                    this.appsPresent = true;
                if ( this.globalServiceObj.allMyApps == "myApps" ) {
                    for ( let i = 0; i < this.mobileP.length; i++ ) {
                        if ( this.mobileP[i].onBoardStatus.toLocaleLowerCase() == "pending" || this.mobileP[i].onBoardStatus.toLocaleLowerCase() == "sandboxed" ) {
                            if ( this.checkUniqueness( this.mobileP[i].applicationName ) ) {
                                this.onBoardStatus.push( new OnBoardStatus( this.mobileP[i].applicationName, this.mobileP[i].onBoardStatus ) );
                            }
                        }
                    }
                }
                this.loading = false;
            },
            ( error ) => {
                this.appsPresent = false;
                this.sessionTimeout.checkSession(error);
                if ( error.json().message == null || error.json().message == undefined ||
				error.json().message == "" ) {
                    this.errorMessage = "Mobile app data could not be fetched";
                }
                else {
                    this.errorMessage = error.json().message;
                }
                this.loading = false;
            });
        if ( this.globalServiceObj.allMyApps == "allApps" ) {
            this.myAllApps = false;
            clearInterval( this.clearTimer );
        }
        else if ( this.globalServiceObj.allMyApps == "myApps" ) {
            this.myAllApps = true;

            this.clearTimer = setInterval(() => {
                if ( this.onBoardStatus.length > 0 )
                    this.callScheduler();
            }, 3000 );
        }

    }

    // to be changed to mobile app
    public search( term ) {
        this.loading = true;
        this.mobileAppService.search( term ).subscribe(( res: MobileAppMetadata[] ) => {
            this.mobileP = res;
            if ( this.mobileP.length == 0 ) {
                this.appsPresent = false;
                this.errorMessage = "No records found";
            }
            else {
                this.appsPresent = true;
            }
            this.loading = false;

        },
            ( error ) => {
                this.appsPresent = false;
                this.mobileP=[];
                this.sessionTimeout.checkSession(error);
                if ( error.json().message == null || error.json().message == undefined ||
				error.json().message == "" ) {
                    this.errorMessage = term + " could not be fetched";
                }
                else {
                    this.errorMessage = error.json().message;
                }
                this.loading = false;
            }
        );
    }

    // to be changed to mobile app
    public redirect() {
        this.ngOnDestroy();
        this.mobileAppService.validateCredits().subscribe(( res ) => {
            // if(res.status=="success")
            //     this.router.navigate(['/mobileOnBoard'], { skipLocationChange: true });
            {
                this.globalServiceObj.creditsAvailable = res.avialableCredits;
                this.globalServiceObj.onBoardCharges = res.onboardingCharge;
                // this.myAllApps=true;
                // this.ModalFlag = true;
                this.globalServiceObj.allMyApps = "myApps";
                this.router.navigate( ["/mobileOnBoard"] , { skipLocationChange: true });
            }
        },
            ( error ) => {
                this.errorFlag = true;
                this.sessionTimeout.checkSession(error);
                if ( error.json().message == null || error.json().message == undefined ||
				error.json().message == "" ) {
                    this.errorMessage = "Server error";
                }
                else {
                    this.errorMessage = error.json().message;
                }
            }
        );
    }

    public onChangeEvent() {
        this.loading = true;
        if ( this.sort.name == "rating" )
            this.sortDropdown = "Most Popular";
        else if ( this.sort.name == "applicationName" )
            this.sortDropdown = "Alphabetic";
        else if ( this.sort.name == "creditsPerAPICall" )
            this.sortDropdown = "Price";
        else if ( this.sort.name == "releaseDate" )
            this.sortDropdown = "Release Date";

        this.mobileAppService.getSortingDetail( this.sort.name ).subscribe(( res: MobileAppMetadata[] ) =>
        { this.mobileP = res;
          this.loading = false;
          },
            ( error ) => {
            this.sessionTimeout.checkSession(error);
            if ( error.json().message == null || error.json().message == undefined ||
    error.json().message == "" ) {
                this.errorMessage = "Sorted data could not be fetched";
            }
            else {
                this.errorMessage = error.json().message;
            }
            this.loading = false;
            }
        );
    }

    public appDetail( selectedApp: string, selectedAppCategory: string ) {
        this.globalServiceObj.applicationName = selectedApp;
        this.globalServiceObj.categoryMApp = selectedAppCategory;
        this.router.navigate( ["/mobileappdetails"] , { skipLocationChange: true });
    }

    public setAppsFlag( app: string ) {
        this.globalServiceObj.allMyApps = app;
        ( <HTMLInputElement>document.getElementById( "srchterm" ) ).value = "";
        this.getInitialData();
    }

    public callScheduler() {
        let searchApps: string[] = [];
        this.mobileScheduler = [];
        // this.onBoardStatus=[];

        if(this.counter == 1) {
        this.counter++;
        this.timerForLogout = setInterval(() => {
          this.mobileP=[];
          this.loading=true;
          alert(this.publicConfiguration.timeoutMsg);
          window.location.reload(false);
        }, this.globalServiceObj.sessionTimeout );
        }

        for ( let i = 0; i < this.onBoardStatus.length; i++ ) {
            searchApps.push( this.onBoardStatus[i].name );
        }

        if(this.mobileP.length > 0) {
        this.mobileAppService.getMobileAppsScheduler( searchApps ).subscribe(( res: MobileAppMetadata[] ) => {
            this.mobileScheduler = res;
            for ( let i = 0; i < this.mobileScheduler.length; i++ ) {
                for ( let j = 0; j < this.mobileP.length; j++ ) {
                    if ( this.mobileScheduler[i].applicationName == this.mobileP[j].applicationName ) {
                        if ( this.mobileScheduler[i].onBoardStatus != this.mobileP[j].onBoardStatus ) {
                            this.mobileP[j].onBoardStatus = this.mobileScheduler[i].onBoardStatus;
                        }
                    }
                }
            }
            this.onBoardStatus = [];
            for ( let i = 0; i < this.mobileP.length; i++ ) {
                if ( this.mobileP[i].onBoardStatus.toLocaleLowerCase() == "pending" || this.mobileP[i].onBoardStatus.toLocaleLowerCase() == "sandboxed" ) {
                    if ( this.checkUniqueness( this.mobileP[i].applicationName ) ) {
                        this.onBoardStatus.push( new OnBoardStatus( this.mobileP[i].applicationName,
            this.mobileP[i].onBoardStatus ) );
                    }
                }
            }
        },
            ( error ) => {
            this.onBoardStatus = [];
            this.sessionTimeout.checkSession(error);
                if ( error.json().message == null || error.json().message == undefined ||
        error.json().message == "" ) {
                    //this.errorMessage = "Mobile App data could not be fetched";
                    console.log("Mobile App data could not be fetched");
                }
                else {
                    //this.errorMessage = error.json().message;
                    console.log("Error from scheduler=" + error.json().message);
                }
            }
        );
        }
    }

    public checkUniqueness( appName: string ) {
        let flag = true;
        for ( let i = 0; i < this.onBoardStatus.length; i++ ) {
            if ( this.onBoardStatus[i].name == appName ) {
                flag = false;
            }
        }
        return flag;
    }

}
