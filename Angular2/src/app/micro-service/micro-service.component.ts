import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Configuration } from "../app.constants";
import {MicroServiceMetadata} from "../common-services/microServiceMetadata";
import {OnBoardStatus} from "../common-services/onBoardStatus";
import { GlobalServiceService } from "../global-service.service";
import {MicroServiceService} from "./micro-service.service";
import { SessionTimeout } from "../common-services/session-timeout";

@Component( {
    selector: "",
    templateUrl: "./micro-service.component.html",
    providers: [Configuration, MicroServiceService,SessionTimeout],
})

export class MicroServiceComponent implements OnInit {

    public microServices: MicroServiceMetadata[] = [];
    public microServiceScheduler: MicroServiceMetadata[] = [];
    public onBoardStatus: OnBoardStatus[] = [];
    public sort = new OnBoardStatus( "rating", "none" );
    public initialItems: number;
    public ItemDifferenceDropdown: number;
    public MaxItemDropdown: number;
    public dropDownArray: number[] = [];
    public servicePresent = true;
    public credit: string;
    public errorMessage: string;
    public userId: string;
    public sortDropdown: string = "Most Popular";
    public role: boolean;
    public myAllServices: boolean;
    public clearTimer;
    public errorFlag: boolean = false;
    private tempValue: number = 0;
    private ModalFlag: boolean = false;
    public loading : boolean = false;

    constructor( private publicConfiguration: Configuration, private router: Router,
	private globalServiceObj: GlobalServiceService, private microServiceService: MicroServiceService, private sessionTimeout : SessionTimeout ) {
        this.initialItems = publicConfiguration.MinItemFirstLoad;
        this.ItemDifferenceDropdown = publicConfiguration.ItemDifference;
        this.MaxItemDropdown = publicConfiguration.MaxItemsInDrop;
    }

    public ngOnInit() {
        this.userId = this.globalServiceObj.userName;
        this.sort.name = "microServiceName";
        this.servicePresent = true;
        if ( this.globalServiceObj.selectedRole == "MicroServiceDeveloper" )
            this.role = false;
        else if ( this.globalServiceObj.selectedRole == "MobileAppsDeveloper" )
            this.role = true;
        this.getInitialData();
    }

    public ngOnDestroy() {
        clearInterval( this.clearTimer );
        clearInterval(this.timerForLogout);
    }

    public getInitialData() {
        this.loading = true;
        this.microServiceService.getAllMicroServices().subscribe(
            ( data ) => {
                this.microServices = <MicroServiceMetadata[]>data;
                if ( this.microServices.length == 0 ) {
                    this.servicePresent = false;
                    this.errorMessage = "No records found";
                }
                else
                    this.servicePresent = true;
                if ( this.globalServiceObj.allMyServices == "myServices" ) {
                    for ( let i = 0; i < this.microServices.length; i++ ) {
                        if ( this.microServices[i].onBoardStatus.toLocaleLowerCase() == "pending" || this.microServices[i].onBoardStatus.toLocaleLowerCase() == "sandboxed" ) {
                            if ( this.checkUniqueness( this.microServices[i].microServiceName ) ) {
                                this.onBoardStatus.push( new OnBoardStatus( this.microServices[i].microServiceName, this.microServices[i].onBoardStatus ) );
                            }
                        }
                    }
                }
                this.loading = false;
            },
            ( error ) => {
                this.servicePresent = false;
                this.sessionTimeout.checkSession(error);
                if ( error.json().message == null || error.json().message == undefined ||
        error.json().message == "" ) {
                    this.errorMessage = "Microservice data could not be fetched";
                }
                else {
                    this.errorMessage = error.json().message;
                }
                this.loading = false;
            }
        );

        if ( this.globalServiceObj.allMyServices == "allServices" ) {
            this.myAllServices = false;
            clearInterval( this.clearTimer );
        }
        else if ( this.globalServiceObj.allMyServices == "myServices" ) {
            this.myAllServices = true;

            this.clearTimer = setInterval(() => {
                if ( this.onBoardStatus.length > 0 )
                    this.callScheduler();
            }, 3000 );
        }

    }

    public search( term ) {
        this.loading = true;
        this.microServiceService.search( term ).subscribe(( res: MicroServiceMetadata[] ) => {
            this.microServices = res;
            if ( this.microServices.length == 0 ) {
                this.servicePresent = false;
                this.errorMessage = "No records found";
            }
            else {
                this.servicePresent = true;
            }
            this.loading = false;
        },
            ( error ) => {
                this.servicePresent = false;
                this.microServices=[];
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

    public redirect() {
        this.ngOnDestroy();
        this.microServiceService.validateCredits().subscribe( res => {
            // if(res.status=="success")
            //    this.router.navigate(['/onboard'], { skipLocationChange: true });
            //	{
            this.ModalFlag = true;
            this.globalServiceObj.creditsAvailable = res.avialableCredits;
            this.globalServiceObj.onBoardCharges = res.onboardingCharge;
            this.myAllServices = true;
            this.globalServiceObj.allMyServices = "myServices";
            this.router.navigate( ['/onboard'], { skipLocationChange: true } );
            //}
        },
            ( error ) => {
                this.errorFlag = true;
                this.microServices=[];
                this.sessionTimeout.checkSession(error);
                if ( error.json().message == null || error.json().message == undefined ||
        error.json().message == "" ) {
                    this.errorMessage = "Credits could not be validated";
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
        else if ( this.sort.name == "microServiceName" )
            this.sortDropdown = "Alphabetic";
        else if ( this.sort.name == "creditsPerAPICall" )
            this.sortDropdown = "Price";
        else if ( this.sort.name == "releaseDate" )
            this.sortDropdown = "Release Date";

        this.microServiceService.getSortingDetail( this.sort.name ).subscribe(( res: MicroServiceMetadata[] ) =>
        {
        this.microServices = res;
        this.loading = false; },

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

    public serviceDetail( selectedService: string, selectedServiceCategory: string ) {
        this.globalServiceObj.microServiceName = selectedService;
        this.globalServiceObj.categoryMS = selectedServiceCategory;
        this.globalServiceObj.fromMarketPlace = false;
        this.router.navigate( ["/microservicedetails"] , { skipLocationChange: true });
    }

    public setServicesFlag( service: string ) {
        this.globalServiceObj.allMyServices = service;
        ( <HTMLInputElement>document.getElementById( "srchterm" ) ).value = "";
        this.getInitialData();
    }

    public counter:number  = 1;
    public timerForLogout;

    public callScheduler() {
        if(this.counter == 1) {
        this.counter++;
        this.timerForLogout = setInterval(() => {
          this.microServices=[];
          this.loading=true;
          alert(this.publicConfiguration.timeoutMsg);
          window.location.reload(false);
        }, this.globalServiceObj.sessionTimeout );
        }
        let searchServices: string[] = [];
        this.microServiceScheduler = [];
        for ( let i = 0; i < this.onBoardStatus.length; i++ ) {
            searchServices.push( this.onBoardStatus[i].name );
        }

        if(this.microServices.length > 0) {
        this.microServiceService.getMicroServicesScheduler( searchServices ).
    subscribe(( res: MicroServiceMetadata[] ) => {
            this.microServiceScheduler = res;
            for ( let i = 0; i < this.microServiceScheduler.length; i++ ) {
                for ( let j = 0; j < this.microServices.length; j++ ) {
                    if ( this.microServiceScheduler[i].microServiceName == this.microServices[j].microServiceName ) {
                        if ( this.microServiceScheduler[i].onBoardStatus != this.microServices[j].onBoardStatus ) {
                            this.microServices[j].onBoardStatus = this.microServiceScheduler[i].onBoardStatus;
                        }
                    }
                }
            }
            this.onBoardStatus = [];
            for ( let i = 0; i < this.microServices.length; i++ ) {
                if ( this.microServices[i].onBoardStatus.toLocaleLowerCase() == "pending" || this.microServices[i].onBoardStatus.toLocaleLowerCase() == "sandboxed" ) {
                    if ( this.checkUniqueness( this.microServices[i].microServiceName ) ) {
                        this.onBoardStatus.push( new OnBoardStatus( this.microServices[i].microServiceName, this.microServices[i].onBoardStatus ) );
                    }
                }
            }
        },
            ( error ) => {
                this.sessionTimeout.checkSession(error);
                if ( error.json().message == null || error.json().message == undefined ||
        error.json().message == "" ) {
                    //this.errorMessage = "Microservice data could not be fetched";
                    console.log("Microservice data could not be fetched");
                }
                else {
                    this.errorMessage = error.json().message;
                    console.log("Error from scheduler=" + error.json().message);
                }
            }
        );
        }

    }

    public checkUniqueness( serviceName: string ) {
        let flag = true;
        for ( let i = 0; i < this.onBoardStatus.length; i++ ) {
            if ( this.onBoardStatus[i].name == serviceName ) {
                flag = false;
            }
        }
        return flag;
    }

}
