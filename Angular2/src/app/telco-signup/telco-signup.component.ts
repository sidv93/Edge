import { Component, OnInit} from "@angular/core";
import { Router, RouterModule}  from "@angular/router";
import {Configuration} from "../app.constants";
import { Country } from "../common-services/Country";
import { CountryState } from "../common-services/countrystatelist";
import { MainPageComponent } from "../main-page/main-page.component";
import { SignUp } from "../sign-up/sign-up.model";
import { SignUpService } from "../sign-up/sign-up.service";
@Component( {
    selector: "app-telco-signup",
    templateUrl: "./telco-signup.component.html",
    providers: [SignUpService],
})
export class TelcoSignupComponent implements OnInit {
    public telcoSignup = new SignUp();
    public signUp: SignUp;
    //  public selectedCountry: Country = new Country(1, "Algeria");
    public countries: Country[];
    public signUpPostResults = new SignUp;
    public errorMessage: string;
    public showSuccessPopUp: boolean;
    public signUpError: boolean;
    public image: string;
    constructor( private countrystate: CountryState, private route: Router, private signUpService: SignUpService, private mainpage: MainPageComponent,
        private configuration: Configuration ) {
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
      this.telcoSignup.country = null;
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
            this.image = myReader.result;
        };
        myReader.readAsDataURL( file );
        myReader.onerror = function ( error ) {

        };
    }
    public submitSignUp() {
        this.telcoSignup.telcoLogo = this.image;
        let signingUpFor: string[] = [];

        // this.telcoSignup.country = this.selectedCountry.name;
        signingUpFor.push( this.configuration.telcoDeveloper );
        this.telcoSignup.signingUpFor = signingUpFor;
        this.signUpService.createSignUp( this.telcoSignup ).subscribe(( res ) => {

            if ( res.status.toLocaleLowerCase() == "success" ) {
                this.errorMessage = undefined;
                this.showSuccessPopUp = true;
            }
        },
            ( error ) => {
                this.showSuccessPopUp = false;
                this.signUpError = true;
                if ( error.json().message == null || error.json().message == undefined || error.json().message == "" ) {
                    this.errorMessage = "Signup request could not be submitted";
                }
                else {
                    this.errorMessage = error.json().message;
                }
            }
        );
    }
}
