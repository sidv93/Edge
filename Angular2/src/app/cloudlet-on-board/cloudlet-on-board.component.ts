import { Component, OnInit } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import {CloudLetOnBoard} from "../common-services/cloudLetOnBoard";
import { Country } from "../common-services/Country";
import {CountryState} from "../common-services/countrystatelist";
import {EdgeOnboardService} from "../edge-onboard/edge-onboard.service";
import {GlobalServiceService} from "../global-service.service";
import {EdgePresent} from "../paas-admin/edgePresent";
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';
import { Configuration } from '../app.constants';
import { SessionTimeout } from "../common-services/session-timeout";

@Component( {
    selector: "app-cloudlet-on-board",
    templateUrl: "./cloudlet-on-board.component.html",
    styleUrls: ["./cloudlet-on-board.component.css"],
    providers: [EdgeOnboardService,SessionTimeout],
})
export class CloudletOnBoardComponent implements OnInit {
    public cloudletMetaData: CloudLetOnBoard;
    public errorMessage: string;
    public operatorList: string[];
    public edgeList: EdgePresent[] = [];
    public edgeNameList: string[] = [];
    public DetailsOn_Flag: boolean = true;
    public Finalize_Flag: boolean = false;
    public disableFieldsOnEdit: boolean = false;
    public duplicateCloudletName: boolean = false;
    public imageDimensionsFlag: boolean = false;
    public cloudletSubmit: boolean = true;
    public invalidTemp: boolean = false;
    public testConnectionSuccess: string="not clicked";
    public publishFlag: boolean = true;
    public countries: Country[];
    public vmi: boolean = false;
    public viewError: boolean = false;
    public computeCharges: boolean;
    public storageCharges: boolean;
    public resourceCharges: boolean;
    public myOptions: IMultiSelectOption[];
    public mySettings: IMultiSelectSettings;
    public myTexts: IMultiSelectTexts;
    public selectedCountries: number[] = [];
    public timer;
    public formatFlag : boolean = false;
    public policyFlag : boolean = false;
    public iconFlag : boolean = false;

    constructor( private router: Router, private countrystate: CountryState,
        private edgeOnboardService: EdgeOnboardService, private globalService: GlobalServiceService,private configuration : Configuration , private sessionTimeout : SessionTimeout) {
        this.countries = this.countrystate.getCountries();
        this.cloudletMetaData = new CloudLetOnBoard();
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
        document.getElementById( "openModalButton" ).click();
        this.cloudletMetaData.operator=null;
        this.cloudletMetaData.edgeName=null;
        this.mySettings = {
            pullRight: false,
            enableSearch: true,
            checkedStyle: 'fontawesome',
            buttonClasses: 'text-grey form-control countries',
            selectionLimit: 0,
            closeOnSelect: false,
            autoUnselect: false,
            showCheckAll: true,
            showUncheckAll: true,
            dynamicTitleMaxItems: 3,
            maxHeight: '300px',
        };
        this.myTexts = {
            checkAll: 'Check all',
            uncheckAll: 'Uncheck all',
            checked: 'checked',
            checkedPlural: 'checked',
            searchPlaceholder: 'Search...',
            defaultTitle: 'Select country',
            allSelected: 'All selected',
        };
        this.getOperatorList();
        //   this.DetailsOn_Flag = true;
    }

    public ngOnDestroy() {
        clearInterval( this.timer );
    }

    public scheduler() {
        if(this.cloudletMetaData.cloudletName=='') {
          this.duplicateCloudletName = false;
        }
    }

    public getOperatorList() {
        this.edgeOnboardService.getOperatorList().subscribe(
            ( data ) => {
                this.operatorList = data;
            },
            ( error ) => {
            this.sessionTimeout.checkSession(error);
            if ( error.json().message == null || error.json().message == undefined || error.json().message == "" ) {
                this.errorMessage = "Operator List could not be fetched";
            }
            else {
                this.errorMessage = error.json().message;
            }
            });
    }

    public getEdgeList() {
        this.edgeOnboardService.getEdgeListForOperator( this.cloudletMetaData.operator ).subscribe(
            ( data ) => {
                this.edgeList = data;
                for ( let i = 0; i < this.edgeList.length; i++ ) {
                    this.edgeNameList.push( this.edgeList[i].edgeName );
                }
                // this.edgeNameList=["edgename1","edgeName2"];
            },
            ( error ) => {
            this.sessionTimeout.checkSession(error);
            if ( error.json().message == null || error.json().message == undefined || error.json().message == "" ) {
                this.errorMessage = "Edge list could not be fetched";
            }
            else {
                this.errorMessage = error.json().message;
            }
            });
    }

    public testConnection() {
        this.edgeOnboardService.testConnection( this.cloudletMetaData.edgeName ).subscribe(
            ( data ) => {
                if ( data.status.toLocaleLowerCase() == "success" ) {
                    this.testConnectionSuccess = "success";
                    this.invalidTemp = false;
                }
            },
            ( error ) => {
                this.testConnectionSuccess = "failure";
                this.sessionTimeout.checkSession(error);
                if ( error.json().message == null || error.json().message == undefined || error.json().message == "" ) {
                    this.errorMessage = "Connection could not be tested";
                }
                else {
                    this.errorMessage = error.json().message;
                }
            }
        );
    }

    public OnNext() {

        for ( let i = 0; i < this.selectedCountries.length; i++ ) {
            for ( let j = 0; j < this.countries.length; j++ ) {
                if ( this.selectedCountries[i] == this.countries[j].id ) {
                    this.cloudletMetaData.regions.lowLatency.push( this.countries[j].name );
                    this.cloudletMetaData.regions.all.push( this.countries[j].name );
                }
            }
        }

        if ( this.cloudletMetaData.heatTemplateName == undefined || this.cloudletMetaData.heatTemplateName == "" ) {
            this.invalidTemp = true;
        } else {

            this.invalidTemp = false;
            this.DetailsOn_Flag = false;
            this.Finalize_Flag = true;
        }
    }

    public vmiEnable() {
        this.vmi = !this.vmi;
        if ( this.vmi ) {
            this.cloudletMetaData.vmiEnabled = "Y";
        } else {
            this.cloudletMetaData.vmiEnabled = "N";
        }
    }

    public OnBack() {
        this.DetailsOn_Flag = true;
        this.Finalize_Flag = false;
    }

    // Method to convert image into Base64
    public onChangePolicy( event: EventTarget ) {
        let file: File;
        let eventObj: MSInputMethodContext = <MSInputMethodContext>event;
        let target: HTMLInputElement = <HTMLInputElement>eventObj.target;
        let files: FileList = target.files;
        file = files[0];
        let fileName: string = "";
        let extn: string = "";
        fileName = file.name;
        extn = fileName.substr( fileName.lastIndexOf( '.' ) + 1 );
        if ( this.configuration.cloudletFiles.indexOf( extn ) === -1 ) {
            console.log( "format not valid" );
            this.policyFlag = true;
        }
        else {
            this.policyFlag = false;
        }
        this.cloudletMetaData.policyFileName = file.name;
        let myReader: FileReader = new FileReader();

        myReader.onloadend = ( e ) => {
            this.cloudletMetaData.policyFile = myReader.result;

        };
        myReader.readAsDataURL( file );
        myReader.onerror = function ( error ) {
        };

    }

    // Method to convert image into Base64
    public onChangeTemplate( event: EventTarget ) {
        let file: File;
        let eventObj: MSInputMethodContext = <MSInputMethodContext>event;
        let target: HTMLInputElement = <HTMLInputElement>eventObj.target;
        let files: FileList = target.files;
        file = files[0];
        let fileName: string = "";
        let extn: string = "";
        fileName = file.name;
        extn = fileName.substr( fileName.lastIndexOf( '.' ) + 1 );
        if ( this.configuration.cloudletFiles.indexOf( extn ) === -1 ) {
            console.log( "format not valid" );
            this.formatFlag = true;
        }
        else {
            this.formatFlag = false;
        }
        this.cloudletMetaData.heatTemplateName = file.name;
        let myReader: FileReader = new FileReader();

        myReader.onloadend = ( e ) => {
            this.cloudletMetaData.heatTemplate = myReader.result;
        };
        myReader.readAsDataURL( file );
        myReader.onerror = function ( error ) {
        };

        if ( this.cloudletMetaData.heatTemplateName == undefined || this.cloudletMetaData.heatTemplateName == "" ) {
            this.invalidTemp = true;
        } else {
            this.invalidTemp = false;
        }
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
            this.cloudletMetaData.icon = myReader.result;
            img.src = this.cloudletMetaData.icon;
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

    public validateCloudletName() {
        this.duplicateCloudletName = false;
        console.log("in validate");
        if(this.cloudletMetaData.cloudletName != "") {
          this.edgeOnboardService.validateCloudletName( this.cloudletMetaData.cloudletName ).subscribe(( res ) => {
              console.log("in success");
              if ( res.status != "success" ) {
                  this.duplicateCloudletName = true;
              }
              else if( res.status == "success") {
                  this.duplicateCloudletName = false;
              }
              console.log("flag = " +this.duplicateCloudletName);
          },
              ( error ) => {
                  this.duplicateCloudletName = true;
                  console.log("in error= " + error);
                  console.log("flag = " +this.duplicateCloudletName);
                  this.sessionTimeout.checkSession(error);
                  if ( error.json().message == null || error.json().message == undefined || error.json().message == "" ) {
                      this.errorMessage = "Cloud name could not be validated";
                  }
                  else {
                      this.errorMessage = error.json().message;
                  }
              });
        }

            this.timer = setInterval(() => {
                if ( this.cloudletMetaData.cloudletName == '' )
                    this.scheduler();
            }, 500 );
    }

    public onSubmit() {
        let icon: string[] = [];
        let policyFile: string[] = [];
        let heatTemplate: string[] = [];
        if ( this.cloudletMetaData.icon != null ) {
            icon = this.cloudletMetaData.icon.split( "base64," );
            this.cloudletMetaData.icon = icon[1];
        }
        if ( this.cloudletMetaData.policyFile != null ) {
            policyFile = this.cloudletMetaData.policyFile.split( "base64," );
            this.cloudletMetaData.policyFile = policyFile[1];
        }
        if ( this.cloudletMetaData.heatTemplate != null ) {
            heatTemplate = this.cloudletMetaData.heatTemplate.split( "base64," );
            this.cloudletMetaData.heatTemplate = heatTemplate[1];
        }
        this.edgeOnboardService.submitCloudlet( this.cloudletMetaData ).subscribe(
            ( data ) => {
                this.cloudletSubmit = true;
                this.publishFlag = true;
            },
            ( error ) => {
                this.viewError = true;
                this.cloudletSubmit = false;
                this.publishFlag = false;
                this.sessionTimeout.checkSession(error);
                if ( error.json().message == null || error.json().message == undefined || error.json().message == "" ) {
                    this.errorMessage = "Details data could not be submitted";
                }
                else {
                    this.errorMessage = error.json().message;
                }
            }
        );
    }

    public OnCloseCloudletOnboard() {
        this.edgeList = null;
        this.cloudletMetaData = new CloudLetOnBoard();
        this.globalService.cloudletsFlag = 1;
        this.DetailsOn_Flag = true;
        this.Finalize_Flag = false;
        this.router.navigate( ["/cloudlet"], { skipLocationChange: true } );
    }

    public checkNumber( field: string ) {
        let number;
        if ( field == "computeCharge" ) {
            number = Number( this.cloudletMetaData.usageCharges.computeCharge );
            if ( isNaN( number ) == true )
                this.computeCharges = true;
            else
                this.computeCharges = false;
        }
        else if ( field == "storageCharge" ) {
            number = Number( this.cloudletMetaData.usageCharges.storageCharge );
            if ( isNaN( number ) == true )
                this.storageCharges = true;
            else
                this.storageCharges = false;
        }
        else if ( field == "resourceCharge" ) {
            number = Number( this.cloudletMetaData.usageCharges.resourceCharge );
            if ( isNaN( number ) == true )
                this.resourceCharges = true;
            else
                this.resourceCharges = false;
        }
    }

}
