import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Configuration } from "../app.constants";
import { CloudletImages } from "../cloudlet/cloudletPresent";
import {CloudLetOnBoard} from "../common-services/cloudLetOnBoard";
import { GlobalServiceService } from "../global-service.service";
import { CloudletDetailsService } from "./cloudlet-details.service";
import { SessionTimeout } from "../common-services/session-timeout";

@Component( {
    selector: "app-cloudlet-details",
    templateUrl: "./cloudlet-details.component.html",
    styleUrls: ["./cloudlet-details.component.css"],
    providers: [Configuration, CloudletDetailsService,SessionTimeout],
})
export class CloudletDetailsComponent implements OnInit {
    public deletePopup = false;
    public cloudletImage: string;
    public deleteResult = new CloudLetOnBoard();
    public resultStatus: string;
    public deleteResultStatus: string;
    public deleteFailed = false;
    private cloudletName: string;
    private selectedCloudletDetails: CloudLetOnBoard;
    private selectedCloudletImageDetails: CloudletImages;
    private detailsError: boolean = false;
    private errorMessage: string;
    private cloudletsFlag: number;
    public loading:boolean = false;

    constructor( private publicConfiguration: Configuration, private router: Router,
        private globalServiceObj: GlobalServiceService,
        private cloudletDetailService: CloudletDetailsService , private sessionTimeout : SessionTimeout) {
        this.cloudletName = globalServiceObj.cloudletName;
        this.cloudletImage = globalServiceObj.cloudletImage;
        this.selectedCloudletDetails = new CloudLetOnBoard();
        this.selectedCloudletImageDetails = new CloudletImages();
    }

    public ngOnInit() {
        this.cloudletsFlag = this.globalServiceObj.cloudletsFlag;
        if ( this.globalServiceObj.cloudletsFlag === 1 ) {
            this.fetchCloudletDetails();
        }
        else if ( this.globalServiceObj.cloudletsFlag === 2 ) {
            this.fetchCloudletImageDetails();
        }
    }

    public fetchCloudletDetails() {
        this.cloudletDetailService.getCloudletDetails( this.cloudletName ).subscribe(
            ( data ) => {
                this.selectedCloudletDetails = <CloudLetOnBoard>data;
                this.detailsError = false;
            },
            ( error ) => {
                this.detailsError = true;
                this.sessionTimeout.checkSession(error);
                if ( error.json().message == null || error.json().message == undefined ||
                    error.json().message == "" ) {
                    this.errorMessage = "Cloudle details could not be fetched";
                }
                else {
                    this.errorMessage = error.json().message;
                }
            }
        );
    }

    public fetchCloudletImageDetails() {
        this.cloudletDetailService.getCloudletImageDetails( this.cloudletImage ).subscribe(
            ( data ) => {
                this.selectedCloudletImageDetails = <CloudletImages>data;
                this.detailsError = false;
            },
            ( error ) => {
                this.detailsError = true;
                this.sessionTimeout.checkSession(error);
                if ( error.json().message == null || error.json().message == undefined ||
                    error.json().message == "" ) {
                    this.errorMessage = "Cloudlet Image details could not be fetched";
                }
                else {
                    this.errorMessage = error.json().message;
                }
            }
        );
    }
    public setTab( selectedTab: string ) {
        if ( selectedTab == "cloudlet" ) {
            this.globalServiceObj.cloudletsFlag = 1;
            this.cloudletsFlag = this.globalServiceObj.cloudletsFlag;
            this.router.navigate( ['/cloudlet'], { skipLocationChange: true } );

        }
        else if ( selectedTab === "cloudletImage" ) {
            this.globalServiceObj.cloudletsFlag = 2;
            this.cloudletsFlag = this.globalServiceObj.cloudletsFlag;
            this.router.navigate( ["/cloudlet"], { skipLocationChange: true } );
        }
        else if ( selectedTab === "usage" ) {
            this.globalServiceObj.cloudletsFlag = 3;
            this.cloudletsFlag = this.globalServiceObj.cloudletsFlag;
        }
    }
    public editCloudlet( cloudletName: string ) {
        this.globalServiceObj.editCloudlet = true;
        this.globalServiceObj.cloudletName = cloudletName;
        // this.ngOnDestroy();
        this.router.navigate( ["/cloudletOnBoard"], { skipLocationChange: true } );
    }

    public deleteDetails() {
        this.deletePopup = false;
        if ( this.globalServiceObj.cloudletsFlag === 1 ) {
            this.cloudletDetailService.submitDeleteData( this.cloudletName,
                this.selectedCloudletDetails.edgeName )
                .subscribe(( res ) => {
                    this.deleteResult = res;
                    if ( res.status.toLocaleLowerCase() === "success" ) {
                        this.errorMessage = undefined;
                        this.deletePopup = true;
                        this.deleteFailed = false;
                    }
                },
                ( error ) => {
                    this.deletePopup = true;
                    this.deleteFailed = true;
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
        else if ( this.globalServiceObj.cloudletsFlag === 2 ) {
            this.cloudletDetailService.deleteImage( this.selectedCloudletImageDetails.imageName,
                this.selectedCloudletImageDetails.edgeName ).subscribe(( res ) => {
                    if ( res.status.toLocaleLowerCase() === "success" ) {
                        this.errorMessage = undefined;
                        this.deletePopup = true;
                        this.deleteFailed = false;
                    }
                },
                ( error ) => {
                    this.deletePopup = true;
                    this.deleteFailed = true;
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

    }
    public pageRedirect() {
        this.router.navigate( ["/cloudlet"], { skipLocationChange: true } );
    }

    public redirect() {
        this.router.navigate( ["/cloudletOnBoard"], { skipLocationChange: true } );
    }

    public redirectToImage() {
        this.globalServiceObj.cloudletNavigation = true;
        this.router.navigate( ["/cloudlet"], { skipLocationChange: true } );
    }
}
