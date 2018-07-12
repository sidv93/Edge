import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Configuration } from "../app.constants";
import {GlobalServiceService} from "../global-service.service";
import { EdgePresent, Resources, UsageCharge} from "../paas-admin/edgePresent";
import {EdgeDetailServiceService} from "./edge-detail-service.service";
import { SessionTimeout } from "../common-services/session-timeout";

@Component( {
    selector: "app-edge-details",
    templateUrl: "./edge-details.component.html",
    styleUrls: ["./edge-details.component.css"],
    providers: [Configuration, EdgeDetailServiceService,SessionTimeout],
})
export class EdgeDetailsComponent implements OnInit {
    public deletePopup = false;
    public deleteFailed = false;
    private edgeName: string;
    private detailsError: boolean = false;
    private selectedEdgeDetails: EdgePresent;
    private selectedEdgeDetailsBkp: EdgePresent;
    private deleteResult: EdgePresent;
    private errorMessage: string;
    private ModalFlag: boolean = false;
    public loading:boolean = false;
    constructor( private publicConfiguration: Configuration,
	private router: Router, private globalServiceObj: GlobalServiceService,
	private edgeDetailService: EdgeDetailServiceService, private sessionTimeout : SessionTimeout ) {
        this.edgeName = globalServiceObj.edgeName;
        this.selectedEdgeDetails = new EdgePresent();
        this.selectedEdgeDetailsBkp = new EdgePresent();
        this.deleteResult = new EdgePresent();
    }

    public ngOnInit() {
        this.fetchEdgeDetails();
    }

    public fetchEdgeDetails() {
        this.edgeDetailService.getEdgeDetail( this.edgeName ).subscribe(
            data => {
                this.selectedEdgeDetails = <EdgePresent>data;
                this.selectedEdgeDetailsBkp = Object.assign( new EdgePresent(), this.selectedEdgeDetails );
                this.detailsError = false;
            },
            ( error ) => {
                this.sessionTimeout.checkSession(error);
                this.detailsError = true;
                if ( error.json().message == null || error.json().message == undefined || error.json().message == "" ) {
                    this.errorMessage = "Edge details could not be fetched";
                }
                else {
                    this.errorMessage = error.json().message;
                }
            }
        );
    }

    public deleteDetails() {
        this.deletePopup = false;
        this.edgeDetailService.submitDeleteData().subscribe(( res ) => {
            this.deleteResult = res;
            if ( res.status.toLocaleLowerCase() == "success" ) {
                this.errorMessage = undefined;
                this.deletePopup = true;
                this.deleteFailed = false;
            }
        },
            ( error ) => {
                this.deletePopup = true;
                this.deleteFailed = true;
                this.sessionTimeout.checkSession(error);
                if ( error.json().message == null || error.json().message == undefined || error.json().message == "" ) {
                    this.errorMessage = "Delete request could not be submitted";
                }
                else {
                    this.errorMessage = error.json().message;
                }
            }
        );
    }

    public pageRedirect() {
        this.router.navigate( ["/paasadmin"], { skipLocationChange: true } );
    }

    public redirect() {
        this.ModalFlag = true;
        this.router.navigate( ["/edgeOnboard"] , { skipLocationChange: true });
    }
}
