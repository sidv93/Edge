import { Component, Input, OnInit } from "@angular/core";
import {enableProdMode} from "@angular/core";
import { Headers, Http, RequestOptions, Response } from "@angular/http";
import { Router } from "@angular/router";
import {Observable} from "rxjs/Rx";
import { Configuration } from "../app.constants";
import {MicroServiceMetadata} from "../common-services/microServiceMetadata";
import {OnBoardStatus} from "../common-services/onBoardStatus";
import { GlobalServiceService } from "../global-service.service";
import {MicroServiceService} from "../micro-service/micro-service.service";
import {MarketPlaceService} from "./marketPlace.service";
import { SessionTimeout } from "../common-services/session-timeout";
import { MSRatings} from "../common-services/ms-ratings";

@Component( {
    selector: "",
    templateUrl: "./market-place.component.html",
    styleUrls: ["./market-place.component.css"],
    providers: [MarketPlaceService, Configuration, MicroServiceService,SessionTimeout],
})
export class MarketPlaceComponent implements OnInit {
    public marketP: MicroServiceMetadata[] = [];
    public mar = new MicroServiceMetadata();
    public sort = new OnBoardStatus( "rating", "none" );
    public servicePresent: boolean = true;
    public initialItems: number;
    public dropDownArray: number[] = [];
    public ItemDifferenceDropdown: number;
    public MaxItemDropdown: number;
    public getData: string;
    public title = "Market Place";
    public sortDropdown: string = "Most Popular";
    public errorMessage: string;
    public viewSubscriptions: boolean = false;
    private tempValue: number = 0;
    @Input() private post: string;
    public loading:boolean = false;
    public feedback:MSRatings[] =[];
    public feedbackFlag : boolean = false;
    public MSName :string;
    public rating: number;
    constructor( private marketPlaceService: MarketPlaceService,
        private http: Http, private globalServiceObj: GlobalServiceService,
		private router: Router, private publicConfiguration: Configuration,
		private microServiceService: MicroServiceService, private sessionTimeout : SessionTimeout ) {
        this.initialItems = publicConfiguration.MinItemFirstLoad;
        this.ItemDifferenceDropdown = publicConfiguration.ItemDifference;
        this.MaxItemDropdown = publicConfiguration.MaxItemsInDrop;
    }

    public search( term ) {
        this.loading = true;
        this.sort.name = "microServiceName";
        this.microServiceService.searchMarketPlace( term ).subscribe(( res: MicroServiceMetadata[] ) => {
            this.marketP = res;
            if ( this.marketP.length == 0 ) {
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

        this.microServiceService.sortMarketPlace( this.sort.name ).subscribe(( res: MicroServiceMetadata[] ) =>
        { this.marketP = res;
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

    public serviceDetail( selectedService: string, selectedServiceCategory: string ) {
        this.globalServiceObj.microServiceName = selectedService;
        this.globalServiceObj.categoryMS = selectedServiceCategory;
        this.globalServiceObj.fromMarketPlace = true;
        this.router.navigate( ["/microservicedetails"], { skipLocationChange: true } );
    }

    public ngOnInit() {
        this.globalServiceObj.fromMarketPlace = true;
        this.sort.name = "microServiceName";
        this.feedback[0] = new MSRatings();
        this.feedback[0].userId = "Siddharth";
        this.feedback[0].rating = 4;
        this.feedback[0].feedback = "A very good product.";
        this.feedbackFlag = true;
        this.getInitialData();
    }

    public getInitialData() {
        this.loading = true;
        if ( this.globalServiceObj.marketPlaceView == "viewAll" ) {
            this.microServiceService.getServicesForMarketPlace().subscribe(
                ( data ) => {
                    this.marketP = <MicroServiceMetadata[]>data;

                    if ( this.marketP.length == 0 ) {
                        this.servicePresent = false;
                        this.errorMessage = "No records found";
                    }
                    else
                        this.servicePresent = true;

                    this.loading = false;
                },
                ( error ) => {
                    this.servicePresent = false;
                    this.sessionTimeout.checkSession(error);
                    if ( error.json().message == null || error.json().message == undefined ||
					error.json().message == "" ) {
                        this.errorMessage = "Marketplace data could not be fetched";
                    }
                    else {
                        this.errorMessage = error.json().message;
                    }
                    this.loading = false;
                }
            );
        }
        else if ( this.globalServiceObj.marketPlaceView == "viewSubscriptions" ) {
            this.microServiceService.getSubscribedServices().subscribe(
                data => {
                    this.marketP = <MicroServiceMetadata[]>data

                    if ( this.marketP.length == 0 ) {
                        this.servicePresent = false;
                        this.errorMessage = "No records found";
                    }
                    else
                        this.servicePresent = true;

                    this.loading = false;
                },
                ( error ) => {
                    this.servicePresent = false;
                    this.sessionTimeout.checkSession(error);
                    if ( error.json().message == null || error.json().message == undefined ||
					error.json().message == "" ) {
                        this.errorMessage = "Subscribed services could not be fetched";
                    }
                    else {
                        this.errorMessage = error.json().message;
                    }
                    this.loading = false;
                }
            );
        }

    }

    public setMicroserviceMarketPlaceFlag( microservicemarketPlace: string ) {
        this.globalServiceObj.marketPlaceView = microservicemarketPlace;
        ( <HTMLInputElement>document.getElementById( "srchterm" ) ).value = "";
        //		(<HTMLInputElement> document.getElementById("selectSort")).value = "microServiceName";
        this.sort.name = "microServiceName";
        this.getInitialData();
    }

    public getFeedback(star: number) {
      console.log("Star= " + star);
      this.feedbackFlag = true;
      this.feedback = [];
      switch(star) {
        case 5: {
            console.log("case 5");
            for(let i =0; i< 8; i++) {
              this.feedback[i] = new MSRatings();
              this.feedback[i].rating = 5;
              if(i%2 == 0){
                  this.feedback[i].userId = "Siddharth";
                  this.feedback[i].feedback = "A brilliant microservice. A very well build and works fine wih all applications slahdgu atksdguyas gs hbd uagduy a gsdj asgi ud habdkaj sb dkj a hdb g yaufeu kf gwre i   uifhiyo dfsj";
              }
              else {
                  this.feedback[i].userId = "Venkatesh";
                  this.feedback[i].feedback = "A very good product. Very useful."
              }
            }
            break;
        }
        case 4: {
            console.log("case 4");
            for(let i =0; i< 4; i++) {
              this.feedback[i] = new MSRatings();
              this.feedback[i].rating = 4;
              if(i%2 == 0){
                  this.feedback[i].userId = "Siddharth";
                  this.feedback[i].feedback = "A brilliant microservice. A very well build and works fine wih all applications slahdgu atksdguyas gs hbd uagduy a gsdj asgi ud habdkaj sb dkj a hdb g yaufeu kf gwre i   uifhiyo dfsj";
              }
              else {
                  this.feedback[i].userId = "Venkatesh";
                  this.feedback[i].feedback = "A very good product. Very useful."
              }
            }
            break;
        }
        case 3: {
            console.log("case 3");
            for(let i =0; i< 2; i++) {
              this.feedback[i] = new MSRatings();
              this.feedback[i].rating = 3;
              if(i%2 == 0){
                  this.feedback[i].userId = "Siddharth";
                  this.feedback[i].feedback = "A brilliant microservice. A very well build and works fine wih all applications slahdgu atksdguyas gs hbd uagduy a gsdj asgi ud habdkaj sb dkj a hdb g yaufeu kf gwre i   uifhiyo dfsj";
              }
              else {
                  this.feedback[i].userId = "Venkatesh";
                  this.feedback[i].feedback = "A very good product. Very useful."
              }
            }
            break;
        }
        case 2: {
            console.log("case 2");
            for(let i =0; i< 1; i++) {
              this.feedback[i] = new MSRatings();
              this.feedback[i].rating = 2;
              if(i%2 == 0){
                  this.feedback[i].userId = "Siddharth";
                  this.feedback[i].feedback = "A brilliant microservice. A very well build and works fine wih all applications slahdgu atksdguyas gs hbd uagduy a gsdj asgi ud habdkaj sb dkj a hdb g yaufeu kf gwre i   uifhiyo dfsj";
              }
              else {
                  this.feedback[i].userId = "Venkatesh";
                  this.feedback[i].feedback = "A very good product. Very useful."
              }
            }
            break;
        }
        case 1: {
            console.log("case 1");
            for(let i =0; i< 10; i++) {
              this.feedback[i] = new MSRatings();
              this.feedback[i].rating = 1;
              if(i%2 == 0){
                  this.feedback[i].userId = "Siddharth";
                  this.feedback[i].feedback = "A brilliant microservice. A very well build and works fine wih all applications slahdgu atksdguyas gs hbd uagduy a gsdj asgi ud habdkaj sb dkj a hdb g yaufeu kf gwre i   uifhiyo dfsj";
              }
              else {
                  this.feedback[i].userId = "Venkatesh";
                  this.feedback[i].feedback = "A very good product. Very useful."
              }
            }
            break;
        }
      }
    }

    public setMSName(msName : string , rating : number) {
      this.MSName = msName;
      this.rating = rating;
    }
}
