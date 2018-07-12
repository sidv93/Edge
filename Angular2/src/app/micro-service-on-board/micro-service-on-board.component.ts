import { Component, Input, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { ModalComponent } from "ng2-bs3-modal/ng2-bs3-modal";
import {Configuration} from "../app.constants";
import { Country } from "../common-services/Country";
import {CountryState} from "../common-services/countrystatelist";
import {Workloads} from "../common-services/microServiceMetadata";
import {MicroServiceMetadata} from "../common-services/microServiceMetadata";
import {Network, Temp} from "../common-services/microServiceMetadata";
import {Resources} from "../common-services/microServiceMetadata";
import {EndPoints} from "../common-services/microServiceMetadata";
import {Events} from "../common-services/microServiceMetadata";
import {Source} from "../common-services/microServiceMetadata";
import {SchedulerService} from "../common-services/scheduler.service";
import {GlobalServiceService} from "../global-service.service";
import { User } from "../login/login.model"; // to be deleted
import { LoginService } from "../login/login.service"; // to be deleted
import {MicroServiceDetailsService} from "../micro-service-details/micro-service-details.service";
import {MicroServiceComponent} from "../micro-service/micro-service.component";
import {MicroServiceOnboardService} from "./micro-service-onboard.service";
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';
import { SessionTimeout } from "../common-services/session-timeout";

@Component({
    selector: "app-micro-service-on-board",
    templateUrl: "./micro-service-on-board.component.html",
    styleUrls: ["./micro-service-on-board.component.css"],
    providers: [LoginService, SchedulerService,SessionTimeout], // Login service to be removed
})

export class MicroServiceOnBoardComponent implements OnInit {
    //  value represents the page to be opened

    public modalClose: boolean = true;
    public deleteNetworkCounter: number = 1;
    public image: string = this.configuration.empty;
    public value: number;
    public tempWorkLoadName: string;
    public countAPI: number = this.configuration.countAPI;
    //  stores value of radio button (Event based or API based)
    public chooseCheckBox: string = this.configuration.events;
    public temp = new Temp();
    //  Component Details
    public componentName: string;
    public showPublishScreen: string;
    public source = new Source();
    //  Stores list of networks
    public networks: Network[];
    //  Stores list of events
    public events: Events[];
    //  Stores list of resources
    public resources: Resources[];
    //  Stores list of workloads
    public workloads: Workloads[] = [];
    //  Stores API endpoint data
    public endpoints: EndPoints[];
    public count: number = 0;
    public microserviceMetaData = new MicroServiceMetadata();
    public checkboxValue: number;
    public editWorkLoadFlag: boolean = false;
    public duplicateMSName: boolean = false;
    public imageDimensionsFlag: boolean = false;
    //  ToDo - Delete all following variables in future
    public network: number;
    public event: number;
    public profile: number;
    public api: number;
    public networkCounter: number = 0;
    public eventCounter: number = 0;
    public profileCounter: number = 0;
    public apiCounter: number = 0;
    public errorMessage: string;
    public clearTimer;
    public editMicroService: boolean = false;
    public disableFieldsOnEdit: boolean = false;
    public user: User; // To be removed
    public loginPostResults = new User; // to be removed
    public networkName: any[];
    public gender: string;
    public selectedCountry: Country = new Country( 1, "Algeria","dz","213" );
    public countries: Country[];
    public library: boolean = false;
    public enableVisibility: boolean = true;
    public disabledForm: boolean = false;
    public disableRadio: boolean = false;
    public DetailsOn_Flag: boolean = true;
    public Review_Flag: boolean = false;
    public Microservice_Flag: boolean = false;
    public Finalize_Flag: boolean = false;
    public networkVal = Object.create(null);
    public networkPortVal = Object.create(null);
    public apiVal = Object.create(null);
    public eventVal = Object.create(null);
    public resourceVal = Object.create(null);
    public workloadVal = Object.create(null);
    public respositoryCheck = false;
    public repositoryVal = Object.create(null);
    public apiNameVal = Object.create(null);
    public apiNameCheck: boolean = false;
    public networkCheck: boolean = false;
    public networkPortCheck: boolean = false;
    public apiCheck: boolean = false;
    public eventCheck: boolean = false;
    public resourceCheck: boolean = false;
    public workloadCheck: boolean = false;
    public viewError: boolean;
    public creditNaN: boolean = false;
    public creditPerApiCallNaN = false;

    public defaultOption: string = "Select Source Repository";
    public myOptions: IMultiSelectOption[];
    public mySettings: IMultiSelectSettings;
    public myTexts: IMultiSelectTexts;
    public selectedCountries: number[] = [];
    public mandatoryBind : boolean = false;
    public mandatoryPro : boolean = false;
    public mandatoryPort : boolean = false;
    public timer;
    public iconFlag : boolean = false;
    // workloads: Workloads[]=[];
    // Login to be removed

    constructor(private router: Router,
        private microServiceOnboardService: MicroServiceOnboardService,
        private globalservice: GlobalServiceService, private schedulerService: SchedulerService,
        private loginService: LoginService, private countrystate: CountryState,
        private configuration: Configuration,
        private microServiceDetailsService: MicroServiceDetailsService, private sessionTimeout : SessionTimeout) {
        this.networks = [new Network()];
        this.events = [new Events()];
        this.resources = [new Resources()];
        this.endpoints = [new EndPoints()];
        // this.endpoints[0].name=(this.temp.workloadName+"1"+ "_API");
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
        //   (<HTMLInputElement> document.getElementById("compName1")).disabled = true;
    }
    // user initialization to be removed

    public initial() {
        let network = new Network();
        let workload = new Workloads();
        let event = new Events();
        let resource = new Resources();
        let endpoint = new EndPoints();
        workload.networks.push(network);
        workload.events.push(event);
        workload.resources.push(resource);
        workload.httpApis.endpoints.push(endpoint);
        this.microserviceMetaData.metadata.workloads.push(workload);
        // this.microserviceMetaData.metadata.workloads.push(workload);
        //   this.microserviceMetaData.push(microservice);
    }

    //  callEdit()
    //  {
    //  	if(this.globalservice.editMicroService==true){
    //      this.editMicroService=true;
    //      this.microServiceDetailsService.getMicroServiceServiceEditDetail(this.globalservice.microServiceName).subscribe(
    //         res => {
    //              this.microserviceMetaData=res;
    //              this.componentName=this.microserviceMetaData.metadata.workloads[0].workloadName;
    //              this.microserviceMetaData.metadata.workloads=this.microserviceMetaData.metadata.workloads;
    //              // this.microserviceMetaData.category=res.category;
    //          });
    //    }
    //  }
    public ngOnInit() {
        this.value = 1;

        this.disableFieldsOnEdit = false;

        if (this.globalservice.editMicroService) {
            this.editMSDetails();
        } else {
            document.getElementById("openModalButton").click();
        }

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
        // this.callEdit();

    }

    public ngOnDestroy() {
        clearInterval( this.timer );
    }

    public scheduler() {
        if(this.microserviceMetaData.microServiceName=='') {
          this.duplicateMSName = false;
        }
    }

    //   Edit MS details
    public editMSDetails() {

        // this.globalservice.editMicroService = false;
        this.disableFieldsOnEdit = true;
        this.microServiceDetailsService.getServiceDetail(this.globalservice.microServiceName).subscribe(
            (res) => {
                this.microserviceMetaData = res;
                this.getCountries();
                this.chooseCheckBox = this.microserviceMetaData.microServiceType;

                if(this.microserviceMetaData.icon != null && this.microserviceMetaData.icon != undefined && this.microserviceMetaData.icon != "null") {
                  this.microserviceMetaData.icon = "data:image/png;base64," + this.microserviceMetaData.icon;
                }
                this.getExternal();
                //  this.image = "data:image/png;base64," + this.mobileAppMetadata.icon;
                // this.countries = this.mobileAppMetadata.regions;
            },
            (error) => {
            this.sessionTimeout.checkSession(error);
            if (error.json().message == null || error.json().message == undefined || error.json().message == "") {
                this.errorMessage = "Edit request could not be submitted";
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
        for (let i = 0; i < this.microserviceMetaData.regions.length; i++) {
            for (let j = 0; j < this.countries.length; j++) {
                if (this.microserviceMetaData.regions[i] == this.countries[j].name) {
                    this.selectedCountries.push(this.countries[j].id);
                }
            }
        }
    }

    public getExternal() {
        this.microserviceMetaData.metadata.workloads.forEach((x) => {
            x.networks.forEach((y) => {
                this.microserviceMetaData.metadata.external.networks.forEach((z) => {
                    if (z == y.name) {
                        y.external = true;
                    }
                });
            });
            x.events.forEach((y) => {
                this.microserviceMetaData.metadata.external.events.forEach((z) => {
                    if (z == y.name) {
                        y.external = true;
                    }
                });
            });

            x.httpApis.endpoints.forEach((y) => {
                this.microserviceMetaData.metadata.external.httpApis.forEach((z) => {
                    if (z == y.name) {
                        y.external = true;
                    }
                });
            });

        });
    }

    public ValidateMicroserviceName() {
        this.duplicateMSName = false;
        if (this.globalservice.editMicroService != true && this.microserviceMetaData.microServiceName != '') {

            this.microServiceOnboardService.OnNext(this.microserviceMetaData.microServiceName).subscribe((res) => {
                if (res.status != "success") {
                    this.duplicateMSName = true;
                    //   this.router.navigate['/onboard'];
                }
                else if(res.status == "success") {
                  this.duplicateMSName = false;
                }
            },
                (error) => {
                    this.duplicateMSName = true;
                    this.sessionTimeout.checkSession(error);
                    if (error.json().message == null || error.json().message == undefined ||
					error.json().message == "") {
                        this.errorMessage = "Microservice name could not be validated";
                    }
                    else {
                        this.errorMessage = error.json().message;
                    }
                }
            );

            this.timer = setInterval(() => {
                if ( this.microserviceMetaData.microServiceName == '' )
                    this.scheduler();
            }, 500 );
        }
    }

    // validate for Source Repository Port
    public validateRepository() {
        let arr: string[] = [];
        this.respositoryCheck = false;
        this.microserviceMetaData.metadata.workloads.forEach((y) => {
            arr.push(y.source.sourceRepo);
        });

        this.repositoryVal = Object.create(null);
        for (let i = 0; i < arr.length; ++i) {
            let value = arr[i];
            if (value == this.defaultOption) {
                this.repositoryVal[value] = true;
                this.respositoryCheck = true;
                // return true;
            } else
                this.repositoryVal[value] = false;
        }
    }

    public downloadLibrary() {
        //  this.library = !this.library;
        this.microserviceMetaData.downloadable = !this.microserviceMetaData.downloadable;
        if (!this.microserviceMetaData.downloadable) {
            this.microserviceMetaData.downloadURL = "";
            this.microserviceMetaData.creditsForDownload = "";
        }
    }

    public visibility() {
        this.enableVisibility = !this.enableVisibility;
        this.microserviceMetaData.enable = this.enableVisibility;

    }

    public OnNext() {
        if (this.disableFieldsOnEdit) {
            this.Review_Flag = true;
            this.DetailsOn_Flag = false;
            this.microserviceMetaData.icon=this.image;
        }
        else {

            this.Microservice_Flag = true;

            this.DetailsOn_Flag = false;
        }

        this.microserviceMetaData.regions = [];
        for (let i = 0; i < this.selectedCountries.length; i++) {
            for (let j = 0; j < this.countries.length; j++) {
                if (this.selectedCountries[i] == this.countries[j].id) {
                    this.microserviceMetaData.regions.push(this.countries[j].name);
                }
            }
        }

    }
    public register(chooseCheckBox: string) {
        this.microserviceMetaData.microServiceType = chooseCheckBox;
        this.chooseCheckBox = chooseCheckBox;
    }

    public validate() {
        let arr: string[] = [];
        this.microserviceMetaData.metadata.workloads.forEach((x) => {
            x.networks.forEach((z) => {
                arr.push(z.name);
            });
        });
        this.networkCheck = false;
        this.networkVal = Object.create(null);
        for (let i = 0; i < arr.length; ++i) {
            let value = arr[i];
            if (value in this.networkVal && value != undefined) {
                this.networkVal[value] = true;
                this.networkCheck = true;
                // return true;
            } else
                this.networkVal[value] = false;
        }
        // this.networkVal;
        if(this.chooseCheckBox=='event' || this.chooseCheckBox=='http') {
          this.mandatoryPro = true;
          this.mandatoryPort = true;
        }

    }

    // validate for Network Port
    public validatePort() {
        let arr: string[] = [];
        this.networkPortCheck = false;

        this.microserviceMetaData.metadata.workloads.forEach((y) => {

            y.networks.forEach((z) => {
                arr.push(z.port);
            });
        });

        this.networkPortVal = Object.create(null);
        for (let i = 0; i < arr.length; ++i) {
            let value = arr[i];
            if (value in this.networkPortVal && value != undefined) {
                this.networkPortVal[value] = true;
                this.networkPortCheck = true;
                // return true;
            } else
                this.networkPortVal[value] = false;
        }
        if(this.chooseCheckBox=='event' || this.chooseCheckBox=='http') {
          this.mandatoryBind = true;
          this.mandatoryPro = true;
        }
    }

    // Validate Event Name
    public validateEventName() {
        let arr: string[] = [];
        this.eventCheck = false;

        this.microserviceMetaData.metadata.workloads.forEach((y) => {

            y.events.forEach((z) => {
                arr.push(z.name);
            });

        });

        this.eventVal = Object.create(null);
        for (let i = 0; i < arr.length; ++i) {
            let value = arr[i];
            if (value in this.eventVal && value != undefined) {
                this.eventVal[value] = true;
                this.eventCheck = true;
                // return true;
            } else
                this.eventVal[value] = false;
        }
    }

    // Validation for Resources name
    public validateResName() {
        let arr: string[] = [];
        this.resourceCheck = false;
        this.microserviceMetaData.metadata.workloads.forEach((y) => {

            y.resources.forEach((z) => {
                arr.push(z.name);
            });

        });

        this.resourceVal = Object.create(null);
        for (let i = 0; i < arr.length; ++i) {
            let value = arr[i];
            if (value in this.resourceVal && value != undefined) {
                this.resourceVal[value] = true;
                this.resourceCheck = true;
                // return true;
            } else
                this.resourceVal[value] = false;
        }
    }

    // Validate Event Name

    public validateAPI() {
        let arr: string[] = [];
        this.apiNameCheck = false;
        this.microserviceMetaData.metadata.workloads.forEach((y) => {
            y.httpApis.endpoints.forEach((z) => {
                arr.push(z.name);
            });

        });

        this.apiNameVal = Object.create(null);
        for (let i = 0; i < arr.length; ++i) {
            let value = arr[i];
            if (value in this.apiNameVal && value != undefined) {
                this.apiNameVal[value] = true;
                this.apiNameCheck = true;
                // return true;
            } else
                this.apiNameVal[value] = false;
        }
    }

    // Validation for Context Path
    public validateAPIName() {
        let arr: string[] = [];
        this.apiCheck = false;
        this.microserviceMetaData.metadata.workloads.forEach((y) => {
            y.httpApis.endpoints.forEach((z) => {
                arr.push(z.fn);
            });

        });

        this.apiVal = Object.create(null);
        for (let i = 0; i < arr.length; ++i) {
            let value = arr[i];
            if (value in this.apiVal && value != undefined) {
                this.apiVal[value] = true;
                this.apiCheck = true;
                // return true;
            } else
                this.apiVal[value] = false;
        }
    }

    // Validation for Workload Name
    public validateWorkloadName() {
        let arr: string[] = [];
        this.workloadCheck = false;

        this.microserviceMetaData.metadata.workloads.forEach((y) => {
            arr.push(y.workloadName);
        });

        this.workloadVal = Object.create(null);
        for (let i = 0; i < arr.length; ++i) {
            let value = arr[i];
            if (value in this.workloadVal && value != undefined) {
                this.workloadVal[value] = true;
                this.workloadCheck = true;
                // return true;
            } else
                this.workloadVal[value] = false;
        }

    }

    public addNetwork(workload: Workloads) {
        let network = new Network();
        workload.networks.push(network);
    }

    public addEvent(workload: Workloads) {
        let event = new Events();
        workload.events.push(event);
    }

    public addProfile(workload: Workloads) {
        let resource = new Resources();
        workload.resources.push(resource);
    }

    public addAPI(workload: Workloads) {
        let endpoint = new EndPoints();

        workload.httpApis.endpoints.push(endpoint);
    }

    public OnDone() {

        let workload = new Workloads();
        let network = new Network();
        if (this.chooseCheckBox == this.configuration.api) {
            let endpnt = new EndPoints();
            workload.httpApis.endpoints.push(endpnt);
        } else if(this.chooseCheckBox == this.configuration.events){
            let event = new Events();
            workload.events.push(event);
        }
        let resource = new Resources();
        workload.networks.push(network);
        workload.resources.push(resource);
        this.microserviceMetaData.metadata.workloads.push(workload);
    }

    public deleteNetwork(workload: Workloads, network: Network) {
        let arr: Network[] = [];

        this.microserviceMetaData.metadata.workloads.forEach((y) => {
            if (y == workload) {
                y.networks.forEach((z) => {
                    if (z != network) {
                        arr.push(Object.assign({}, z));
                    }
                });
                y.networks = [];
                y.networks = arr;
                this.validate();
                this.validatePort();
            }
        });

    }

    public deleteEvent(workload: Workloads, event: Events) {
        let arr: Events[] = [];
        this.microserviceMetaData.metadata.workloads.forEach((y) => {
            if (y == workload) {
                y.events.forEach((z) => {
                    if (z != event) {
                        arr.push(Object.assign({}, z));
                    }
                });
                y.events = [];
                y.events = arr;
                this.validateEventName();
            }
        });

    }

    public deleteAPI(workload: Workloads, endpnt: EndPoints) {
        let arr: EndPoints[] = [];

        this.microserviceMetaData.metadata.workloads.forEach((y) => {
            if (y == workload) {
                y.httpApis.endpoints.forEach((z) => {
                    if (z != endpnt) {
                        arr.push(Object.assign({}, z));

                    }
                });
                y.httpApis.endpoints = [];
                y.httpApis.endpoints = arr;
                this.validateAPIName();
                this.validateAPI();
            }
        });

    }

    public deleteResource(workload: Workloads, resource: Resources) {
        let arr: Resources[] = [];
        this.microserviceMetaData.metadata.workloads.forEach((y) => {
            if (y == workload) {
                y.resources.forEach((z) => {
                    if (z != resource) {
                        arr.push(Object.assign({}, z));
                    }
                });
                y.resources = [];
                y.resources = arr;

            }
            this.validateResName();
        });

    }

    public deleteWorkload(workload: Workloads) {
        let arr: Workloads[] = [];
        this.microserviceMetaData.metadata.workloads.forEach((y) => {
            if (y != workload) {
                arr.push(Object.assign({}, y));
            }
        });
        this.microserviceMetaData.metadata.workloads = [];
        this.microserviceMetaData.metadata.workloads = arr;

        this.validateWorkloadName();
        this.validateAPIName();
        this.validateAPI();
        this.validateResName();
        this.validatePort();
        this.validate();
        this.validateEventName();

        if (this.microserviceMetaData.metadata.workloads.length == 0) {
            this.DetailsOn_Flag = true;
            this.Microservice_Flag = false;
            this.initial();
            this.disableRadio = false;
        }
    }

    public displayPage1() {
        this.Microservice_Flag = false;
        this.DetailsOn_Flag = true;
        if (this.microserviceMetaData.metadata.workloads.length > 0) {
            this.disableRadio = true;
        }

    }

    public showPublish() {
        //  EdgeCR changes
         for(var i = 0; i < this.microserviceMetaData.metadata.workloads.length; i++) {
           this.microserviceMetaData.metadata.workloads[i].deliveryMethod=this.microserviceMetaData.deliveryMethod;
         }

        this.validateRepository();
        if (!this.respositoryCheck) {
            this.microserviceMetaData.icon = this.image;
            if (this.chooseCheckBox == this.configuration.events) {
                this.microserviceMetaData.microServiceType = this.configuration.events;
                // this.duplicateEvents(); need to add on Final submit
            } else if(this.chooseCheckBox == this.configuration.api) {
                //   this.duplicateApi(); need to add on Final submit
                this.microserviceMetaData.microServiceType = this.configuration.api;
            }
            else if(this.chooseCheckBox == this.configuration.network){
                this.microserviceMetaData.microServiceType = this.configuration.network;
            }
            this.updateExternalObject();
            this.Review_Flag = true;
            this.Microservice_Flag = false;

        }

        this.microserviceMetaData.metadata.workloads.forEach(( x ) => {
            for(let i =0 ; i < x.networks.length; i++) {
              if((x.networks[i].name == "" || x.networks[i].name == undefined || x.networks[i].name == null)
              && (x.networks[i].port == "" || x.networks[i].port == undefined || x.networks[i].port == null)) {
                x.networks.splice(i,1);
              }
            }
        });

        //   }
    }

    //  This function uses the new workload and update the external object in mobileOnBoard.
    //  mobileOnBoard.metadata.external.network.push(<names of external network>)
    //  mobileOnBoard.metadata.external.event.push(<names of external events>)
    public updateExternalObject() {
        let isexternal: boolean = false;
        let isexternalEvent: boolean = false;
        let isexternalApi: boolean = false;
        this.microserviceMetaData.metadata.external.networks = [];
        this.microserviceMetaData.metadata.external.events = [];
        this.microserviceMetaData.metadata.external.httpApis = [];
        this.microserviceMetaData.metadata.workloads.forEach((y) => {
            y.networks.forEach((net) => {
                isexternal = net.external;
                if (isexternal == true) {
                    this.microserviceMetaData.metadata.external.networks.push(net.name);
                }
            });
        });

        this.microserviceMetaData.metadata.workloads.forEach((y) => {
            y.events.forEach((evn) => {
                isexternalEvent = evn.external;
                if (isexternalEvent == true) {
                    this.microserviceMetaData.metadata.external.events.push(evn.name);
                }
            });
        });

        this.microserviceMetaData.metadata.workloads.forEach((y) => {
            y.httpApis.endpoints.forEach((api) => {
                isexternalApi = api.external;
                if (isexternalApi == true) {
                    this.microserviceMetaData.metadata.external.httpApis.push(api.name);
                }
            });
        });
    }

    // Method to convert image into Base64
    public onChange(event: EventTarget) {
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

        myReader.onloadend = (e) => {
            this.image = myReader.result;
            img.src = this.image;
            img.onload = () => {
            console.log("image dimesions=" + img.height + " width=" + img.width);
            if (img.height > 100 || img.width > 100)
                this.imageDimensionsFlag = true;
            else
                this.imageDimensionsFlag = false;
            };
        };
        myReader.readAsDataURL(file);
        myReader.onerror = function(error) {
        };
    }

    public nextFinalize() {
        this.Review_Flag = false;
        this.Finalize_Flag = true;
    }

    public displayPage2() {
        if (this.disableFieldsOnEdit) {
            this.Review_Flag = false;
            this.DetailsOn_Flag = true;
        } else {
            this.Review_Flag = false;
            this.Microservice_Flag = true;
        }
        this.microserviceMetaData.metadata.workloads.forEach(( x ) => {
          if(x.networks.length == 0) {
            x.networks[0] = new Network();
          }
        });
    }

    public displayPage3() {
        if (this.disableFieldsOnEdit) {
            this.Finalize_Flag = false;
            this.DetailsOn_Flag = true;
        } else {
            this.Finalize_Flag = false;
            this.Review_Flag = true;
        }
    }

    public duplicateApi() {
        //  var arr: EndPoints[] = [];

        this.microserviceMetaData.metadata.workloads.forEach((y) => {
            y.httpApis.endpoints.forEach((z) => {
                z.name = y.workloadName + "-api-" + this.countAPI;
                this.countAPI = this.countAPI + 1;
            });
        });

    }

    //  duplicate a given array (deep copy)
    public duplicateEvents() {
        let arr: Events[] = [];

        this.microserviceMetaData.metadata.workloads.forEach((y) => {
            y.events.forEach((z) => {
                z.fn = "fn:" + z.fn;
            });

        });

    }

    public OnSubmit() {
        // if (!this.disableFieldsOnEdit) {
        //     if (this.microserviceMetaData.microServiceType == this.configuration.events)
        //         this.duplicateEvents();
        // }
        this.microserviceMetaData.userId = this.globalservice.userName;
        this.microserviceMetaData.owner = this.globalservice.companyName;
        this.microserviceMetaData.onBoardStatus = "Pending";
        // this.mobileAppsService.OnSubmit(this.mobileAppMetadata);
        console.log("metadata=" + JSON.stringify(this.microserviceMetaData));
    }

    public OnCloseFinal() {

        this.microserviceMetaData = null;
        this.microserviceMetaData = new MicroServiceMetadata();
        this.DetailsOn_Flag = true;
        this.Microservice_Flag = false;
        this.Review_Flag = false;
        this.Finalize_Flag = false;
        this.globalservice.editMicroService = false;
        this.initial();

    }

    public OnClose() {
      this.globalservice.editMicroService=false;
        if (!this.disableFieldsOnEdit) {
            this.globalservice.allMyServices = "myServices";
            this.router.navigate(["/microservice"], { skipLocationChange: true });
        } else {
            this.router.navigate(["/microservicedetails"], { skipLocationChange: true });
            //  this.DetailsOn_Flag = true;
            //  this.Finalize_Flag = false;
            //  this.Review_Flag = false;

        }

    }

    public confirmedOnboard() {
        let icon: string[] = [];
        if(this.microserviceMetaData.icon != null && this.microserviceMetaData.icon != undefined && this.microserviceMetaData.icon != "null") {
        icon = this.microserviceMetaData.icon.split("base64,");
        this.microserviceMetaData.icon = icon[1];
        }

        //this.microserviceMetaData.microServiceName=this.microserviceMetaData.microServiceName.toLowerCase();
        //this.microserviceMetaData.metadata.workloads.forEach((x) => {
        //x.workloadName=x.workloadName.toLowerCase();
        //});
        this.microServiceOnboardService.OnSubmit(this.microserviceMetaData).subscribe((res) => {
            this.globalservice.allMyServices = "myServices";

            this.viewError = false;
            this.disableFieldsOnEdit = false;
            this.globalservice.editMicroService = false;
            //  this.router.navigate(['/microservice']);
        },
            (error) => {
                this.viewError = true;
                this.sessionTimeout.checkSession(error);
                if (error.json().message == null || error.json().message == undefined ||
				error.json().message == "") {
                    this.errorMessage = "Details could not be submitted";
                }
                else {
                    this.errorMessage = error.json().message;
                }
                this.globalservice.allMyServices = "myServices";
                this.disableFieldsOnEdit = false;
                this.globalservice.editMicroService = false;
                //  this.OnCloseFinal();
            });
    }

    public navigate() {
        this.OnCloseFinal();
        this.router.navigate(["/microservice"], { skipLocationChange: true });
    }

    public validateCredit(flag: boolean, credit: string) {
        let number = Number(credit);
        if (flag == true) {
            if (isNaN(number) == true)
                this.creditNaN = true;
            else
                this.creditNaN = false;
        }
        else {
            if (isNaN(number) == true)
                this.creditPerApiCallNaN = true;
            else
                this.creditPerApiCallNaN = false;
        }

    }

}
