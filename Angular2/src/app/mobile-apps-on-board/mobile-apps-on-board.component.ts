import { Component, Input, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import {Configuration} from "../app.constants";
import { Country } from "../common-services/Country";
import {CountryState} from "../common-services/countrystatelist";
import {Api, EndPoints, Events, External, Network,
    Resources, Source, Temp, Workloads} from "../common-services/microServiceMetadata";
import {MicroServiceMetadata} from "../common-services/microServiceMetadata";
import {appMetaData, exposed, ExposedClass, ExposedResources, metaDataMobileApp, MicroSericeTempData, MicroserviceMetadata, Microservices, Name} from "../common-services/mobileAppsMetadata";
import {MobileAppMetadata} from "../common-services/mobileAppsMetadata";
import {SchedulerService} from "../common-services/scheduler.service";
import {GlobalServiceService} from "../global-service.service";
import { User } from "../login/login.model"; // to be deleted
import { LoginService } from "../login/login.service"; // to be deleted
import {MicroServiceComponent} from "../micro-service/micro-service.component";
import {MobileAppDetailsService} from "../mobile-app-details/mobile-app-details.service";
import {MobileAppsService} from "./mobile-apps-service.service";
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';
import { SessionTimeout } from "../common-services/session-timeout";

@Component( {
    selector: "app-mobile-apps-on-board",
    templateUrl: "./mobile-apps-on-board.component.html",
    styleUrls: ["./mobile-apps-on-board.component.css"],
    providers: [LoginService, SchedulerService, MobileAppsService, MobileAppDetailsService,SessionTimeout],
})
export class MobileAppsOnBoardComponent implements OnInit {
    public disableRadio: boolean = false;
    public microServiceArray: Microservices[] = [];
    public disableFieldsOnEdit: boolean = false;
    public useAsLib: string[] = [];
    public mobileOnBrd: MicroServiceMetadata[] = [];
    public editMSFlag: boolean = true;
    public mobileAppMetadata = new MobileAppMetadata();
    public exposedClass: ExposedClass[] = [];
    public image: string = "empty";
    public resourceProfiles = new Array();
    public resourceProfilesForMP: string[][];
    public pages: number;
    public checkboxes = [];
    public count: number = 0;
    public downCheckSelected = [];
    //  stores value of radio button (Event based or API based)
    public chooseCheckBox: string = "event";
    public temp = new Temp();
    public duplicateMobAppName: boolean = false;
    public defaultOption: string = "Select Source Repository";

    // Code for exposed
    public microSericeTempData: MicroSericeTempData[] = [];
    public checkedNetworks: string[] = [];
    public checkedEvents: string[] = [];
    public checkedApis: string[] = [];
    public arrayOfTempEx: MicroSericeTempData[] = [];

    public exposed = new exposed();
    public exposedMicroServiceName: string;
    public exposedResourceProfile: string;
    // Code for exposed ends
    public viewError: boolean;
    public countAPI = this.configuration.countAPI;
    //  Component Detail
    public showPublishScreen: string;
    public source = new Source();
    //  Stores list of networks
    public networks: Network[];
    //  Stores list of events
    public events: Events[];
    //  Stores list of resources
    public resources: Resources[];
    //  Stores API endpoint data
    public endpoints: EndPoints[];
    // Store list of workloads
    public workloads: Workloads[] = [];
    public editWorkLoadFlag: boolean = false;
    public duplicateMSFlag: boolean = false;
    public imageDimensionsFlag: boolean = false;
    public tempWorkLoadName: string;
    public checkboxValue: number;
    public tempMSName: string;
    public duplicateMS: string;
    public serviceName = new Name();
    public tab: number = 1;
    public counter: number = 0;
    public counterForMarketPlaceMS: number = 0;
    //  ToDo - Delete all following variables in future

    public errorMessage: string;
    public counterForEdit: number = 0;
    public user: User; // To be removed
    public loginPostResults = new User; // to be removed
    public networkName: any[];
    public gender: string;
    public selectedCountry: Country = new Country( 1, "Algeria","dz","213" );
    public countries: Country[];
    public enableVisibility: boolean = true;
    public microServiceName: string;
    public networkVal = Object.create( null );
    public networkPortVal = Object.create( null );
    public apiVal = Object.create( null );
    public eventVal = Object.create( null );
    public resourceVal = Object.create( null );
    public workloadVal = Object.create( null );
    public MSVal = Object.create( null );
    public respositoryCheck = false;
    public repositoryVal = Object.create( null );
    public apiNameVal = Object.create( null );
    public apiNameCheck: boolean = false;
    public networkCheck: boolean = false;
    public networkPortCheck: boolean = false;
    public apiCheck: boolean = false;
    public eventCheck: boolean = false;
    public resourceCheck: boolean = false;
    public workloadCheck: boolean = false;
    public MSCheck: boolean = false;
    //visited
    public apiCheckVis : boolean = false;
    public workloadCheckVis : boolean = false;
    public networkPortCheckVis : boolean = false;
    public networkCheckVis : boolean = false;
    public MSCheckVis : boolean = false;
    public eventCheckVis : boolean = false;
    public resourceCheckVis : boolean = false;
    public respositoryCheckVis : boolean = false;
    public apiNameCheckVis : boolean = false;

    public resource1: string;
    public microserviceMetadata: MicroserviceMetadata[] = [];
    public result = new Array();
    public resultMicro: boolean[][];
    public res: boolean = false;
    public resMP: boolean = false;
    public netName: string = "netName";
    public eventName: string = "eventName";
    public apiName: string = "apiName";
    public backOnDisplay3Page = "false";

    public networkCheckbox = "networkCheckbox";
    public eventCheckbox = "eventCheckbox";
    public apiCheckbox = "apiCheckbox";

    public networkSelect = "networkSelect";
    public eventSelect = "eventSelect";
    public apiSelect = "apiSelect";
    public myOptions: IMultiSelectOption[];
    public myTexts: IMultiSelectTexts;
    public mySettings: IMultiSelectSettings;
    public selectedCountries: number[] = [];
    private Microservice_Flag: boolean = false;
    private DetailsOn_Flag: boolean = true;
    private Configuration_Flag: boolean = false;
    private Review_Flag: boolean = false;
    private Finalize_Flag: boolean = false;
    public mandatoryBind : boolean = false;
    public mandatoryPort : boolean = false;
    public timer;
    public iconFlag : boolean = false;
    public clicked : boolean = false;

    // Login to be removed
    constructor( private router: Router,
        private globalservice: GlobalServiceService,
        private schedulerService: SchedulerService,
        private loginService: LoginService,
        private configuration: Configuration,
        private countrystate: CountryState,
        private mobileAppsService: MobileAppsService,
        private mobileAppDetailsService: MobileAppDetailsService, private sessionTimeout : SessionTimeout ) {
        this.networks = [new Network()];
        this.events = [new Events()];
        this.resources = [new Resources()];
        this.endpoints = [new EndPoints()];
        // added for exposed
        this.arrayOfTempEx = [new MicroSericeTempData()];

        this.microSericeTempData = [new MicroSericeTempData()];
        // added for exposed ends
        this.countries = this.countrystate.getCountries();
        this.countries.sort( function ( a, b ) {
            var nameA = a.name.toLowerCase(), nameB = b.name.toLowerCase()
            if ( nameA < nameB ) //sort string ascending
                return -1
            if ( nameA > nameB )
                return 1
            return 0
        });
        this.initial();

    }
    public initial() {
        let network = new Network();
        let workload = new Workloads();
        let event = new Events();
        let resource = new Resources();
        let endpoint = new EndPoints();
        workload.networks.push( network );
        workload.events.push( event );
        workload.resources.push( resource );
        workload.httpApis.endpoints.push( endpoint );
        let microservice = new MicroserviceMetadata();
        microservice.metadata.workloads.push( workload );
        this.microserviceMetadata.push( microservice );

    }

    public ngOnInit() {
        // alert(this.disableFieldsOnEdit + " Value");
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
        this.disableFieldsOnEdit = false;
        this.pages = 1;

        if ( this.globalservice.editMobileApps ) {
            this.editMSDetails();
        } else {
            document.getElementById( "openModalButton" ).click();
        }

    }

    public ngOnDestroy() {
        clearInterval( this.timer );
    }

    public scheduler() {
        if(this.mobileAppMetadata.applicationName=='') {
          this.duplicateMobAppName = false;
        }
    }

    public selectTab( tab: number ) {
        this.tab = tab;
    }

    public displayPage1() {
        this.Microservice_Flag = false;
        this.DetailsOn_Flag = true;
        if ( this.microserviceMetadata.length > 0 ) {
            this.disableRadio = true;
        }

    }

    public displayPage2() {
        this.backOnDisplay3Page = "false";
        this.Configuration_Flag = false;
        this.Microservice_Flag = true;
        this.result = null;
        this.result = new Array();
        this.resultMicro = null;

        this.resourceProfiles = null;
        this.resourceProfiles = new Array();
        this.resourceProfilesForMP = null;
        //  this.resourceProfilesForMP = new Array();
        this.res = false;
        this.resMP = false;
        // this.result=null;
        // this.result=new Array();
        this.checkedNetworks.length = 0;
        this.checkedEvents.length = 0;
        this.checkedApis.length = 0;
        this.arrayOfTempEx.length = 0;
        for ( let i = 0; i < this.microServiceArray.length; i++ ) {
            this.microServiceArray[i].exposed.networks.length = 0;
            this.microServiceArray[i].exposed.events.length = 0;
            this.microServiceArray[i].exposed.httpApis.length = 0;
            this.microServiceArray[i].resources.length = 0;
        }
        console.log("mobile app metadata before=" + JSON.stringify(this.mobileAppMetadata));
        this.mobileAppMetadata.metadata.microserviceMetadata.forEach(( x ) => {
          x.metadata.workloads.forEach((y) =>{
            if(y.networks.length == 0) {
              y.networks[0] = new Network();
            }
          });
        });
        console.log("mobile app metadata after=" + JSON.stringify(this.mobileAppMetadata));
    }

    public displayPage3() {
        this.backOnDisplay3Page = "true";
        this.checkedNetworks.length = 0;
        this.checkedEvents.length = 0;
        this.checkedApis.length = 0;
        this.arrayOfTempEx.length = 0;
        for ( let i = 0; i < this.microServiceArray.length; i++ ) {
            this.microServiceArray[i].exposed.networks.length = 0;
            this.microServiceArray[i].exposed.events.length = 0;
            this.microServiceArray[i].exposed.httpApis.length = 0;
            //this.microServiceArray[i].resources.length = 0;
        }

        if ( this.disableFieldsOnEdit ) {
            this.Review_Flag = false;
            this.DetailsOn_Flag = true;
        } else {
            this.Review_Flag = false;
            this.Configuration_Flag = true;
        }
    }

    public displayPage4() {
        this.Finalize_Flag = false;
        this.Review_Flag = true;
    }

    public nextFinalize() {
        this.Review_Flag = false;
        this.Finalize_Flag = true;
    }

    public OnClose() {
      this.globalservice.editMobileApps=false;
        if ( !this.disableFieldsOnEdit ) {
            this.globalservice.allMyApps = "myApps";
            this.router.navigate( ["/mobileApp"], { skipLocationChange: true } );
        } else {
            this.router.navigate( ["/mobileappdetails"] , { skipLocationChange: true });
            //  this.DetailsOn_Flag = true;
            //  this.Finalize_Flag = false;
            //  this.Review_Flag = false;

        }

    }

    public OnCloseFinal() {
        this.mobileOnBrd = [];
        this.mobileAppMetadata = null;
        this.mobileAppMetadata = new MobileAppMetadata();
        this.microserviceMetadata = [];
        this.DetailsOn_Flag = true;
        this.Microservice_Flag = false;
        this.Configuration_Flag = false;
        this.Review_Flag = false;
        this.Finalize_Flag = false;
        this.globalservice.editMobileApps=false;
        this.initial();

    }

    public enableTextField( value: string ) {
        if ( value == "CIDR" ) {
            ( <HTMLInputElement>document.getElementById( "textSelect" ) ).disabled = false;
            ( <HTMLInputElement>document.getElementById( "textSelect" ) ).style.border = "";
        }
    }

    //  Follwoing function will enable you to check only one checkbox out of Share and Downlaod Checkboxes per div
    public uniquCheck( clicked: number, textStr: string, disableStr: string ) {
        let checkboxClick = textStr + "+" + clicked;
        let checkboxNotClick = disableStr + "+" + clicked;
        //
        if ( textStr == "check" ) {

            if ( ( <HTMLInputElement>document.getElementById( checkboxClick ) ).checked == true ) {
                this.downCheckSelected[clicked] = false;
                this.useAsLib[clicked] = "N";
                if ( ( <HTMLInputElement>document.getElementById( checkboxNotClick ) ) != null ) {
                    ( <HTMLInputElement>document.getElementById( checkboxNotClick ) ).disabled = true;
                }
            }
            else {

                this.useAsLib[clicked] = "null";
                if ( ( <HTMLInputElement>document.getElementById( checkboxNotClick ) ) != null ) {
                    ( <HTMLInputElement>document.getElementById( checkboxNotClick ) ).disabled = false;
                }
            }
        }
        else if ( textStr == "Downcheck" ) {
            if ( ( <HTMLInputElement>document.getElementById( checkboxClick ) ).checked == true ) {
                this.checkboxes[clicked] = false;
                this.useAsLib[clicked] = "Y";
                if ( ( <HTMLInputElement>document.getElementById( checkboxNotClick ) ) != null ) {
                    ( <HTMLInputElement>document.getElementById( checkboxNotClick ) ).disabled = true;
                }
            }
            else {

                this.useAsLib[clicked] = "null";
                if ( ( <HTMLInputElement>document.getElementById( checkboxNotClick ) ) != null ) {
                    ( <HTMLInputElement>document.getElementById( checkboxNotClick ) ).disabled = false;
                }
            }
        }
    }

    public register( chooseCheckBox: string ) {
        this.mobileAppMetadata.metadata.appMetadata.applicationType = chooseCheckBox;
        this.chooseCheckBox = chooseCheckBox;
    }

    public addNetwork( workload: Workloads ) {
        //  create a network object
        //  this.microserviceMetadata.forEach((x) => {
        //    if(x == microservice) {
        //      x.metadata.workloads.forEach((y) => {
        //        if(y==workload) {
        //
        //        }
        //      });
        //    }
        //  });
        let network = new Network();
        workload.networks.push( network );
    }

    public addEvent( workload: Workloads ) {
        let event = new Events();
        workload.events.push( event );
    }
    //Added by riman starts


    public exposedResource( resource, j: number, k: number, microserviceName: string, workloadName: string ) {
        this.result[j][k] = false;

        for ( let i = 0; i < this.microServiceArray.length; i++ ) {
            if ( this.backOnDisplay3Page == "true" ) {
                this.microServiceArray[i].resources.length = 0;
            }
        }
        this.res = false;
        let exposedResources = new ExposedResources();
        exposedResources.name = resource.options[resource.options.selectedIndex].text;
        exposedResources.workloadName = workloadName;
        for ( let i = 0; i < this.microServiceArray.length; i++ ) {
            if ( this.microServiceArray[i].microServiceName == microserviceName ) {
                this.microServiceArray[i].resources.push( exposedResources );
            }
        }
        console.log("in exposed resource");
        console.log("res=" + this.res);
        console.log("resMP=" + this.resMP);
    }

    public exposedResourceForMP( resource, j: number, k: number, microserviceName: string, workloadName: string ) {
        this.resultMicro[j][k] = false;
        this.resourceProfilesForMP[j][k] = resource.options[resource.options.selectedIndex].text;

        for ( let i = 0; i < this.microServiceArray.length; i++ ) {
            if ( this.backOnDisplay3Page == "true" ) {
                this.microServiceArray[i].resources.length = 0;
            }
        }

        this.resMP = false;
        let exposedResources = new ExposedResources();
        exposedResources.name = resource.options[resource.options.selectedIndex].text;
        exposedResources.workloadName = workloadName;
        for ( let i = 0; i < this.microServiceArray.length; i++ ) {
            if ( this.microServiceArray[i].microServiceName == microserviceName ) {
                this.microServiceArray[i].resources.push( exposedResources );
            }
        }
        console.log("in exposed resource for MP");
        console.log("res=" + this.res);
        console.log("resMP=" + this.resMP);
    }

    public exposedNetworkChecked( e, name: string, microserviceName: string, m: number ) {
        if ( e.target.checked ) {
            //  (<HTMLInputElement> document.getElementById("networkSelect"+name+m)).disabled =false;
            this.checkedNetworks.push( name );
        }
        else {
            //    (<HTMLInputElement> document.getElementById("networkSelect"+name+m)).disabled =true;
            for ( let i = 0; i < this.checkedNetworks.length; i++ ) {
                if ( name == this.checkedNetworks[i] ) {
                    this.checkedNetworks.splice( this.checkedNetworks.indexOf( name ), 1 );
                }
            }
        }
    }

    public cidrValue( networkName: string, event ) {
        for ( let i = 0; i < this.arrayOfTempEx.length; i++ ) {
            for ( let j = 0; j < this.arrayOfTempEx[i].arrayOfnetworks.length; j++ ) {
                if ( this.arrayOfTempEx[i].arrayOfnetworks[j].name == networkName ) {
                    this.arrayOfTempEx[i].arrayOfnetworks[j].exposedTo.push( event.value );
                }
            }
        }
    }
    public cidrEventValue( eventName: string, event ) {
        for ( let i = 0; i < this.arrayOfTempEx.length; i++ ) {
            for ( let j = 0; j < this.arrayOfTempEx[i].arrayOfevents.length; j++ ) {
                if ( this.arrayOfTempEx[i].arrayOfevents[j].name == eventName ) {
                    this.arrayOfTempEx[i].arrayOfevents[j].exposedTo.push( event.value );
                }
            }
        }
    }
    public cidrApiValue( apiName: string, event ) {
        for ( let i = 0; i < this.arrayOfTempEx.length; i++ ) {
            for ( let j = 0; j < this.arrayOfTempEx[i].arrayOfhttpApis.length; j++ ) {
                if ( this.arrayOfTempEx[i].arrayOfhttpApis[j].name == apiName ) {
                    this.arrayOfTempEx[i].arrayOfhttpApis[j].exposedTo.push( event.value );
                }
            }
        }
    }
    public exposedNetworkValues( cidrIndex: number, event, name: string, microServiceName: string ) {
        //   (<HTMLInputElement> document.getElementById(name+cidrIndex)).disabled = true;
        var netId = this.netName + microServiceName + name + cidrIndex;
        ( <HTMLInputElement>document.getElementById( netId ) ).classList.add( "hide" );
        ( <HTMLInputElement>document.getElementById( netId ) ).value = "";

        let tempmicroSericeTempData = new MicroSericeTempData();
        tempmicroSericeTempData.microserviceName = microServiceName;
        let exposedTo: string[] = [];
        for ( let i = 0; i < event.selectedOptions.length; i++ ) {
            if ( ( event.selectedOptions[i].text ) == "CIDR" ) {

                ( <HTMLInputElement>document.getElementById( netId ) ).classList.remove( "hide" );
            }

            if ( exposedTo.indexOf( event.selectedOptions[i].text ) == -1 ) {
                if ( ( event.selectedOptions[i].text ) != "CIDR" ) {
                    exposedTo.push( event.selectedOptions[i].text );
                }
            }
        }
        let existingNetworkValueUpadated = false;
        for ( let i = 0; i < this.arrayOfTempEx.length; i++ ) {
            for ( let j = 0; j < this.arrayOfTempEx[i].arrayOfnetworks.length; j++ ) {
                if ( this.arrayOfTempEx[i].arrayOfnetworks[j].name == name ) {
                    this.arrayOfTempEx[i].arrayOfnetworks[j].exposedTo = exposedTo;
                    existingNetworkValueUpadated = true;
                    break;
                }
            }
        }
        if ( existingNetworkValueUpadated == false ) {
            let localtempEx = new ExposedClass();
            localtempEx.name = name;
            localtempEx.exposedTo = exposedTo;
            tempmicroSericeTempData.arrayOfnetworks.push( localtempEx );
            this.arrayOfTempEx.push( tempmicroSericeTempData );
        }
    }

    public exposedEventChecked( e, name: string, microserviceName: string, m: number ) {
        if ( e.target.checked ) {
            //  (<HTMLInputElement> document.getElementById("eventSelect"+name+m)).disabled =false;
            this.checkedEvents.push( name );
        }
        else {
            //    (<HTMLInputElement> document.getElementById("eventSelect"+name+m)).disabled =true;
            for ( let i = 0; i < this.checkedEvents.length; i++ ) {
                if ( name == this.checkedEvents[i] ) {
                    this.checkedEvents.splice( this.checkedEvents.indexOf( name ), 1 );
                }
            }
        }
    }

    public exposedEventValues( cidrIndex: number, event, name: string, microServiceName: string ) {
        var eventId = this.eventName + microServiceName + name + cidrIndex;
        ( <HTMLInputElement>document.getElementById( eventId ) ).classList.add( "hide" );
        ( <HTMLInputElement>document.getElementById( eventId ) ).value = "";
        let tempmicroSericeTempData = new MicroSericeTempData();
        tempmicroSericeTempData.microserviceName = microServiceName;
        let exposedTo: string[] = [];
        for ( let i = 0; i < event.selectedOptions.length; i++ ) {
            if ( ( event.selectedOptions[i].text ) == "CIDR" ) {

                ( <HTMLInputElement>document.getElementById( eventId ) ).classList.remove( "hide" );
            }
            if ( exposedTo.indexOf( event.selectedOptions[i].text ) == -1 ) {
                if ( ( event.selectedOptions[i].text ) != "CIDR" ) {
                    exposedTo.push( event.selectedOptions[i].text );
                }
            }
        }
        let existingEventValueUpadated = false;
        for ( let i = 0; i < this.arrayOfTempEx.length; i++ ) {
            for ( let j = 0; j < this.arrayOfTempEx[i].arrayOfevents.length; j++ ) {
                if ( this.arrayOfTempEx[i].arrayOfevents[j].name == name ) {
                    this.arrayOfTempEx[i].arrayOfevents[j].exposedTo = exposedTo;
                    existingEventValueUpadated = true;
                    break;
                }
            }
        }
        if ( existingEventValueUpadated == false ) {
            let localtempEx = new ExposedClass();
            localtempEx.name = name;
            localtempEx.exposedTo = exposedTo;
            tempmicroSericeTempData.arrayOfevents.push( localtempEx );
            this.arrayOfTempEx.push( tempmicroSericeTempData );
        }
    }

    public exposedApiChecked( e, name: string, microserviceName: string, m: number ) {
        if ( e.target.checked ) {
            //  (<HTMLInputElement> document.getElementById("apiSelect"+name+m)).disabled =false;
            this.checkedApis.push( name );
        }
        else {
            //  (<HTMLInputElement> document.getElementById("apiSelect"+name+m)).disabled =true;
            for ( let i = 0; i < this.checkedApis.length; i++ ) {
                if ( name == this.checkedApis[i] ) {
                    this.checkedApis.splice( this.checkedApis.indexOf( name ), 1 );
                }
            }
        }
    }
    public exposedApiValues( cidrIndex: number, event, name: string, microServiceName: string ) {
        var apiId = this.apiName + microServiceName + name + cidrIndex;
        ( <HTMLInputElement>document.getElementById( apiId ) ).classList.add( "hide" );
        ( <HTMLInputElement>document.getElementById( apiId ) ).value = "";
        let tempmicroSericeTempData = new MicroSericeTempData();
        tempmicroSericeTempData.microserviceName = microServiceName;
        let exposedTo: string[] = [];
        for ( let i = 0; i < event.selectedOptions.length; i++ ) {
            if ( ( event.selectedOptions[i].text ) == "CIDR" ) {
                ( <HTMLInputElement>document.getElementById( apiId ) ).classList.remove( "hide" );
            }
            if ( exposedTo.indexOf( event.selectedOptions[i].text ) == -1 ) {
                if ( ( event.selectedOptions[i].text ) != "CIDR" ) {
                    exposedTo.push( event.selectedOptions[i].text );
                }
            }
        }
        let existingApiValueUpadated = false;
        for ( let i = 0; i < this.arrayOfTempEx.length; i++ ) {
            for ( let j = 0; j < this.arrayOfTempEx[i].arrayOfhttpApis.length; j++ ) {
                if ( this.arrayOfTempEx[i].arrayOfhttpApis[j].name == name ) {
                    this.arrayOfTempEx[i].arrayOfhttpApis[j].exposedTo = exposedTo;
                    existingApiValueUpadated = true;
                    break;
                }
            }
        }
        if ( existingApiValueUpadated == false ) {
            let localtempEx = new ExposedClass();
            localtempEx.name = name;
            localtempEx.exposedTo = exposedTo;
            tempmicroSericeTempData.arrayOfhttpApis.push( localtempEx );
            this.arrayOfTempEx.push( tempmicroSericeTempData );
        }
    }


    public onConfigureNext(type : string, place : string) {
        console.log("in configure next");
        console.log("type=" + type + " place = " + place);
        let i = 0;
        let j = 0;
        this.res = false;
        this.resMP = false;
        this.mobileAppMetadata.metadata.microserviceMetadata.forEach(( x ) => {
            j = 0;

            x.metadata.workloads.forEach(( y ) => {
                if ( this.result[i][j] == undefined || this.result[i][j] == true ) {
                    this.res = true;
                    this.result[i][j] = true;
                }
                console.log("result=" + this.result[i][j]);
                j = j + 1;
            });
            i = i + 1;
        });

        let k = 0;
        let l = 0;
        this.mobileOnBrd.forEach(( x ) => {

            this.mobileAppMetadata.metadata.appMetadata.microservices.forEach(( y ) => {

                if ( x.microServiceName == y.microServiceName ) {
                    l = 0;
                    x.metadata.workloads.forEach(( z ) => {
                        if ( this.resultMicro[k][l] == undefined || this.resultMicro[k][l] == true ) {
                            this.resMP = true;
                            this.resultMicro[k][l] = true;
                        }
                        l = l + 1;
                    });

                }
            });
            k = k + 1;
        });
        for ( let i = 0; i < this.counterForMarketPlaceMS; i++ ) {

            for ( let j = 0; j < this.counterForMarketPlaceMS; j++ ) {

            }
        }

        if ( !this.res && !this.resMP ) {
            for ( let i = 0; i < this.microServiceArray.length; i++ ) {
                for ( let j = 0; j < this.arrayOfTempEx.length; j++ ) {
                    if ( this.microServiceArray[i].microServiceName == this.arrayOfTempEx[j].microserviceName ) {
                        for ( let k = 0; k < this.arrayOfTempEx[j].arrayOfnetworks.length; k++ ) {
                            for ( let l = 0; l < this.checkedNetworks.length; l++ ) {
                                if ( this.checkedNetworks[l] == this.arrayOfTempEx[j].arrayOfnetworks[k].name ) {
                                    console.log("pushing into exposed.networks=" + JSON.stringify(this.arrayOfTempEx[j].arrayOfnetworks[k]));
                                    if(type == 'click' && place == 'next') {
                                      this.microServiceArray[i].exposed.networks.push( this.arrayOfTempEx[j].arrayOfnetworks[k] );
                                    }
                                }
                            }
                        }

                        for ( let k = 0; k < this.arrayOfTempEx[j].arrayOfevents.length; k++ ) {
                            for ( let l = 0; l < this.checkedEvents.length; l++ ) {
                                if ( this.checkedEvents[l] == this.arrayOfTempEx[j].arrayOfevents[k].name ) {
                                    console.log("pushing into exposed.events=" + JSON.stringify(this.arrayOfTempEx[j].arrayOfevents[k]));
                                    if(type == 'click' && place == 'next') {
                                      this.microServiceArray[i].exposed.events.push( this.arrayOfTempEx[j].arrayOfevents[k] );
                                    }
                                }
                            }
                        }
                        for ( let k = 0; k < this.arrayOfTempEx[j].arrayOfhttpApis.length; k++ ) {
                            for ( let l = 0; l < this.checkedApis.length; l++ ) {
                                if ( this.checkedApis[l] == this.arrayOfTempEx[j].arrayOfhttpApis[k].name ) {
                                    console.log("pushing into exposed.httpApis=" + JSON.stringify(this.arrayOfTempEx[j].arrayOfhttpApis[k]));
                                    if(type == 'click' && place == 'next') {
                                      this.microServiceArray[i].exposed.httpApis.push( this.arrayOfTempEx[j].arrayOfhttpApis[k] );
                                    }
                                }
                            }
                        }
                    }
                }
            }
            this.mobileAppMetadata.metadata.appMetadata.microservices = this.microServiceArray;
            // this.pages=3;
            if(type == 'click' && place == 'next') {
              this.Review_Flag = true;
              this.Configuration_Flag = false;
            }
        }
        if(type == 'click' && place == 'popover') {
            this.clicked = true;
        }
        else {
          this.clicked = false;
        }
    }

    // Added by riman ends
    public addProfile( workload: Workloads ) {
        let resource = new Resources();
        workload.resources.push( resource );
    }

    public addAPI( workload: Workloads ) {
        let endpoint = new EndPoints();

        workload.httpApis.endpoints.push( endpoint );
    }

    public addNewParameter() {

        //   document.getElementById("myModal").style.visibility = "visible";
        if ( this.chooseCheckBox == this.configuration.api ) {
            this.globalservice.microServiceSupport = this.configuration.api;
            this.checkboxValue = 2;

        } else if ( this.chooseCheckBox == this.configuration.events ) {
            this.globalservice.microServiceSupport = this.configuration.events;
            this.checkboxValue = 1;
        }
        else if ( this.chooseCheckBox == this.configuration.network ) {
            this.globalservice.microServiceSupport = this.configuration.network;
            this.checkboxValue = 3;
        }
    }

    public addServiceFromMarketPlace() {
        this.mobileOnBrd = [];
        if ( this.disableFieldsOnEdit ) {
            this.Review_Flag = true;
            this.DetailsOn_Flag = false;
            this.mobileAppMetadata.icon=this.image;
        }
        else {
            this.Microservice_Flag = true;
            this.tab = 3;
            this.DetailsOn_Flag = false;
            // EdgeCR changes
               this.mobileAppsService.getAllMicroservices(this.chooseCheckBox,
             this.mobileAppMetadata.metadata.appMetadata.deliveryMethod).subscribe(

                ( res: MicroServiceMetadata[] ) => {
                    this.mobileOnBrd = res;
                },
                ( error ) => {
                if( error.json().code.toLowerCase() === "session-timeout") {
                  alert(this.configuration.timeoutMsg);
                  window.location.reload(false);
                }
                else {
                if ( error.json().message == null || error.json().message == undefined || error.json().message == "" ) {
                    this.errorMessage = "Microservices could not be fetched";
                }
                else {
                    this.errorMessage = error.json().message;
                }
                }

                }
            );
        }

        this.mobileAppMetadata.regions = [];
        for ( let i = 0; i < this.selectedCountries.length; i++ ) {
            for ( let j = 0; j < this.countries.length; j++ ) {
                if ( this.selectedCountries[i] == this.countries[j].id ) {
                    this.mobileAppMetadata.regions.push( this.countries[j].name );
                }
            }
        }
    }

    public imageClick( no: number ) {
        this.checkboxes[no] = !this.checkboxes[no];
    }

    public ValidateMobileAppName() {
        this.duplicateMobAppName = false;
        if ( this.globalservice.editMobileApps != true && this.mobileAppMetadata.applicationName != '') {

            this.mobileAppsService.OnNext( this.mobileAppMetadata.applicationName ).subscribe(( res ) => {
                if ( res.status != "success" ) {
                    this.duplicateMobAppName = true;
                }
                else if(res.status == "success") {
                    this.duplicateMobAppName = false;
                }
            },
                ( error ) => {
                    this.duplicateMobAppName = true;
                    this.sessionTimeout.checkSession(error);
                    if ( error.json().message == null || error.json().message == undefined || error.json().message == "" ) {
                        this.errorMessage = "Mobile App name could not be validated";
                    }
                    else {
                        this.errorMessage = error.json().message;
                    }
                }
            );
            this.timer = setInterval(() => {
                if ( this.mobileAppMetadata.applicationName == '' )
                    this.scheduler();
            }, 500 );
        }


    }

    public OnDoneMarketPlace() {
        let index = 0;
        this.microServiceArray = [];
        for ( let i = 0; i < this.useAsLib.length; i++ ) {
            if ( this.useAsLib[i] == "Y" || this.useAsLib[i] == "N" ) {
                let microService = new Microservices();
                microService.microServiceName = this.mobileOnBrd[i].microServiceName;
                if ( this.useAsLib[i] == "Y" ) {
                    microService.useAsLib = this.useAsLib[i];
                    microService.subscribed = "Y";
                } else if ( this.useAsLib[i] == "N" ) {
                    microService.useAsLib = "N";
                    microService.subscribed = "Y";
                }
                this.microServiceArray[index] = microService;
                index = index + 1;
            }

        }

    }

    public OnErrorCancel() {
        this.duplicateMSFlag = false;
    }

    public creditsDetail( index: number, name: string ) {
        if ( name == "lib" )
            this.useAsLib[index] = "Y";
        else {
            this.useAsLib[index] = "N";
        }
    }

    public Host( host: string ) {

        this.source.sourceRepo = host;
    }

    public OnDone( microservice: MicroserviceMetadata ) {

        let workload = new Workloads();
        let network = new Network();
        if ( this.chooseCheckBox == this.configuration.api ) {
            let endpnt = new EndPoints();
            workload.httpApis.endpoints.push( endpnt );
        } else {
            let event = new Events();
            workload.events.push( event );
        }
        let resource = new Resources();
        workload.networks.push( network );
        // workload.events.push(event);
        workload.resources.push( resource );
        microservice.metadata.workloads.push( workload );
    }
    public lastPage() {
        this.pages = 2;
    }

    public onBackPublish() {
        if ( this.disableFieldsOnEdit ) {
            this.pages = 1;
        } else {
            this.pages = 2;
        }

    }

    public onCancelPublish() {
        if ( this.disableFieldsOnEdit ) {
            this.router.navigate( ["mobileappdetails"] , { skipLocationChange: true });
        } else {
            this.router.navigate( ["mymobileApp"] , { skipLocationChange: true });
        }
    }

    public showPublish() {
        // EdgeCR changes
        console.log("in show publish");
          for(var i = 0; i < this.microserviceMetadata.length; i++) {
              this.microserviceMetadata[i].deliveryMethod=this.mobileAppMetadata.metadata.appMetadata.deliveryMethod;
          }
          for(var i = 0; i < this.microserviceMetadata.length; i++) {
            for(var j = 0; j < this.microserviceMetadata[i].metadata.workloads.length; j++) {
              this.microserviceMetadata[i].metadata.workloads[j].deliveryMethod=this.mobileAppMetadata.metadata.appMetadata.deliveryMethod;
            }
          }
        this.counter = 0;
        this.counterForMarketPlaceMS = 0;
        this.microserviceMetadata.forEach(( x ) => {
            this.validateRepository( x );
        });
        if ( !this.respositoryCheck ) {
            this.mobileAppMetadata.icon = this.image;
            if ( this.chooseCheckBox == this.configuration.events ) {
                this.mobileAppMetadata.metadata.appMetadata.applicationType = this.configuration.events;
                // this.duplicateEvents(); need to add on Final submit
            } else if ( this.chooseCheckBox == this.configuration.api ){
                //   this.duplicateApi(); need to add on Final submit
                this.mobileAppMetadata.metadata.appMetadata.applicationType = this.configuration.api;
            } else if( this.chooseCheckBox == this.configuration.network ) {
              this.mobileAppMetadata.metadata.appMetadata.applicationType = this.configuration.network;
            }
            this.updateExternalObject();
            this.OnDoneMarketPlace();
            this.mobileAppMetadata.metadata.microserviceMetadata = this.microserviceMetadata;
            this.mobileAppMetadata.metadata.appMetadata.microservices = this.microServiceArray;
            this.addOwnMicroserviceToMicroservices();
            this.pages = 2;
            this.mobileAppMetadata.metadata.microserviceMetadata.forEach(( x ) => {
                this.counter = this.counter + x.metadata.workloads.length;

            });


            this.mobileOnBrd.forEach(( y ) => {

                this.counterForMarketPlaceMS = this.counterForMarketPlaceMS + y.metadata.workloads.length;

            });


            for ( var i = 0; i < this.counter; i++ ) {
                var arr = new Array();
                arr.push();

                this.result.push( arr );
                var arr1 = new Array();
                this.resourceProfiles.push( arr1 );
            }

            for( var i = 0; i < this.resourceProfiles.length; i++) {
                for( var j = 0; j < this.resourceProfiles[i].length; j++) {
                    this.resourceProfiles[i][j] = null;
                }
            }

            console.log("resource profiles = " + JSON.stringify(this.resourceProfiles));

            // for(var i = 0; i < this.counterForMarketPlaceMS; i++) {
            //
            //
            // //  this.resultMicro.push(arr4);
            //     var arr2 = new Array();
            //   this.resourceProfilesForMP.push(arr2);
            // }
            this.resultMicro = [];
            this.resourceProfilesForMP = [];
            for ( var i = 0; i < this.counterForMarketPlaceMS; i++ ) {
                this.resultMicro[i] = [];
                this.resourceProfilesForMP[i] = [];
                for ( var j = 0; j < this.counterForMarketPlaceMS; j++ ) {
                    this.resultMicro[i][j] = undefined;
                    this.resourceProfilesForMP[i][j] = undefined;
                }
            }

            this.Microservice_Flag = false;
            this.Configuration_Flag = true;
            console.log("res=" + this.res);
            console.log("resMP=" + this.resMP);
        }

        this.mobileAppMetadata.metadata.microserviceMetadata.forEach(( x ) => {
          x.metadata.workloads.forEach((y) =>{
            for(let i =0 ; i < y.networks.length; i++) {
              if((y.networks[i].name == "" || y.networks[i].name == undefined || y.networks[i].name == null)
              && (y.networks[i].port == "" || y.networks[i].port == undefined || y.networks[i].port == null)) {
                y.networks.splice(i,1);
              }
            }
          });
        });

        console.log("mobOnBrd=" + JSON.stringify(this.mobileOnBrd));
        console.log("Mobile App metadata=" + JSON.stringify(this.mobileAppMetadata));
    }

    public visibility() {
        this.enableVisibility = !this.enableVisibility;
        this.mobileAppMetadata.enable = this.enableVisibility;
    }

    public addOwnMicroserviceToMicroservices() {
        this.microserviceMetadata.forEach(( x ) => {
            let microservice = new Microservices();
            microservice.microServiceName = x.microServiceName;
            microservice.useAsLib = "N";
            microservice.subscribed = "N";
            this.mobileAppMetadata.metadata.appMetadata.microservices.push( microservice );
        });
    }

    public OnComplete() {
        let network = new Network();
        let workload = new Workloads();
        let event = new Events();
        let resource = new Resources();
        workload.networks.push( network );
        workload.events.push( event );
        workload.resources.push( resource );
        let microservice = new MicroserviceMetadata();
        microservice.metadata.workloads.push( workload );
        this.microserviceMetadata.push( microservice );
    }

    //  This function uses the new workload and update the external object in mobileOnBoard.
    //  mobileOnBoard.metadata.external.network.push(<names of external network>)
    //  mobileOnBoard.metadata.external.event.push(<names of external events>)
    public updateExternalObject() {
        let isexternal: boolean = false;
        let isexternalEvent: boolean = false;
        let isexternalApi: boolean = false;
        this.microserviceMetadata.forEach(( x ) => {
            x.metadata.workloads.forEach(( y ) => {
                x.metadata.external.networks = [];
                y.networks.forEach(( net ) => {
                    isexternal = net.external;
                    if ( isexternal == true ) {
                        x.metadata.external.networks.push( net.name );
                    }
                });
            });
        });

        this.microserviceMetadata.forEach(( x ) => {
            x.metadata.workloads.forEach(( y ) => {
                x.metadata.external.events = [];
                y.events.forEach(( evn ) => {
                    isexternalEvent = evn.external;
                    if ( isexternalEvent == true ) {
                        x.metadata.external.events.push( evn.name );
                    }
                });
            });
        });

        this.microserviceMetadata.forEach(( x ) => {
            x.metadata.workloads.forEach(( y ) => {
                x.metadata.external.httpApis = [];
                y.httpApis.endpoints.forEach(( api ) => {
                    isexternalApi = api.external;
                    if ( isexternalApi == true ) {
                        x.metadata.external.httpApis.push( api.name );
                    }
                });
            });
        });
    }

    //  duplicate a given array (deep copy)
    public duplicateEvents() {
        let arr: Events[] = [];
        this.mobileAppMetadata.metadata.microserviceMetadata.forEach(( x ) => {
            x.metadata.workloads.forEach(( y ) => {
                y.events.forEach(( z ) => {
                    z.fn = "fn:" + z.fn;
                });

            });
        });
    }

    //  duplicate a given array (deep copy)
    public duplicateApi() {
        //  var arr: EndPoints[] = [];

        this.mobileAppMetadata.metadata.microserviceMetadata.forEach(( x ) => {
            x.metadata.workloads.forEach(( y ) => {
                y.httpApis.endpoints.forEach(( z ) => {
                    z.name = y.workloadName + "-api-" + this.countAPI;
                    this.countAPI = this.countAPI + 1;
                });
            });
        });
    }

    // Method to convert image into Base64
    public onChange( event: EventTarget ) {
        let img = new Image();
        let file: File;
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

    public modifyMicroService( microServiceName: string ) {
        this.editMSFlag = false;
        this.tempMSName = microServiceName;
        let microserviceMetadata = new MicroserviceMetadata();
        microserviceMetadata.microServiceName = microServiceName;
        this.microserviceMetadata.forEach(( x ) => {
            if ( x.microServiceName == microServiceName ) {
                microserviceMetadata = x;
            }
        });
        this.editMS( microserviceMetadata );
    }

    public editMS( microserviceMetadata: MicroserviceMetadata ) {
        this.counterForEdit = 1;
        this.workloads = microserviceMetadata.metadata.workloads;
        this.serviceName.microServiceName = microserviceMetadata.microServiceName;
    }

    // This function will modify the already created workload
    public modifyWorkLoad( workloadName: string ) {
        this.editMSFlag = true;
        this.editWorkLoadFlag = true;
        let workLoad = new Workloads();
        this.tempWorkLoadName = workloadName;
        this.workloads.forEach(( x ) => {
            if ( x.workloadName == workloadName ) {
                workLoad = x;
            }
        });

        // this.editWorkLoad(workLoad);
    }

    // Validation for network name
    public validate( microservice: MicroserviceMetadata ) {
        let arr: string[] = [];
        this.microserviceMetadata.forEach(( x ) => {
            if ( x == microservice ) {
                x.metadata.workloads.forEach(( y ) => {
                    y.networks.forEach(( z ) => {
                        arr.push( z.name );
                    });
                });
            }
        });
        this.networkCheck = false;
        this.networkCheckVis = true;
        this.networkVal = Object.create( null );
        for ( let i = 0; i < arr.length; ++i ) {
            let value = arr[i];
            if ( value in this.networkVal && value != undefined ) {
                this.networkVal[value] = true;
                this.networkCheck = true;
                // return true;
            } else
                this.networkVal[value] = false;
        }
        // this.networkVal;
        console.log("networkcheck=" + this.networkCheck + " networkCheckvis=" + this.networkCheckVis);
        if(this.chooseCheckBox=='event' || this.chooseCheckBox=='http') {
          this.mandatoryPort = true;
        }
    }

    // validate for Network Port
    public validatePort( microservice: MicroserviceMetadata ) {
        let arr: string[] = [];
        this.networkPortCheck = false;
        this.networkPortCheckVis = true;
        this.microserviceMetadata.forEach(( x ) => {
            if ( x == microservice ) {
                x.metadata.workloads.forEach(( y ) => {

                    y.networks.forEach(( z ) => {
                        arr.push( z.port );
                    });
                });
            }
        });

        this.networkPortVal = Object.create( null );
        for ( let i = 0; i < arr.length; ++i ) {
            let value = arr[i];
            if ( value in this.networkPortVal && value != undefined ) {
                this.networkPortVal[value] = true;
                this.networkPortCheck = true;
                // return true;
            } else
                this.networkPortVal[value] = false;
        }
        console.log("networkPortcheck=" + this.networkPortCheck + " networkPortCheckvis=" + this.networkPortCheckVis);
        if(this.chooseCheckBox=='event' || this.chooseCheckBox=='http') {
          this.mandatoryBind = true;
        }
    }

    // validate for Source Repository Port
    public validateRepository( microservice: MicroserviceMetadata ) {
        let arr: string[] = [];
        this.respositoryCheck = false;
        this.respositoryCheckVis = true;
        this.microserviceMetadata.forEach(( x ) => {
            if ( x == microservice ) {
                x.metadata.workloads.forEach(( y ) => {
                    arr.push( y.source.sourceRepo );
                });
            }
        });

        this.repositoryVal = Object.create( null );
        for ( let i = 0; i < arr.length; ++i ) {
            let value = arr[i];
            if ( value == this.defaultOption ) {
                this.repositoryVal[value] = true;
                this.respositoryCheck = true;
                // return true;
            } else
                this.repositoryVal[value] = false;
        }
        console.log("repositorycheck=" + this.respositoryCheck + " respositoryCheckvis=" + this.respositoryCheckVis);
    }

    // Validate Event Name
    public validateEventName( microservice: MicroserviceMetadata ) {
        let arr: string[] = [];
        this.eventCheck = false;
        this.eventCheckVis = true;
        this.microserviceMetadata.forEach(( x ) => {
            if ( x == microservice ) {
                x.metadata.workloads.forEach(( y ) => {

                    y.events.forEach(( z ) => {
                        arr.push( z.name );
                    });

                });
            }
        });

        this.eventVal = Object.create( null );
        for ( let i = 0; i < arr.length; ++i ) {
            let value = arr[i];
            if ( value in this.eventVal && value != undefined ) {
                this.eventVal[value] = true;
                this.eventCheck = true;
                // return true;
            } else
                this.eventVal[value] = false;
        }
        console.log("eventcheck=" + this.eventCheck + " eventCheckvis=" + this.eventCheckVis);
    }

    // Validate Event Name

    public validateAPI( microservice: MicroserviceMetadata ) {
        let arr: string[] = [];
        this.apiNameCheck = false;
        this.apiNameCheckVis = true;
        this.microserviceMetadata.forEach(( x ) => {
            if ( x == microservice ) {
                x.metadata.workloads.forEach(( y ) => {

                    y.httpApis.endpoints.forEach(( z ) => {
                        arr.push( z.name );
                    });

                });
            }
        });

        this.apiNameVal = Object.create( null );
        for ( let i = 0; i < arr.length; ++i ) {
            let value = arr[i];
            if ( value in this.apiNameVal && value != undefined ) {
                this.apiNameVal[value] = true;
                this.apiNameCheck = true;
                // return true;
            } else
                this.apiNameVal[value] = false;
        }
        console.log("apiNamecheck=" + this.apiNameCheck + " apiNameCheckvis=" + this.apiNameCheckVis);
    }

    public validateMSName() {
        this.MSCheck = false;
        this.MSCheckVis = true;
        let arr: string[] = [];
        this.microserviceMetadata.forEach(( x ) => {
            arr.push( x.microServiceName );
        });
        this.MSVal = Object.create( null );
        for ( let i = 0; i < arr.length; ++i ) {
            let value = arr[i];
            if ( value in this.MSVal && value != undefined ) {
                this.MSVal[value] = true;
                this.MSCheck = true;
                // return true;
            } else
                this.MSVal[value] = false;
        }
        console.log("mscheck=" + this.MSCheck + " msCheckvis=" + this.MSCheckVis);
    }

    // Validation for Resources name
    public validateResName( microservice: MicroserviceMetadata ) {
        let arr: string[] = [];
        this.resourceCheck = false;
        this.resourceCheckVis = true;
        this.microserviceMetadata.forEach(( x ) => {
            if ( x == microservice ) {
                x.metadata.workloads.forEach(( y ) => {

                    y.resources.forEach(( z ) => {
                        arr.push( z.name );
                    });

                });
            }
        });
        this.resourceVal = Object.create( null );
        for ( let i = 0; i < arr.length; ++i ) {
            let value = arr[i];
            if ( value in this.resourceVal && value != undefined ) {
                this.resourceVal[value] = true;
                this.resourceCheck = true;
                // return true;
            } else
                this.resourceVal[value] = false;
        }
        console.log("resourcecheck=" + this.resourceCheck + " resourceCheckvis=" + this.resourceCheckVis);
    }

    // Validation for Context Path
    public validateAPIName( microservice: MicroserviceMetadata ) {
        let arr: string[] = [];
        this.apiCheck = false;
        this.apiCheckVis = true;
        this.microserviceMetadata.forEach(( x ) => {
            if ( x == microservice ) {
                x.metadata.workloads.forEach(( y ) => {
                    y.httpApis.endpoints.forEach(( z ) => {
                        arr.push( z.fn );
                    });

                });
            }
        });
        this.apiVal = Object.create( null );
        for ( let i = 0; i < arr.length; ++i ) {
            let value = arr[i];
            if ( value in this.apiVal && value != undefined ) {
                this.apiVal[value] = true;
                this.apiCheck = true;
                // return true;
            } else
                this.apiVal[value] = false;
        }
        console.log("apicheck=" + this.apiCheck + " apiCheckvis=" + this.apiCheckVis);
    }

    // Validation for Workload Name
    public validateWorkloadName( microservice: MicroserviceMetadata ) {
        let arr: string[] = [];
        this.workloadCheck = false;
        this.workloadCheckVis = true;
        this.microserviceMetadata.forEach(( x ) => {
            if ( x == microservice ) {
                x.metadata.workloads.forEach(( y ) => {
                    arr.push( y.workloadName );
                });

            }
        });
        this.workloadVal = Object.create( null );
        for ( let i = 0; i < arr.length; ++i ) {
            let value = arr[i];
            if ( value in this.workloadVal && value != undefined ) {
                this.workloadVal[value] = true;
                this.workloadCheck = true;
                // return true;
            } else
                this.workloadVal[value] = false;
        }
        console.log("workloadcheck=" + this.workloadCheck + " workloadCheckvis=" + this.workloadCheckVis);
    }

    public updateMS( name: string ) {
        this.mobileAppMetadata.metadata.microserviceMetadata.forEach(( x ) => {
            if ( x.microServiceName == this.tempMSName ) {
                x.microServiceName = name;
            }
        });
    }

    public updateWorkLoad( workLoad: Workloads ) {
        this.workloads.forEach(( x ) => {

            if ( x.workloadName == this.tempWorkLoadName ) {
                x.workloadName = workLoad.workloadName;
                x = workLoad;
            }
        });

    }

    public deleteNetwork( microservice: MicroserviceMetadata, workload: Workloads, network: Network ) {
        let arr: Network[] = [];
        this.microserviceMetadata.forEach(( x ) => {
            if ( x == microservice ) {
                x.metadata.workloads.forEach(( y ) => {
                    if ( y == workload ) {
                        y.networks.forEach(( z ) => {
                            if ( z != network ) {
                                arr.push( Object.assign( {}, z ) );
                            }
                        });
                        y.networks = [];
                        y.networks = arr;
                        this.validate( x );
                        this.validatePort( x );
                    }
                });
            }
        });

    }

    public deleteEvent( microservice: MicroserviceMetadata, workload: Workloads, event: Events ) {
        let arr: Events[] = [];
        this.microserviceMetadata.forEach(( x ) => {
            if ( x == microservice ) {
                x.metadata.workloads.forEach(( y ) => {
                    if ( y == workload ) {
                        y.events.forEach(( z ) => {
                            if ( z != event ) {
                                arr.push( Object.assign( {}, z ) );
                            }
                        });
                        y.events = [];
                        y.events = arr;
                        this.validateEventName( x );
                    }
                });
            }
        });
    }

    public deleteAPI( microservice: MicroserviceMetadata, workload: Workloads, endpnt: EndPoints ) {
        let arr: EndPoints[] = [];

        this.microserviceMetadata.forEach(( x ) => {
            if ( x == microservice ) {
                x.metadata.workloads.forEach(( y ) => {
                    if ( y == workload ) {
                        y.httpApis.endpoints.forEach(( z ) => {
                            if ( z != endpnt ) {
                                arr.push( Object.assign( {}, z ) );

                            }
                        });
                        y.httpApis.endpoints = [];
                        y.httpApis.endpoints = arr;
                        this.validateAPIName( x );
                        this.validateAPI( x );
                    }
                });
            }

        });
    }

    public deleteResource( microservice: MicroserviceMetadata, workload: Workloads, resource: Resources ) {
        let arr: Resources[] = [];
        this.microserviceMetadata.forEach(( x ) => {
            if ( x == microservice ) {
                x.metadata.workloads.forEach(( y ) => {
                    if ( y == workload ) {
                        y.resources.forEach(( z ) => {
                            if ( z != resource ) {
                                arr.push( Object.assign( {}, z ) );
                            }
                        });
                        y.resources = [];
                        y.resources = arr;

                    }
                    this.validateResName( x );
                });

            }
        });
    }

    public deleteWorkload( microservice: MicroserviceMetadata, workload: Workloads ) {
        let arr: Workloads[] = [];
        this.microserviceMetadata.forEach(( x ) => {
            if ( x == microservice ) {
                x.metadata.workloads.forEach(( y ) => {
                    if ( y != workload ) {
                        arr.push( Object.assign( {}, y ) );
                    }
                });
                x.metadata.workloads = [];
                x.metadata.workloads = arr;
                this.validateWorkloadName( x );
                this.validateAPIName( x );
                this.validateResName( x );
                this.validatePort( x );
                this.validate( x );
                this.validateEventName( x );
                this.validateAPI( x );
            }
        });
    }

    public deleteMicroService( microservice: MicroserviceMetadata ) {
        let arr: MicroserviceMetadata[] = [];
        this.microserviceMetadata.forEach(( x ) => {
            if ( x != microservice ) {
                arr.push( Object.assign( {}, x ) );
                this.validateWorkloadName( x );
                this.validateAPIName( x );
                this.validateResName( x );
                this.validatePort( x );
                this.validate( x );
                this.validateEventName( x );
                this.validateAPI( x );
            }
        });

        this.microserviceMetadata = [];
        this.microserviceMetadata = arr;
        this.validateMSName();

        if ( this.microserviceMetadata.length == 0 ) {
            this.microServiceArray = [];
            this.DetailsOn_Flag = true;
            this.Microservice_Flag = false;
            this.initial();
            this.disableRadio = false;
        }
    }

    //   Edit MS details
    public editMSDetails() {

        //  this.globalservice.editMobileApps = false;
        this.disableFieldsOnEdit = true;
        this.mobileAppDetailsService.getMobileAppsEditDetail( this.globalservice.applicationName ).subscribe(
            ( res ) => {
                this.mobileAppMetadata = res;
                this.getCountries();
                this.chooseCheckBox = this.mobileAppMetadata.metadata.appMetadata.applicationType;
                if(this.mobileAppMetadata.icon != null && this.mobileAppMetadata.icon != undefined && this.mobileAppMetadata.icon != "null") {
                  this.mobileAppMetadata.icon = "data:image/png;base64," + this.mobileAppMetadata.icon;
                }
                this.getExternal();
                //  this.image = "data:image/png;base64," + this.mobileAppMetadata.icon;
                // this.countries = this.mobileAppMetadata.regions;
            },
            ( error ) => {
            this.sessionTimeout.checkSession(error);
            if ( error.json().message == null || error.json().message == undefined || error.json().message == "" ) {
                this.errorMessage = "Edit details could not be submitted";
            }
            else {
                this.errorMessage = error.json().message;
            }
            });
        //    }

        return true;
    }

    public getCountries() {
        this.selectedCountries = [];
        for ( let i = 0; i < this.mobileAppMetadata.regions.length; i++ ) {
            for ( let j = 0; j < this.countries.length; j++ ) {
                if ( this.mobileAppMetadata.regions[i] == this.countries[j].name ) {
                    this.selectedCountries.push( this.countries[j].id );
                }
            }
        }
    }

    public getExternal() {
        this.mobileAppMetadata.metadata.microserviceMetadata.forEach(( x ) => {
            x.metadata.workloads.forEach(( y ) => {
                y.networks.forEach(( z ) => {
                    x.metadata.external.networks.forEach(( w ) => {
                        if ( w == z.name ) {
                            z.external = true;
                        }
                    });
                });
            });

        });
        this.mobileAppMetadata.metadata.microserviceMetadata.forEach(( x ) => {
            x.metadata.workloads.forEach(( y ) => {
                y.events.forEach(( z ) => {
                    x.metadata.external.events.forEach(( w ) => {
                        if ( w == z.name ) {
                            z.external = true;
                        }
                    });
                });
            });

        });
        this.mobileAppMetadata.metadata.microserviceMetadata.forEach(( x ) => {
            x.metadata.workloads.forEach(( y ) => {
                y.httpApis.endpoints.forEach(( z ) => {
                    x.metadata.external.httpApis.forEach(( w ) => {
                        if ( w == z.name ) {
                            z.external = true;
                        }
                    });
                });
            });
        });


    }


    public OnSubmit() {
        //  if (!this.disableFieldsOnEdit) {
        //     if (this.mobileAppMetadata.metadata.appMetadata.applicationType == this.configuration.events)
        //         this.duplicateEvents();
        // }
        this.mobileAppMetadata.userId = this.globalservice.userName;
        console.log("company name=" + this.globalservice.companyName);
        this.mobileAppMetadata.owner = this.globalservice.companyName;
        console.log("owner name=" + this.mobileAppMetadata.owner);
        this.mobileAppMetadata.onBoardStatus = "Pending";
        // this.mobileAppsService.OnSubmit(this.mobileAppMetadata);
        console.log("metadata=" + JSON.stringify(this.mobileAppMetadata));
    }

    public confirmedOnboard() {
        let icon: string[] = [];
        if(this.mobileAppMetadata.icon != null && this.mobileAppMetadata.icon != undefined && this.mobileAppMetadata.icon != "null") {
        icon = this.mobileAppMetadata.icon.split( "base64," );
        this.mobileAppMetadata.icon = icon[1];
        }

        //this.mobileAppMetadata.applicationName=this.mobileAppMetadata.applicationName.toLowerCase();
        //this.mobileAppMetadata.metadata.microserviceMetadata.forEach((x) => {
        //x.microServiceName=x.microServiceName.toLowerCase();
        //x.metadata.workloads.forEach((y) => {
        //y.workloadName=y.workloadName.toLowerCase();
        //})
        //});
        this.mobileAppsService.OnSubmit( this.mobileAppMetadata ).subscribe(( res ) => {
            this.globalservice.allMyApps = "myApps";
            this.globalservice.editMobileApps = false;

            this.viewError = false;
            this.disableFieldsOnEdit = false;
            // this.router.navigate(['/mobileApp']);
        },
            ( error ) => {
                this.viewError = true;
                this.sessionTimeout.checkSession(error);
                if ( error.json().message == null || error.json().message == undefined || error.json().message == "" ) {
                    this.errorMessage = "Details could not be submitted";
                }
                else {
                    this.errorMessage = error.json().message;
                }
                this.globalservice.allMyApps = "myApps";
                this.disableFieldsOnEdit = false;
                this.globalservice.editMobileApps = false;
                //this.OnCloseFinal();
                //   this.router.navigate(['/mobileApp']);
            },
        );
    }

    public navigate() {
        this.OnCloseFinal();
        this.router.navigate( ["/mobileApp"] , { skipLocationChange: true });
    }
}
