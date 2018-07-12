import { Injectable } from "@angular/core";

@Injectable()
export class GlobalServiceService {
    public role = [];
    public userName = "";
    public companyName = "";
    public microServiceName = "";
    public categoryMS = "";
    public allMyApps = "allApps";
    public allMyServices = "allServices";
    public microServiceSupport;
    public serviceStatus;
    public baseURL: string = "";
    public fromMarketPlace = false;
    public applicationName = "";
    public categoryMApp = "";
    public edgeName = "";
    public editMicroService = false;
    public editMobileApps = false;
    public userId = null;
    public selectedRole = "";
    public creditsAvailable: number;
    public onBoardCharges: number;
    public marketPlaceView = "viewAll"; //viewSubscriptions
    public cloudletName: string;
    public cloudletTab = "cloudlets";
    public editCloudlet: boolean;
    public cloudletImage: string;
    public cloudletsFlag: number = 1;
    public appNames: string[] = [];
    public msNames: string[] = [];
    public timePeriod: string = "Last 30 Days";
    public recordForMonitoring: boolean = false;
    public recordForVmiMonitoring: boolean = false;
    public operatorsList = [];
    public edgesList = [];
    public operator: string = "";
    public cloudletNavigation: boolean = false;
    public inDashboard: boolean = false;
    public microserviceUserId : string ;
    public route: string;
    public sessionTimeout:number;
    public accessToken: string;
    public monitoringFailApp :boolean;
    public monitoringFailMS : boolean;
    public feedbackSubmitted : boolean = false;
    public submitFeedback : boolean = true;
    public allFeedback : boolean = true;
    public manage: boolean;
    public uploadFlag : boolean= false;
    public validation : boolean = false;
    public reload : boolean = false;
    constructor() { }
}
