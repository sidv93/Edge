import { Component, OnInit } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { GlobalServiceService } from "../global-service.service";
import {EdgePresent} from "../paas-admin/edgePresent";
import {SignUp} from "../sign-up/sign-up.model";
import {EdgeOnboardService} from "./edge-onboard.service";
import { Configuration } from "../app.constants";
import { SessionTimeout } from "../common-services/session-timeout";

@Component( {
    selector: "app-edge",
    templateUrl: "./edge-onboard.component.html",
    styleUrls: ["./edge-onboard.component.css"],
    providers: [EdgeOnboardService,SessionTimeout],
})
export class EdgeOnboardComponent implements OnInit {
    public edgePresent = new EdgePresent();
    public onBoardFlag: boolean = true;
    public errorMessage: string;
    public detailsFlag: boolean = false;
    public submitSummaryFlag: boolean = false;
    public image: string = "empty";
    public duplicateedgeName: boolean = false;
    public imageDimensionsFlag: boolean = false;
    public edgeStartFlag: boolean = true;
    public telcoUserList: string[] = [];
    public noOfCPU: boolean;
    public memoryFlag: boolean;
    public storageFlag: boolean;
    public chargesPerCPU: boolean;
    public chargesPerGB: boolean;
    public chargesPerGBStorage: boolean;
    private userList: SignUp[];
    public timer;
    public iconFlag : boolean = false;

    constructor( private router: Router, private edgeOnboardService: EdgeOnboardService,
	private globalServiceObj: GlobalServiceService, private configuration : Configuration, private sessionTimeout : SessionTimeout) {
    }

    public ngOnInit() {
        document.getElementById( "openModalButton" ).click();
        this.edgePresent.operator=null;
        this.edgePresent.telcoUser=null;
        this.onBoardFlag = true;
    }

    public ngOnDestroy() {
        clearInterval( this.timer );
    }

    public scheduler() {
        if(this.edgePresent.edgeName=='') {
          this.duplicateedgeName = false;
        }
    }

    public getTelcoUsersList( operatorName: string ) {
        this.edgeOnboardService.getTelcoUsersList( this.edgePresent.operator ).subscribe(
            ( data ) => {
                this.userList = <SignUp[]>data;
                if ( this.userList.length > 0 ) {
                    for ( let i = 0; i < this.userList.length; i++ ) {
                        if ( this.userList[i].userId != undefined || this.userList[i].userId != null ||
						this.userList[i].userId != "" ) {
                            if ( this.checkTelcoUserUniqueness( this.userList[i].userId ) ) {
                                this.telcoUserList.push( this.userList[i].userId );
                            }
                        }
                    }
                }
            },
            ( error ) => {
            this.sessionTimeout.checkSession(error);
            if ( error.json().message == null || error.json().message == undefined ||
    error.json().message == "" ) {
                this.errorMessage = "Telco user list could not be fetched";
            }
            else {
                this.errorMessage = error.json().message;
            }
            });
    }

    public checkTelcoUserUniqueness( userName: string ) {
        var flag = true;
        for ( var i = 0; i < this.telcoUserList.length; i++ ) {
            if ( this.telcoUserList[i] == userName ) {
                flag = false;
            }
        }
        return flag;
    }


    // Method to convert image into Base64
    public onChange( event: EventTarget ) {
        let file: File;
        let img = new Image();
        let eventObj: MSInputMethodContext = <MSInputMethodContext>event;
        let target: HTMLInputElement = <HTMLInputElement>eventObj.target;
        let files: FileList = target.files;
        file = files[0];
        let fileName: string = "";
        let extn: string = "";
        fileName = file.name;
        extn = fileName.substr( fileName.lastIndexOf( '.' ) + 1 );
        if ( this.configuration.imageFormats.indexOf( extn ) === -1 ) {
            console.log( "format not valid" );
            this.iconFlag = true;
        }
        else {
            this.iconFlag = false;
        }
        let myReader: FileReader = new FileReader();

        myReader.onloadend = ( e ) => {
            this.image = myReader.result;
            img.src = this.image;
            img.onload = () => {
            console.log("image dimesions=" + img.height + " width=" + img.width);
            if ( img.height > 100 || img.width > 100 )
                this.imageDimensionsFlag = true;
            else
                this.imageDimensionsFlag = false;
            };
        };
        myReader.readAsDataURL( file );
        myReader.onerror = function ( error ) {
        };
    }

    public onNext() {
        this.edgePresent.icon = this.image;
        this.onBoardFlag = false;
        this.detailsFlag = true;
    }

    public onDetailsBack() {
        this.onBoardFlag = true;
        this.detailsFlag = false;
    }

    public onNextDetails() {
        this.submitSummaryFlag = true;
        this.onBoardFlag = false;
        this.detailsFlag = false;
    }

    public onSubmitBack() {
        this.detailsFlag = true;
        this.submitSummaryFlag = false;
    }

    public onSubmit() {
        this.edgeOnboardService.submitOnBoardData( this.edgePresent ).subscribe(( res ) => {
        },
            ( error ) => {
            this.sessionTimeout.checkSession(error);
            if ( error.json().message == null || error.json().message == undefined ||
    error.json().message == "" ) {
                this.errorMessage = "Edge data could not be submitted";
            }
            else {
                this.errorMessage = error.json().message;
            }
            }
        );
    }
    public confirmedOnboard() {
        let icon: string[] = [];
        icon = this.edgePresent.icon.split( "base64," );
        this.edgePresent.icon = icon[1];
        this.edgePresent.userId = this.globalServiceObj.userName;
        this.edgeOnboardService.submitOnBoardData( this.edgePresent ).subscribe(( res ) => {

            // this.router.navigate(['/paasadmin']);
        },
            ( error ) => {
                this.edgeStartFlag = false;
                this.sessionTimeout.checkSession(error);
                if ( error.json().message == null || error.json().message == undefined ||
        error.json().message == "" ) {
                    this.errorMessage = "Edge data could not be submitted";
                }
                else {
                    this.errorMessage = error.json().message;
                }
            }
        );
    }

    public OnCloseFinal() {
        this.telcoUserList = null;
        this.edgePresent = new EdgePresent();
        this.onBoardFlag = true;
        this.detailsFlag = false;
        this.router.navigate( ["/paasadmin"] , { skipLocationChange: true });
    }

    public OnClose() {
        this.telcoUserList = null;
        this.edgePresent = new EdgePresent();
        this.router.navigate( ["/paasadmin"], { skipLocationChange: true } );
    }

    public onCancel() {
        this.router.navigate( ["/paasadmin"], { skipLocationChange: true } );
    }

    public ValidateEdgeName() {
        this.duplicateedgeName = false;
        if(this.edgePresent.edgeName != '') {
            this.edgeOnboardService.validateEdgeName( this.edgePresent.edgeName ).subscribe(( res ) => {
                if ( res.status != "success" ) {
                    this.duplicateedgeName = true;
                }
                else if(res.status == "success") {
                    this.duplicateedgeName = false;
                }
            },
                ( error ) => {
                    this.duplicateedgeName = true;
                    this.sessionTimeout.checkSession(error);
                    if ( error.json().message == null || error.json().message == undefined ||
            error.json().message == "" ) {
                        this.errorMessage = "Edge name could not be validated";
                    }
                    else {
                        this.errorMessage = error.json().message;
                    }
                }
            );
        }

        this.timer = setInterval(() => {
            if ( this.edgePresent.edgeName == '' )
                this.scheduler();
        }, 500 );
    }
}
