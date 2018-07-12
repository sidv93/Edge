import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Configuration } from "../app.constants";
import { Country } from "../common-services/Country";
import {CountryState} from "../common-services/countrystatelist";
import {MicroServiceMetadata} from "../common-services/microServiceMetadata";
import {MobileAppError} from "../common-services/mobileAppError";
import {MobileAppMetadata} from "../common-services/mobileAppsMetadata";
import {GlobalServiceService} from "../global-service.service";
import {MicroServiceService} from "../micro-service/micro-service.service";
import {MobileAppDetailsService} from "./mobile-app-details.service";
import {ErrorMessage, SubscribedServices} from "./mobileAppDetails";
import {MobileAppService} from "../mobile-app/mobile-app.service";
import { SessionTimeout } from "../common-services/session-timeout";
import { Endpoints,Microservice,NetworkBinding,HttpGateway,EventGateway } from "../common-services/endpoints";
import { End } from "../common-services/endp";

@Component( {
    selector: "app-mobile-app-details",
    templateUrl: "./mobile-app-details.component.html",
    providers: [Configuration, MobileAppDetailsService, MicroServiceService,SessionTimeout,End],
})
export class MobileAppDetailsComponent implements OnInit {

    public appDetailed = new MobileAppMetadata();
    public appDetailedBkp = new MobileAppMetadata();
    public subscribedServices: MicroServiceMetadata[] = [];
    public editPutResults = new MobileAppMetadata();
    public deleteResult = new MobileAppMetadata();
    public mobileDetailScheduler = new MobileAppMetadata();
    public errorDetails = new MobileAppError();
    public initialItems: number;
    public ItemDifferenceDropdown: number;
    public MaxItemDropdown: number;
    public resultStatus: string;
    public deleteResultStatus: string;
    public errorMessage: string;
    public errorMessageDel: string;
    public showSuccessPopUp = false;
    public deletePopup = false;
    public deleteFailed = false;
    public applicationName: string;
    public categoryMApp: string;
    public userApp: boolean;
    public RegionEditFlag = false;
    public fromMarketPlace = false;
    public errorDetailPopup: boolean;
    public approveInput: string;
    public approveResult: string;
    public approveErrorPopup: boolean = false;
    public approveSuccess: boolean;
    public clearTimer;
    public detailsError = false;
    public viewErrorError = false;
    public selectedCountry: Country = new Country( 1, "Algeria","dz","213" );
    public countries: Country[];
    public test: boolean = false;
    public errorFlag: boolean = false;
    private usageGraphFlag: boolean = false;
    public subEmpty:boolean = false;
    private approve :string ="approve";
    public loading:boolean = false;
    public counter:number =1;
    public timerForLogout;
    public endpoints = new Endpoints();
    public sandboxError : boolean = false;

    constructor( private publicConfiguration: Configuration,
        private router: Router, private globalServiceObj: GlobalServiceService,
        private mobileAppService: MobileAppService,
        private mobileAppDetailsService: MobileAppDetailsService,
        private countrystate: CountryState, private microServiceService: MicroServiceService, private sessionTimeout : SessionTimeout,
        private end : End ) {
        this.applicationName = globalServiceObj.applicationName;
        this.categoryMApp = globalServiceObj.categoryMApp;
        this.countries = countrystate.getCountries();
        this.initialItems = publicConfiguration.MinItemFirstLoad;
        this.ItemDifferenceDropdown = publicConfiguration.ItemDifference;
        this.MaxItemDropdown = publicConfiguration.MaxItemsInDrop;
    }
    public abc() {
        this.globalServiceObj.editMobileApps = false;
    }

    public getUsage() {
        this.usageGraphFlag = true;
    }

    public getSubscribedServices() {
        let servicesSubscribed: string[] = [];
        let searchString = "";
        for ( let i = 0; i < this.appDetailed.metadata.appMetadata.microservices.length; i++ ) {
            if ( this.appDetailed.metadata.appMetadata.microservices[i].subscribed.toLowerCase() == "y" ) {
                servicesSubscribed.push( this.appDetailed.metadata.appMetadata.microservices[i].microServiceName );
            }
        }
        if ( servicesSubscribed.length > 0 ) {
            this.microServiceService.getMicroServicesScheduler( servicesSubscribed ).
			subscribe(( data ) =>  {
                this.subscribedServices = data;
                this.subEmpty = false;
            },
                ( error ) => {
                this.subEmpty = true;
                this.loading=true;
                this.detailsError=true;
                this.sessionTimeout.checkSession(error);
                if ( error.json().message == null || error.json().message == undefined ||
      error.json().message == "" ) {
                    this.errorMessage = "Subscribed services data could not be fetched";
                }
                else {
                    this.errorMessage = error.json().message;
                }

                }
            );
        }
        else {
        this.subEmpty = true;
        }

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
                this.router.navigate( ["/mobileOnBoard"], { skipLocationChange: true } );
            }
        },
            ( error ) => {
                this.errorFlag = true;
                this.loading=true;
                this.detailsError=true;
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

    public editMobileAppsFunc( name: string ) {
        this.globalServiceObj.editMobileApps = true;
        this.globalServiceObj.applicationName = name;
        // this.test = true;
        this.ngOnDestroy();
        this.router.navigate( ["/mobileOnBoard"], { skipLocationChange: true } );
    }

    public ngOnInit() {
        this.test = false;
        if ( this.globalServiceObj.allMyApps == "allApps" )
            this.userApp = false;
        else if ( this.globalServiceObj.allMyApps == "myApps" )
            this.userApp = true;

        if ( this.globalServiceObj.fromMarketPlace == true )
            this.fromMarketPlace = true;
        this.mobileAppDetailsService.getAppDetail( this.applicationName ).subscribe(
            ( data ) => {
                this.appDetailed = <MobileAppMetadata>data;
                this.appDetailedBkp = Object.assign( new MobileAppMetadata(), this.appDetailed );
            },

            ( error ) => {
                this.detailsError = true;
                this.loading=true;
                this.detailsError=true;
                this.sessionTimeout.checkSession(error);
                if ( error.json().message == null || error.json().message == undefined ||
				error.json().message == "" ) {
                    this.errorMessage = "Mobile app details could not be fetched";
                }
                else {
                    this.errorMessage = error.json().message;
                }
            }
        );
        this.clearTimer = setInterval(() => {
            if ( ( this.appDetailed.onBoardStatus == "sandboxed" || this.appDetailed.onBoardStatus == "pending" )
			&& this.userApp )
                this.callScheduler();
        }, 3000 );

    }

    public ngOnDestroy() {
        clearInterval( this.clearTimer );
        clearInterval( this.timerForLogout);
    }

    public editDetails() {
        ( <HTMLInputElement>document.getElementById( "Category" ) ).disabled = false;
        ( <HTMLInputElement>document.getElementById( "Category" ) ).style.border = "";
        ( <HTMLInputElement>document.getElementById( "Description" ) ).disabled = false;
        ( <HTMLInputElement>document.getElementById( "Description" ) ).style.border = "";
        ( <HTMLInputElement>document.getElementById( "ContextURL" ) ).disabled = false;
        ( <HTMLInputElement>document.getElementById( "ContextURL" ) ).style.border = "";
        ( <HTMLInputElement>document.getElementById( "DocumentURL" ) ).disabled = false;
        ( <HTMLInputElement>document.getElementById( "DocumentURL" ) ).style.border = "";
        document.getElementById( "submitBtn" ).style.display = "block";
        this.RegionEditFlag = true;
    }
    public editRevertDetails() {
        this.appDetailed = Object.assign( new MobileAppMetadata(), this.appDetailedBkp );
        document.getElementById( "submitBtn" ).style.display = "none";
        ( <HTMLInputElement>document.getElementById( "Category" ) ).disabled = true;
        ( <HTMLInputElement>document.getElementById( "Category" ) ).style.border = "0px";
        ( <HTMLInputElement>document.getElementById( "DocumentURL" ) ).disabled = true;
        ( <HTMLInputElement>document.getElementById( "DocumentURL" ) ).style.border = "0px";
        ( <HTMLInputElement>document.getElementById( "ContextURL" ) ).disabled = true;
        ( <HTMLInputElement>document.getElementById( "ContextURL" ) ).style.border = "0px";
        ( <HTMLInputElement>document.getElementById( "Description" ) ).disabled = true;
        ( <HTMLInputElement>document.getElementById( "Description" ) ).style.border = "0px";

        this.RegionEditFlag = false;

    }

    public editMSDataForm() {
        this.mobileAppDetailsService.submitEditData( this.appDetailed ).subscribe(( res ) => {
            this.editPutResults = res;
            // 	  this.showSuccessPopUp=true;
            this.resultStatus = res.status.toLocaleLowerCase();
            if ( this.resultStatus == "success" ) {
                this.errorMessage = undefined;
                this.showSuccessPopUp = true;
            }
        },
            ( error ) => {
            this.loading=true;
            this.detailsError=true;
            this.sessionTimeout.checkSession(error);
            if ( error.json().message == null || error.json().message == undefined ||
    error.json().message == "" ) {
                this.errorMessage = "Edit details could not be submitted";
            }
            else {
                this.errorMessage = error.json().message;
            }
            }
        );

    }

    public setAppsFlag( app: string ) {
        this.globalServiceObj.allMyApps = app;
    }

    public pageRedirect() {
        this.router.navigate( ["/mobileApp"] , { skipLocationChange: true });

    }

    public deleteDetails() {
        this.deletePopup = false;
        this.mobileAppDetailsService.submitDeleteData().subscribe(( res ) => {
            this.deleteResult = res;
            this.deleteResultStatus = res.status.toLocaleLowerCase();
            if ( this.deleteResultStatus == "success" ) {
                this.errorMessage = undefined;
                this.deletePopup = true;
                this.deleteFailed = false;
            }
        },
            ( error ) => {
                this.deletePopup = true;
                this.deleteFailed = true;
                //this.loading=false;
                //this.detailsError=true;
                this.sessionTimeout.checkSession(error);
                if ( error.json().message == null || error.json().message == undefined ||
				error.json().message == "" ) {
                    this.errorMessage = "Delete request could not be submitted";
                }
                else {
                    this.errorMessage = error.json().message;
                }
            }
        );
    }

    public viewError( selectedApp: string ) {
        this.mobileAppDetailsService.getErrorDetail( selectedApp ).subscribe(
            ( data ) => {
                this.errorMessage = undefined;
                this.errorDetails.applicationName = data.applicationName;
                this.errorDetails.metadata.microserviceMetadata = data.metadata.microserviceMetadata;
            },
            ( error ) => {
                this.viewErrorError = true;
                this.sessionTimeout.checkSession(error);
                if ( error.json().message == null || error.json().message == undefined ||
				error.json().message == "" ) {
                    this.errorMessage = "Error details could not be fetched";
                }
                else {
                    this.errorMessage = error.json().message;
                }
            }
        );
    }

    public approveFunc( developerResponse: string ) {

        this.approveInput = developerResponse;
        this.mobileAppDetailsService.approveApp( this.globalServiceObj.userId, developerResponse, this.globalServiceObj.applicationName ).subscribe(( res ) => {
            this.approveResult = res;
            this.errorMessage = undefined;
            this.approveResult = res.status.toLocaleLowerCase();
            if ( this.approveResult == "success" ) {
                this.approveSuccess = true;
            }
        },
            ( error ) => {
                this.approveErrorPopup = true;
                this.sessionTimeout.checkSession(error);
                if ( error.json().message == null || error.json().message == undefined ||
				error.json().message == "" ) {
                    this.errorMessage = "Approval details could not be submitted";
                }
                else {
                    this.errorMessage = error.json().message;
                }
            }
        );

    }


    public callScheduler() {

    if(this.counter == 1) {
    this.counter++;
    this.timerForLogout = setInterval(() => {
      this.loading=true;
      this.detailsError=true;
      alert(this.publicConfiguration.timeoutMsg);
      window.location.reload(false);
    }, this.globalServiceObj.sessionTimeout );
    }
        this.mobileAppDetailsService.getAppDetail( this.applicationName ).
		subscribe(( res: MobileAppMetadata ) => {
            this.mobileDetailScheduler = res;
            if ( this.appDetailed.applicationName == this.mobileDetailScheduler.applicationName ) {
                if ( this.appDetailed.onBoardStatus != this.mobileDetailScheduler.onBoardStatus ) {
                    this.appDetailed.onBoardStatus = this.mobileDetailScheduler.onBoardStatus;
                }
            }
        },
            ( error ) => {
              this.sessionTimeout.checkSession(error);
                if ( error.json().message == null || error.json().message == undefined ||
				error.json().message == "" ) {
                    this.errorMessage = "Mobile app details could not be fetched";
                }
                else {
                    this.errorMessage = error.json().message;
                }
            }
        );
    }

    public setModalFlags() {
        this.approveErrorPopup = false;
        this.approveSuccess = false;
    }

    public getEndpoints() {
      console.log("in get endpoints");
      this.mobileAppDetailsService.getEndpoints().subscribe(
        (data) => {
            console.log("in data =" + JSON.stringify(data));
            this.endpoints = data[0];
            console.log("endpoints=" + JSON.stringify(this.endpoints));
            this.sandboxError = false;
        },
        ( error ) => {
            console.log("in error="+ JSON.stringify(error));
            this.sandboxError = true;
            this.sessionTimeout.checkSession(error);
            if ( error.json().message == null || error.json().message == undefined ||
                error.json().message == "" ) {
                this.errorMessage = "Sandboxing endpoints could not be fetched";
            }
            else {
                this.errorMessage = error.json().message;
            }
        }
      )
    }
}
