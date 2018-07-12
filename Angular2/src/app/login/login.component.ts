import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import { FormBuilder, FormGroup, NgForm, Validators} from "@angular/forms";
import { Router, RouterModule }  from "@angular/router";
import { Configuration } from "../app.constants";
import { ValidationService } from "../common-services/validation.service";
import {GlobalServiceService} from "../global-service.service";
import { User } from "./login.model";
import { LoginService } from "./login.service";

@Component( {
    selector: "app-login",
    providers: [LoginService, Configuration],
    templateUrl: "./login.component.html",

})
export class LoginComponent implements OnInit {

    public user: User;
    public loginPostResults = new User;
    public loginForm: FormGroup;
    public submitted: boolean;
    public events: any[] = [];
    public showSuccessPopUp = false;
    public errorMessage: string;
    @Input() public counterValue = 0;
    @Output() public counterChange = new EventEmitter();
    private baseURL: string;
    private baseURLLoad: string;

    // public user:User[]=[];

    constructor( private formBuilder: FormBuilder, private loginService: LoginService,
	private router: Router, private globalService: GlobalServiceService ) {
    }

    public login() {
        const URL = window.location.href.split('/');
		this.baseURL = URL[0]+"/"+URL[1]+"/"+URL[2]+"/"+URL[3]+"/";
		this.globalService.baseURL = this.baseURL;
    //this.globalService.baseURL = "http://172.19.74.212:8080/MECPortal/";
        this.globalService.userName = this.user.username;
        this.loginService.authenticateUser( this.user ).subscribe(( res ) => {
            this.loginPostResults = res;
            this.globalService.accessToken = res.headers.get("accessToken");
            this.globalService.sessionTimeout = res.json().sessionTimeout*1000;
            if ( res.errorMessage != undefined ) {
                this.errorMessage = res.errorMessage;
            }

            if ( res.json().userType.length == 0 ) {
                alert( "User type is empty" );
                this.counterValue = 0;
                this.counterChange.emit( {
                    value: this.counterValue,
                });
            }
            else {
                console.log("response login=" + JSON.stringify(res));
                for ( let i = 0; i < res.json().userType.length; i++ ) {
                    this.globalService.role.push( res.json().userType[i] );
                }
                this.globalService.companyName = res.json().companyName;
                console.log("company="+this.globalService.companyName );
                this.counterValue = 1;
                this.counterChange.emit( {
                    value: this.counterValue,
                });
                this.router.navigate( ["/mainpage"], { skipLocationChange: true } );
            }
        },
            ( error ) => {
                if ( error.json().message == null || error.json().message == undefined ||
				error.json().message == "" ) {
                    this.errorMessage = "Login failed";
                }
                else {
                    this.errorMessage = error.json().message;
                }
            }
        );

    }

    public signup() {
        //  this.counterValue=2;
        //  this.counterChange.emit({
        //        value: this.counterValue
        //      })
		const URL1 = window.location.href.split('/');
		this.baseURL = URL1[0]+"/"+URL1[1]+"/"+URL1[2]+"/"+URL1[3]+"/";
        this.globalService.baseURL = this.baseURL;
        this.router.navigate( ["/signup"], { skipLocationChange: true } );
    }
    public redirectToSignUp() {
        this.counterValue = 2;
        this.counterChange.emit( {
            value: this.counterValue,
        });
        const URL2 = window.location.href.split('/');
		this.baseURL = URL2[0]+"/"+URL2[1]+"/"+URL2[2]+"/"+URL2[3]+"/";
        this.globalService.baseURL = this.baseURL;
        this.router.navigate( ["/signup"], { skipLocationChange: true } );
    }
    public ngOnInit() {
        const URLLoad = window.location.href.split('/');
        console.log("URL 4th element-->"+URLLoad[4]);
        if (URLLoad[4] != undefined && URLLoad[4] != null && URLLoad[4]!='')
        {
            this.baseURLLoad = URLLoad[0]+"/"+URLLoad[1]+"/"+URLLoad[2]+"/"+URLLoad[3]+"/";
            window.location.assign(this.baseURLLoad);
        }
        this.user = {
            id: 0,
            username: "",
            password: "",
            role: "",
        };
    }

}
