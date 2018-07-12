import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Configuration } from "../app.constants";
import { Country } from "../common-services/Country";
import {CountryState} from "../common-services/countrystatelist";
import {MicroServiceError} from "../common-services/microServiceError";
import {MicroServiceMetadata} from "../common-services/microServiceMetadata";
import {GlobalServiceService} from "../global-service.service";
import {MicroServiceDetailsService} from "./micro-service-details.service";
import {MicroServiceService} from "../micro-service/micro-service.service";
import { SessionTimeout } from "../common-services/session-timeout";
import { MSRatings,IndividualRatings} from "../common-services/ms-ratings";
import { Endpoints,Microservice,NetworkBinding,HttpGateway,EventGateway } from "../common-services/endpoints";

@Component( {
    selector: "app-micro-service-details",
    templateUrl: "./micro-service-details.component.html",
    providers: [Configuration, MicroServiceDetailsService,SessionTimeout],
})
export class MicroServiceDetailsComponent implements OnInit {

    public serviceDetailed = new MicroServiceMetadata();
    public serviceDetailedBkp = new MicroServiceMetadata();
    public editPutResults = new MicroServiceMetadata();
    public deleteResult = new MicroServiceMetadata();
    public mobileDetailScheduler = new MicroServiceMetadata();
    public errorDetails = new MicroServiceError();
    public resultStatus: string;
    public deleteResultStatus: string;
    public errorMessage: string;
    public errorMessageDel: string;
    public showSuccessPopUp = false;
    public deletePopup = false;
    public microServiceName: string;
    public categoryMS: string;
    public userService: boolean;
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
    public deleteSuccess = true;
    public selectedCountry: Country = new Country( 1, "Algeria","dz","213" );
    public countries: Country[];
    public test: boolean = false;
    public myAllServices: boolean;
    public errorFlag: boolean = false;
    private usageGraphFlag: boolean = false;
    private ModalFlag: boolean = false;
    private approve: string = "approve";
    public loading:boolean = false;
    public counter:number=1;
    public timerForLogout;
    public feedbackText:string = "Enter your feedback..";
    public emptyStar = "assets/image/icons/star.png";
    public selectedStar = "assets/image/icons/star_selected.png";
    public initStar="assets/image/icons/star.png";
    public clicked : boolean = false;
    public editing : boolean = true;
    public rating : number = 0;
    public tooltip : boolean = false;
    public notRated : boolean = false;
    public barChartData: Array<any> = [];
    public barChartLabels: string[] = [];
    public barChartOptions: any;
    public barChartColors: Array<any>;
    public barChartLegend: boolean = true;
    public barChartType: string;
    public feedbackFlag : boolean = true;
    public feedback:MSRatings[] =[];
    public feedback_bkp:MSRatings[]=[];
    public feedbackObj : MSRatings;
    public feedbackSubmitFail : boolean = false;
    public feedbackSubmitted : boolean = false;
    public endpoints = new Endpoints();
    public sandboxError : boolean = false;
    public ratingsCount= new IndividualRatings();
    public userRatings = new MSRatings();

    constructor( private publicConfiguration: Configuration,
        private microServiceService: MicroServiceService,
        private router: Router, private globalServiceObj: GlobalServiceService,
		private microServiceDetailsService: MicroServiceDetailsService,
		private countrystate: CountryState, private sessionTimeout : SessionTimeout ) {
        this.microServiceName = globalServiceObj.microServiceName;
        this.categoryMS = globalServiceObj.categoryMS;
        this.countries = countrystate.getCountries();
    }

    public abc() {
        this.globalServiceObj.editMobileApps = false;
    }

    public getUsage() {
        this.usageGraphFlag = true;
    }

    public redirect() {
        //  this.router.navigate(['/onboard'], { skipLocationChange: true });
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
                this.loading=true;
                this.detailsError= true;
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

    public editMicroServiceFunc( name: string ) {
        this.globalServiceObj.editMicroService = true;
        this.globalServiceObj.microServiceName = name;
        this.test = true;
        this.ngOnDestroy();
        this.router.navigate( ["/onboard"] , { skipLocationChange: true });
    }

    public ngOnInit() {
        this.test = false;
        this.feedbackObj = new MSRatings();
        this.barChartData = [
             	{data: [65, 59, 80, 81, 56], label: 'Stars and ratings'}
        ];
        this.barChartLabels = ["1 star","2 star","3 star","4 star","5 star"];
        this.barChartOptions = {
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
        this.barChartColors = [
            { //  grey
                backgroundColor: "rgba(148,159,177,0.2)",
                borderColor: "rgba(148,159,177,1)",
                pointBackgroundColor: "rgba(148,159,177,1)",
                pointBorderColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "rgba(148,159,177,0.8)",
            },
        ];
        this.barChartLegend = true;
        this.barChartType = "bar";
        if ( this.globalServiceObj.allMyServices == "allServices" )
            this.userService = false;
        else if ( this.globalServiceObj.allMyServices == "myServices" )
            this.userService = true;

        if ( this.globalServiceObj.fromMarketPlace == true )
            this.fromMarketPlace = true;
        else
            this.fromMarketPlace = false;

        this.microServiceDetailsService.getServiceDetail( this.microServiceName ).subscribe(
            ( data ) => {
                this.serviceDetailed = <MicroServiceMetadata>data;
                this.globalServiceObj.microserviceUserId = this.serviceDetailed.userId;
                this.serviceDetailedBkp = Object.assign( new MicroServiceMetadata(), this.serviceDetailed );
            },

            ( error ) => {
                this.detailsError = true;
                this.sessionTimeout.checkSession(error);
                if ( error.json().message == null || error.json().message == undefined ||
				error.json().message == "" ) {
                    this.errorMessage = "Microservice details could not be fetched";
                }
                else {
                    this.errorMessage = error.json().message;
                }
            }
        );

        this.clearTimer = setInterval(() => {
            if ( ( this.serviceDetailed.onBoardStatus == "sandboxed" ||
			this.serviceDetailed.onBoardStatus == "pending" ) && this.userService ) {
                this.callScheduler();
            }
        }, 5000 );

    }

    public ngOnDestroy() {
        clearInterval( this.clearTimer );
        this.globalServiceObj.fromMarketPlace = false;
        this.fromMarketPlace = false;
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
        this.serviceDetailed = Object.assign( new MicroServiceMetadata(), this.serviceDetailedBkp );
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
        this.microServiceDetailsService.submitEditData( this.serviceDetailed ).subscribe(( res ) => {
            this.editPutResults = res;
            // 	  this.showSuccessPopUp=true;
            this.resultStatus = res.status.toLocaleLowerCase();
            if ( this.resultStatus == "success" ) {
                this.errorMessage = undefined;
                this.showSuccessPopUp = true;
            }
        },
            ( error ) => {
            this.sessionTimeout.checkSession(error);
            if ( error.json().message == null || error.json().message == undefined ||
    error.json().message == "" ) {
                this.errorMessage = "Edit data could not be submitted";
            }
            else {
                this.errorMessage = error.json().message;
            }
            }
        );

    }

    public setMSFlag( service: string ) {
        this.globalServiceObj.allMyServices = service;
    }

    public setMPFlag( market: string ) {
        this.globalServiceObj.marketPlaceView = market;
    }

    public pageRedirect() {
        this.router.navigate( ["/microservice"] , { skipLocationChange: true });

    }

    public deleteDetails() {
        this.deletePopup = false;
        this.microServiceDetailsService.submitDeleteData().subscribe(( res ) => {
            this.deleteResult = res;
            this.deleteResultStatus = res.status.toLocaleLowerCase();
            if ( this.deleteResultStatus == "success" ) {
                //  this.errorMessage = undefined;
                this.deleteSuccess = true;
                this.deletePopup = true;
            }
        },
            ( error ) => {
                this.deletePopup = true;
                this.deleteSuccess = false;
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

    public viewError( selectedService: string ) {
        this.microServiceDetailsService.getErrorDetail( selectedService ).subscribe(
            ( data ) => {
                this.errorMessage = undefined;
                this.errorDetails.microServiceName = data.microServiceName;
                this.errorDetails.metadata = data.metadata;
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
        this.microServiceDetailsService.approveService( this.globalServiceObj.userId, developerResponse, this.globalServiceObj.microServiceName ).subscribe(( res ) => {
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
                    this.errorMessage = "Approve request could not be submitted";
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
          alert(this.publicConfiguration.timeoutMsg);
          window.location.reload(false);
        }, this.globalServiceObj.sessionTimeout );
        }
        this.microServiceDetailsService.getServiceDetail( this.microServiceName ).
		subscribe(( res: MicroServiceMetadata ) => {
            this.mobileDetailScheduler = res;
            if ( this.serviceDetailed.microServiceName == this.mobileDetailScheduler.microServiceName ) {
                if ( this.serviceDetailed.onBoardStatus != this.mobileDetailScheduler.onBoardStatus ) {
                    this.serviceDetailed.onBoardStatus = this.mobileDetailScheduler.onBoardStatus;
                }
            }
        },
            ( error ) => {
              this.sessionTimeout.checkSession(error);
                if ( error.json().message == null || error.json().message == undefined ||
				error.json().message == "" ) {
                    this.errorMessage = "Microservice details could not be fetched";
                }
                else {
                    this.errorMessage = error.json().message;
                }
            }
        );
    }

    public clearFeedback() {
      this.feedbackText = "";
    }

    public feedbackMouseEnter(star : number) {
        if(!this.clicked) {
          for(let i = 0; i < star; i++) {
            (<HTMLInputElement>document.getElementById("img"+i)).src = this.selectedStar;
          }
          for(let i = star; i < 5; i++) {
            (<HTMLInputElement>document.getElementById("img"+i)).src = this.emptyStar;
          }
        }
        else {
          this.clicked = false;
        }

    }
    public feedbackMouseOut(star : number) {
      if(!this.clicked) {
        for(let i=0;i < star; i++) {
          (<HTMLInputElement>document.getElementById("img"+i)).src = this.emptyStar;
        }
      }
      else {
        this.clicked = false;
      }
    }

    public feedbackMouseClick(star : number) {
      if(!this.clicked) {
        for(let i = 0; i < star; i++) {
          (<HTMLInputElement>document.getElementById("img"+i)).src = this.selectedStar;
        }
        this.clicked = true;
      }
      this.feedbackObj.rating = star;
      this.editing = false;
      this.notRated = false;
    }

    public setClicked() {
      this.clicked = !this.clicked;
      this.editing = true;
    }


    public getRatings(star: string) {
      this.feedbackFlag = true;
      this.feedback = [];
      this.feedback_bkp=[];
      this.microServiceDetailsService.getRatings(star).subscribe(
        (data) => {
        this.feedback_bkp= data;
        console.log("Ratings=" + JSON.stringify(this.feedback_bkp));
        for(let feed of this.feedback_bkp) {
          if(feed.feedback != null && feed.feedback != undefined && feed.feedback != '') {
            this.feedback.push(feed);
          }
        }
        if(this.feedback.length > 0) {
          this.feedbackFlag=true;
        }
        else {
          this.feedbackFlag = false;
        }
        },
        (error) => {
        this.feedbackFlag=false;
        this.sessionTimeout.checkSession(error);
          if ( error.json().message == null || error.json().message == undefined ||
            error.json().message == "" ) {
              this.errorMessage = "Feedback could not be submitted";
          }
          else {
              this.errorMessage = error.json().message;
          }
        }
      );
    }

    public submitFeedback() {
      console.log("in submit feedback");
      this.feedbackObj.userId = this.globalServiceObj.userName;
      this.feedbackObj.microServiceName = this.globalServiceObj.microServiceName;
      console.log("feedbackObj=" + JSON.stringify(this.feedbackObj));
      this.microServiceDetailsService.submitRating(this.feedbackObj).subscribe(
        (data) => {
            this.feedbackSubmitted = true;
            this.feedbackSubmitFail = false;
        },
        (error) => {
            this.feedbackSubmitFail = true;
            this.feedbackSubmitted = true;
            this.sessionTimeout.checkSession(error);
              if ( error.json().message == null || error.json().message == undefined ||
                error.json().message == "" ) {
                  this.errorMessage = "Feedback could not be submitted";
              }
              else {
                  this.errorMessage = error.json().message;
              }
        }
      )
    }

    public clearRatings() {
      this.feedbackObj = new MSRatings();
      this.feedbackSubmitFail = false;
      this.feedbackSubmitted = false;
      //this.notRated = true;
      this.getUserRatings();
    }

    public getEndpoints() {
      console.log("in get endpoints");
      this.microServiceDetailsService.getEndpoints().subscribe(
        (data) => {
            this.endpoints = data[0];
            console.log("Endpoints=" + JSON.stringify(this.endpoints));
            this.sandboxError = false;
        },
        (error) => {
            this.sandboxError = true;
            this.sessionTimeout.checkSession(error);
            if ( error.json().message == null || error.json().message == undefined ||
              error.json().message == "" ) {
                this.errorMessage = "Endpoints could not be fetched";
            }
            else {
                this.errorMessage = error.json().message;
            }
        }
      )
    }

    public editRating() {
    console.log("in edit ratings");
    this.feedbackObj.userId = this.globalServiceObj.userName;
    this.feedbackObj.microServiceName = this.globalServiceObj.microServiceName;
    console.log("feedbackObj=" + JSON.stringify(this.feedbackObj));
    this.microServiceDetailsService.editReview(this.feedbackObj).subscribe(
      (data) => {
          this.feedbackSubmitted = true;
          this.feedbackSubmitFail = false;
      },
      (error) => {
          this.feedbackSubmitFail = true;
          this.feedbackSubmitted = true;
          this.sessionTimeout.checkSession(error);
          if ( error.json().message == null || error.json().message == undefined ||
            error.json().message == "" ) {
              this.errorMessage = "Endpoints could not be fetched";
          }
          else {
              this.errorMessage = error.json().message;
          }
      }
    )
    }

    public getUserRatings() {
    console.log("in user ratings");
    this.microServiceDetailsService.getUserRatings().subscribe(
      (data) => {
          this.userRatings = data;
          if(this.userRatings.rating == undefined || this.userRatings.rating == null || this.userRatings.rating == 0) {
            for(let i = 0; i < 5; i++) {
              (<HTMLInputElement>document.getElementById("img"+i)).src = this.emptyStar;
            }
          }
          else {
          for(let i = 0; i < this.userRatings.rating; i++) {
            (<HTMLInputElement>document.getElementById("img"+i)).src = this.selectedStar;
          }
          }
      },
      (error) => {
          this.sessionTimeout.checkSession(error);
          if ( error.json().message == null || error.json().message == undefined ||
            error.json().message == "" ) {
              this.errorMessage = "Endpoints could not be fetched";
          }
          else {
              this.errorMessage = error.json().message;
          }
      });
    }

    public getCountRatings() {
    console.log("in count ratings");
    this.microServiceDetailsService.getCountOfRecords().subscribe(
      (data) => {
          console.log("Ratings=" + JSON.stringify(data));
          this.ratingsCount = data;
      },
      (error) => {
          this.sessionTimeout.checkSession(error);
          if ( error.json().message == null || error.json().message == undefined ||
            error.json().message == "" ) {
              this.errorMessage = "Endpoints could not be fetched";
          }
          else {
              this.errorMessage = error.json().message;
          }
      });
    }

    public getTopReviews() {
    console.log("in top reviews");
    this.feedback = [];
    this.feedback_bkp = [];
    this.microServiceDetailsService.getTopReviews().subscribe(
      (data) => {
          this.feedback_bkp= data;
          console.log("Ratings=" + JSON.stringify(this.feedback));
          for(let feed of this.feedback_bkp) {
            if(feed.feedback != null && feed.feedback != undefined && feed.feedback != '') {
              this.feedback.push(feed);
            }
          }
          if(this.feedback.length > 0) {
            this.feedbackFlag=true;
          }
          else {
            this.feedbackFlag = false;
          }
      },
      (error) => {
          this.feedbackFlag = false;
          this.sessionTimeout.checkSession(error);
          if ( error.json().message == null || error.json().message == undefined ||
            error.json().message == "" ) {
              this.errorMessage = "Endpoints could not be fetched";
          }
          else {
              this.errorMessage = error.json().message;
          }
      });
    }

    public ratings() {
      this.getCountRatings();
      this.getTopReviews();
    }
}
