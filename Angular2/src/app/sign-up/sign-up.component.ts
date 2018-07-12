import { Component, OnInit, EventEmitter, Input, Output } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from "@angular/forms";
import { Router, RouterModule }  from "@angular/router";
import { Configuration } from "../app.constants";
import { Country } from "../common-services/Country";
import {CountryState} from "../common-services/countrystatelist";
import { State } from "../common-services/State";
import { EqualValidator } from "../equal-validator.directive";
import { SignUp } from "./sign-up.model";
import { SignUpService } from "./sign-up.service";
import { GlobalServiceService } from '../global-service.service';
@Component({
    selector: "app-sign-up",
    templateUrl: "./sign-up.component.html",
    styleUrls: ["./sign-up.component.css"],
    providers: [SignUpService, Configuration],
})
export class SignUpComponent implements OnInit {
    public signUp = new SignUp();
    // public signUp: SignUp;
    public signUpPostResults = new SignUp;
    public signUpForm: FormGroup;
    public submitted: boolean;
    public events: any[] = [];
    public showSuccessPopUp = false;
    public errorMessage: string;
    public resStatus: string;
    public signUpFor: string =null;
    public selectedCountry: Country=null;
    public countries: Country[];
    public states: State[];
    public config: Configuration;
    public termsFlag: boolean = false;
    @Input() public counterValue = 0;
    @Output() public counterChange = new EventEmitter();

    constructor(private fb: FormBuilder, private signUpService: SignUpService,
        private route: Router, private countrystate: CountryState, private configuration: Configuration,
        private globalservice: GlobalServiceService) {
        this.config = configuration;
        this.countries = this.countrystate.getCountries();
        this.countries.sort(function(a, b) {
            var nameA = a.name.toLowerCase(), nameB = b.name.toLowerCase()
            if (nameA < nameB) //sort string ascending
                return -1
            if (nameA > nameB)
                return 1
            return 0
        });
        //this.selectedCountry = this.countries[0];
        //this.onSelect(this.selectedCountry);
        //  this.signUp.state = this.states[0].name;

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
        //this.signUp.state = this.states[0].name;

    }

    public ngOnInit() {
        this.signUp.state=null;
        /*this.signUp ={
                         firstName: '',
                       lastName: '',
                       emailId: '',
                       username: '',
                       password: '',
                       retypePassword: '',
                         country: 'Select Country',
                         state: '',
                         companyName: '',
                         signingUpFor: '',
                         termsnconditons: false
                     }*/
    }
    public submitForm(f: SignUp) {
        this.signUp.signingUpFor = [];
        this.errorMessage = undefined;
		      if (this.signUpFor == "App Developer") {
            this.signUp.signingUpFor[0] = this.config.mobileAppsDeveloper;
        }
        if (this.signUpFor == "MS Developer") {
            this.signUp.signingUpFor[0] = this.config.microServiceDeveloper;
        }
        if (this.signUpFor == "PaaS Operator") {
            this.signUp.signingUpFor[0] = this.config.newCoDeveloper;
        }
        if (this.signUpFor == "MS Developer and App Developer") {
            this.signUp.signingUpFor[0] = this.config.microServiceDeveloper;
            this.signUp.signingUpFor[1] = this.config.mobileAppsDeveloper;
        }

        this.signUp.country = this.selectedCountry.name;
        this.signUpService.createSignUp(this.signUp).subscribe((res) => {
            this.signUpPostResults = res;
            this.resStatus = res.status.toLocaleLowerCase();
            if (this.resStatus == "success") {
                this.errorMessage = undefined;
                this.showSuccessPopUp = true;
            }else {
              this.showSuccessPopUp = false;
            }
        },
            (error) => {
                this.showSuccessPopUp = false;
                if (error.json().message == null || error.json().message == undefined || error.json().message == "") {
                    this.errorMessage = "Signup request could not be submitted";
                }
                else {
                    this.errorMessage = error.json().message;
                }
            }
        );
    }
    public redirectToLogin() {
        this.counterValue = 0;
        this.counterChange.emit({
            value: this.counterValue,
        });
        //        this.route.navigate(["/login"]);
        window.location.assign(this.globalservice.baseURL);
    }

    public setTerms() {
        this.termsFlag = !this.termsFlag;
    }
}
