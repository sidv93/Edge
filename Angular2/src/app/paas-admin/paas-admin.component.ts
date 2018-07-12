import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Configuration } from "../app.constants";
import { GlobalServiceService } from "../global-service.service";
import {SignUp} from "../sign-up/sign-up.model";
import {EdgeListingService} from "./edge-listing.service";
import { EdgePresent, Resources, UsageCharge} from "./edgePresent";
import { SessionTimeout } from "../common-services/session-timeout";

@Component( {
    selector: "app-paas-admin",
    templateUrl: "./paas-admin.component.html",
    providers: [Configuration, EdgeListingService,SessionTimeout],
})

export class PaasAdminComponent implements OnInit {
    public errorMessage: string;
    public initialItems: number;
    public edgePresentFlag = true;
    public sort: any = 0;
    public sortDropdown: string = "Alphabetic";
    public ModalFlag: boolean = false;
    // private operatorsList:string[]=[];
    private allOnboardedEdge: EdgePresent[];
    private userList: SignUp[];
    public loading:boolean = false;

    constructor( private publicConfiguration: Configuration, private router: Router, private globalServiceObj: GlobalServiceService, private edgeListService: EdgeListingService, private sessionTimeout : SessionTimeout ) {
        this.initialItems = publicConfiguration.MinItemFirstLoad;
    }

    public ngOnInit() {
        this.fetchPresentEdge();
    }

    public redirect() {
        this.ModalFlag = true;
        this.router.navigate( ["/edgeOnboard"] , { skipLocationChange: true });
    }

    public fetchPresentEdge() {
        this.loading = true;
        this.edgeListService.getEdgeList().subscribe(
            ( data ) => {
                this.allOnboardedEdge = <EdgePresent[]>data[0];
                this.userList = <SignUp[]>data[1];
                //   this.allOnboardedEdge = <EdgePresent[]>data;
                if ( this.allOnboardedEdge.length == 0 ) {
                    this.edgePresentFlag = false;
                    this.errorMessage = "No records found";
                }
                else {
                    this.edgePresentFlag = true;
                    if ( this.userList.length != 0 ) {
                        for ( let i = 0; i < this.userList.length; i++ ) {
                            if ( this.checkUniqueOperator( this.userList[i].companyName ) && (this.userList[i].companyName != null && this.userList[i].companyName != undefined && this.userList[i].companyName != "")) {
                                console.log("pushing "+ this.userList[i].companyName);
                                this.globalServiceObj.operatorsList.push( this.userList[i].companyName );
                            }
                        }
                    }
                }
                this.loading = false;

            },
            ( error ) => {
            this.sessionTimeout.checkSession(error);
            this.edgePresentFlag = false;
            if ( error.json().message == null || error.json().message == undefined || error.json().message == "" ) {
                this.errorMessage = "Edge data could not be fetched";
            }
            else {
                this.errorMessage = error.json().message;
            }
            this.loading = false;
            }
        );

    }

    public checkUniqueOperator( operator: string ) {
        let flag = true;
        for ( let i = 0; i < this.globalServiceObj.operatorsList.length; i++ ) {
            if ( this.globalServiceObj.operatorsList[i] == operator )
                flag = false;
        }
        return flag;
    }

    public onChangeEvent() {
        this.loading=true;
        this.edgeListService.searchbyOperator( this.sort ).subscribe(( res: EdgePresent[] ) => {
            this.allOnboardedEdge = res;
            if ( this.allOnboardedEdge.length == 0 ) {
                this.edgePresentFlag = false;
                this.errorMessage = "No records found";
            }
            else
                this.edgePresentFlag = true;

                this.loading = false;

        },
            ( error ) => {
            this.sessionTimeout.checkSession(error);
            if ( error.json().message == null || error.json().message == undefined || error.json().message == "" ) {
                this.errorMessage = "Sorted data could not be fetched";
            }
            else {
                this.errorMessage = error.json().message;
            }
            this.loading = false;
            }
        );

    }

    public search( term ) {
        this.loading = true;
        this.edgeListService.search( term ).subscribe(( res: EdgePresent[] ) => {
            this.allOnboardedEdge = res;
            if ( this.allOnboardedEdge.length == 0 ) {
                this.edgePresentFlag = false;
                this.errorMessage = "No records found";
            }
            else
                this.edgePresentFlag = true;

                this.loading = false;
        },
            ( error ) => {
                this.edgePresentFlag = false;
                this.sessionTimeout.checkSession(error);
                if ( error.json().message == null || error.json().message == undefined || error.json().message == "" ) {
                    this.errorMessage = term + " could not be fetched";
                }
                else {
                    this.errorMessage = error.json().message;
                }
                this.loading = false;
            }
        );
    }

    public edgeDetail( edgeNamePassed: string ) {
        this.globalServiceObj.edgeName = edgeNamePassed;
        this.router.navigate( ["/edgedetails"] , { skipLocationChange: true });
    }

}
