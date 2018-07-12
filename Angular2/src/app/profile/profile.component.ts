import { Component, OnInit } from "@angular/core";
import {enableProdMode} from "@angular/core";
import { Headers, Http, RequestOptions, Response, URLSearchParams } from "@angular/http";
import { Router } from "@angular/router";
import { Configuration } from "../app.constants";
import { Profile } from "../common-services/profile.model";
import { CardDetails, Credits, PeopleInCircle } from "../common-services/profile.model";
import {ProfileServiceService} from "../common-services/profile.service";
import { GlobalServiceService } from "../global-service.service";
import { OnBoardStatus } from "../common-services/onBoardStatus";
import { Country } from "../common-services/Country";
import {CountryState} from "../common-services/countrystatelist";
import { State } from "../common-services/State";

@Component( {
    selector: "app-profile",
    templateUrl: "./profile.component.html",
    styleUrls: ["./profile.component.css"],
    providers: [ProfileServiceService, Configuration],
})
export class ProfileComponent implements OnInit {
    public userDetails;
    public userDetails_Bkp = new Profile();

    public peopleInCircle: PeopleInCircle[] = [];
    public cardInfoDetail = new CardDetails();
    public creditObj = new Credits();
    public updateCredits = new Credits();
    public errorMessage1: string;
    public errorMessage: string;
    public errorMessage3: string;
    public errorMessage4: string;
    public showSuccessPopUp: boolean;
    public lessCreditsFlag = false;
    public editFlag: boolean = false;
    public accountFlag: boolean = true;
    public editPutResults = new Profile();
    public resultStatus: string;
    public nonEditablePersonalInfo: boolean = true;
    public resStatus: string;
    public tabStatus: string;
    public editableImage: boolean = false;
    public saveAllInfo: string = "yes";
    public paymentDue: number;
    public EditableBankingInfo: boolean = false;
    public addCardFlag: boolean = false;
    public saveSuccess: boolean = false;
    public saveFail: boolean = false;
    public creditAddSucc: boolean = false;
    public creditAddFail: boolean = false;
    public emailFlag: boolean = true;
    public countries: Country[];
    public cc:Country;
    public callingCode:string;
    public mobileNumber:string;
    public selectedCountry:Country;
    public states: State[];
    public selectedState : State;
    public ccForSave : string;
    constructor( private profileObj: ProfileServiceService, private publicConfiguration: Configuration, private router: Router, private globalServiceObj: GlobalServiceService,private countrystate: CountryState ) {
        this.userDetails = new Profile();
        console.log("")
        this.countries = this.countrystate.getCountries();
        this.countries.sort( function ( a, b ) {
            var nameA = a.name.toLowerCase(), nameB = b.name.toLowerCase()
            if ( nameA < nameB ) //sort string ascending
                return -1
            if ( nameA > nameB )
                return 1
            return 0
        });
    }
    public ngOnInit() {
        this.fetchUserProfile();
        this.tabStatus = "userDetail";

    }
    // Method to convert image into Base64
    public onChange( event: EventTarget ) {
        let file: File;
        let eventObj: MSInputMethodContext = <MSInputMethodContext>event;
        let target: HTMLInputElement = <HTMLInputElement>eventObj.target;
        let files: FileList = target.files;
        file = files[0];
        let myReader: FileReader = new FileReader();

        myReader.onloadend = ( e ) => {
            this.userDetails.profilePic = myReader.result;
        };
        myReader.readAsDataURL( file );
        myReader.onerror = function ( error ) {
        };
    }

    public onSelect(country) {
        this.states = this.countrystate.getStates()
            .filter((item) => item.countryid == country.id);
        this.states.sort(function(a, b) {
            var nameA = a.name.toLowerCase(), nameB = b.name.toLowerCase()
            if (nameA < nameB) //sort string ascending
                return -1
            if (nameA > nameB)
                return 1
            return 0
        });
        this.selectedState = this.states[0];
        //console.log(JSON.stringify(( <HTMLInputElement>document.getElementById( "state" ) )));
        //( <HTMLInputElement>document.getElementById( "state" ) ).value = null;
        //this.signUp.state = this.states[0].name;

    }

    public editImage() {
        this.editableImage = true;
    }

    public setTabFlag( tabFlag: string ) {
        this.tabStatus = tabFlag;
    }
    public personalInfoEdit() {
        this.nonEditablePersonalInfo = false;
        console.log("mobile number from back" + this.userDetails.contactNumber);
        if(this.userDetails.contactNumber != null && this.userDetails.contactNumber != undefined && this.userDetails.contactNumber != "") {
              console.log("mobile number="+ this.userDetails.contactNumber);
              if(this.userDetails.contactNumber.includes("+")) {
                    let cCode = "";
                    for(let i=0;i<this.userDetails.contactNumber.length;i++) {
                      if(this.userDetails.contactNumber[i] == "+")
                        continue;
                      else if(this.userDetails.contactNumber[i] != " ") {
                        cCode+=this.userDetails.contactNumber[i];
                      }
                      else
                        break;
                    }
                    console.log("cCode=" + cCode);
                    for(let i = 0;i < this.countries.length;i++) {
                      if(this.countries[i].callingCode == cCode) {
                        this.cc = this.countries[i];
                        break;
                      }
                    }
                    ( <HTMLInputElement>document.getElementById( "select" ) ).value = null;
                    console.log("cc after loop=" + JSON.stringify(this.cc));
                    this.callingCode = this.cc.countryCode.toUpperCase() + " +" + this.cc.callingCode;
                    this.ccForSave=this.cc.callingCode;
                    this.cc=null;
                    //( <HTMLInputElement>document.getElementById( "input" ) ).value = this.cc.countryCode.toUpperCase() + " +" + this.cc.callingCode;
                    let i=0;
                    while(this.userDetails.contactNumber[i] != " ") {
                      i++;
                    }
                    console.log("index of space = " + i);
                    let mobile= this.userDetails.contactNumber.substring(++i);
                    console.log(" final retrieved mobile number=" + mobile);
                    //( <HTMLInputElement>document.getElementById( "contactNumber" ) ).value =mobile;
                    this.mobileNumber = mobile;
              }
              else {
                    this.cc=null;
                    //( <HTMLInputElement>document.getElementById( "input" ) ).value = "";
                    this.callingCode = "";
              }
            }
        else {
              console.log("location=" + this.userDetails.country);
              for(var i=0; i < this.countries.length; i++) {
                  if(this.countries[i].name.toLowerCase() === this.userDetails.country.toLowerCase()) {
                      this.cc = this.countries[i];
                      break;
                  }
              }
              console.log("cc= " + JSON.stringify(this.cc));
              //( <HTMLInputElement>document.getElementById( "input" ) ).value = this.cc.countryCode.toUpperCase() + " +" + this.cc.callingCode;
              this.callingCode = this.cc.countryCode.toUpperCase() + " +" + this.cc.callingCode;
        }

        console.log("country=" + this.userDetails.country + " state=" + this.userDetails.state);
        if((this.userDetails.country != undefined && this.userDetails.country != null && this.userDetails.country != "") &&
          (this.userDetails.state != undefined && this.userDetails.state != null && this.userDetails.state != "")) {
            for(let i = 0; i < this.countries.length; i++) {
                if(this.userDetails.country === this.countries[i].name) {
                    this.selectedCountry = this.countries[i];
                    break;
                }
            }
            this.onSelect(this.selectedCountry);
            for(let i = 0; i < this.states.length; i++) {
                if(this.userDetails.state === this.states[i].name) {
                    this.selectedState = this.states[i];
                    break;
                }
            }
            console.log("country=" + JSON.stringify(this.selectedCountry) + " state=" + JSON.stringify(this.selectedState));
        }
    }
    public cancelPersonalInfo() {
        this.nonEditablePersonalInfo = true;
        this.fetchUserProfile();
    }
    public saveImageInfo() {
        this.editableImage = false;
        this.saveAllInfo = "no";
        this.saveProfileInfo( this.saveAllInfo );
    }
    public cancelImageInfo() {
        this.editableImage = false;
        this.fetchUserProfile();
    }
    public checkEmail() {
        var regex="";
        if(/[^@]+@[^@]+\.[a-zA-Z]{2,}/.test(this.userDetails.email)) {
          console.log("setting true");
          this.emailFlag=true;
        }
        else {
          console.log("setting false");
          this.emailFlag=false;
        }

    }
    public checkCC() {
      if(( <HTMLInputElement>document.getElementById( "input" ) ).value == undefined ||
        ( <HTMLInputElement>document.getElementById( "input" ) ).value == null ||
        ( <HTMLInputElement>document.getElementById( "input" ) ).value == "") {
          return false;
        }
        else
          return true;
    }

    public savePersonalInfo() {
    let flag:boolean= false;
    console.log("country = " + JSON.stringify(this.selectedCountry) + " state= " + JSON.stringify(this.selectedState));
    console.log((this.selectedState==undefined));
    if((this.selectedCountry == undefined || this.selectedCountry == null )
    && (this.selectedState == undefined || this.selectedState == null)) {
      this.userDetails.country = "";
      this.userDetails.state = "";
      console.log("in 1st if");
    }
    else {
    if((this.selectedCountry != undefined && this.selectedCountry != null )
    && (this.selectedState == undefined || this.selectedState == null)) {
      console.log("in case");
      flag=true;
     }
      else if((this.selectedCountry != undefined && this.selectedCountry != null )
      && (this.selectedState != undefined && this.selectedState != null)) {
        console.log("in 2nd if");
        this.userDetails.country = this.selectedCountry.name;
        this.userDetails.state = this.selectedState.name;
      }

    }

    if((this.callingCode == undefined ||
        this.callingCode == null ||
        this.callingCode == "") ||
      (this.mobileNumber == undefined || this.mobileNumber == null || this.mobileNumber == "")) {
        console.log("in if")
        this.cc = null;
        this.userDetails.contactNumber="";

      }
      else {
      console.log("in else");
      console.log("checking mobile number" + this.mobileNumber);
      console.log(isNaN(+this.mobileNumber));
      console.log(this.mobileNumber.includes(" "));
      if(isNaN(+this.mobileNumber) || this.mobileNumber.includes(" ")) {
        console.log("not a number or contains space");
        flag = true;
      } else if(!isNaN(+this.mobileNumber)) {
        this.userDetails.contactNumber="+"+this.ccForSave+ " " + this.mobileNumber;
        console.log("final mobile number=" + this.userDetails.contactNumber);
      }
      }
      console.log("flag = "+ flag);
      if(!flag) {
      if(this.emailFlag) {
        this.nonEditablePersonalInfo = true;
        this.saveAllInfo = "no";
        this.saveProfileInfo( this.saveAllInfo );
      }
      }

    }

    public creditsPage() {
        this.tabStatus = "userDetail";
    }
    public selectedCredits( credits: number ) {
        this.creditObj.numberOfCredits = credits;
    }
    public cancelOnPayBill() {
        this.userDetails = Object.assign( new Profile(), this.userDetails_Bkp );
        this.userDetails.cardInfo = Object.assign( new CardDetails(), this.userDetails_Bkp.cardInfo );
        this.tabStatus = "userDetail";
        if ( this.EditableBankingInfo ) {
            this.EditableBankingInfo = false;
        }
/*		if (this.addCardFlag)
		{
			this.userDetails.cardInfo.cardNumber = undefined;
			this.userDetails.cardInfo.cardHolderName = undefined;
		}
*/    }

    public bankingInfoEdit() {
        this.EditableBankingInfo = true;
    }

    public cancelOnCredits() {
        this.tabStatus = "userDetail";
    }
    public cancelTopup() {
        this.tabStatus = "userDetail";
    }
    /*public submit() {
        this.submitUserCredits();
    }*/
    public saveProfileInfo( saveAllInfo: string ) {
        if ( saveAllInfo == "yes" ) {
            this.tabStatus = "userDetail";
        }

        this.userDetails.cardInfo.cardExpiryDate = this.userDetails.cardInfo.expiryMonth + "/" + this.userDetails.cardInfo.expiryYear;
        //if ( this.userDetails.location != undefined && this.userDetails.location != null && this.userDetails.location != "" ) {
          //  this.userDetails.state = this.userDetails.location.split( ',' )[0];
            //this.userDetails.country = this.userDetails.location.split( ',' )[1];
        //}
        this.userDetails_Bkp = Object.assign( new Profile(), this.userDetails );
        this.userDetails_Bkp.cardInfo = Object.assign( new CardDetails(), this.userDetails.cardInfo );
        this.profileObj.saveProfileInfo( this.userDetails ).subscribe(
            ( data ) => {
                this.saveSuccess = true;
                this.saveFail = false;
            },
            ( error ) => {
                this.saveFail = true;
                this.saveSuccess = false;
                if ( error.json().message == null || error.json().message == undefined || error.json().message == "" ) {
                    this.errorMessage = "Profile Info could not be saved";
                }
                else {
                    this.errorMessage = error.json().message;
                }
            }
        );
    }

    public fetchDetails() {
        this.EditableBankingInfo = false;
        this.fetchUserProfile();
    }

    public fetchUserProfile() {
        this.profileObj.getUserDetail().subscribe(
            ( data ) => {
                this.userDetails = <Profile>data;
                this.userDetails_Bkp = Object.assign( new Profile(), this.userDetails );
                this.userDetails.cardInfo = data.cardInfo;
                this.userDetails.location = this.userDetails.state + "," + this.userDetails.country;
                if(this.userDetails.cardInfo != undefined || this.userDetails.cardInfo != null) {
                  this.userDetails_Bkp.cardInfo = Object.assign( new CardDetails(), this.userDetails.cardInfo );
                }
                if(this.userDetails.cardInfo != undefined || this.userDetails.cardInfo != null) {
                  if ( this.userDetails.cardInfo.cardHolderName == undefined || this.userDetails.cardInfo.cardHolderName == null
                      || this.userDetails.cardInfo.cardHolderName == "" ) {
                      this.addCardFlag = true;
                      this.EditableBankingInfo = false;
                  }
                  else {
                      this.userDetails.cardInfo.expiryMonth = this.userDetails.cardInfo.cardExpiryDate.split( '/' )[0];
                      this.userDetails.cardInfo.expiryYear = this.userDetails.cardInfo.cardExpiryDate.split( '/' )[1];
                      this.userDetails_Bkp.cardInfo.expiryMonth = this.userDetails.cardInfo.expiryMonth;
                      this.userDetails_Bkp.cardInfo.expiryYear = this.userDetails.cardInfo.expiryYear;
                      this.addCardFlag = false;
                  }
                }
                if ( this.userDetails.credits < 0 ) {
                    this.paymentDue = Math.abs( this.userDetails.credits );
                }
            },
            ( error ) => {
                if ( error.json().message == null || error.json().message == undefined || error.json().message == "" ) {
                    this.errorMessage = "Profile details could not be fetched";
                }
                else {
                    this.errorMessage = error.json().message;
                }
            }
        );
    }

    public submit() {
        this.creditObj.userId = this.globalServiceObj.userName;
        this.creditObj.addOrDelete = "add";
        this.profileObj.submitCreditInfo( this.creditObj ).subscribe(( res ) => {
            this.editPutResults = res;
            this.resultStatus = res.status.toLocaleLowerCase();
            this.creditAddSucc = true;
            this.creditAddFail = false;
            this.fetchUserProfile();
        },
            ( error ) => {
                this.creditAddFail = true;
                this.creditAddSucc = false;
                this.fetchUserProfile();
                if ( error.json().message == null || error.json().message == undefined || error.json().message == "" ) {
                    this.errorMessage4 = "User credits could not be submitted";
                }
                else {
                    this.errorMessage4 = error.json().message;
                }
            }
        );
    }

    /*  public addCredits(credit: number) {
          this.userDetails.credits = credit;
      }*/

      public onChangeCC() {
        console.log("cc=" + JSON.stringify(this.cc));

        this.callingCode=this.cc.countryCode.toUpperCase() + "+" + this.cc.callingCode;
        this.ccForSave=this.cc.callingCode;
        console.log("calling code= " + this.callingCode);
        ( <HTMLInputElement>document.getElementById( "select" ) ).value = null;
      }

}
