import {BillingComponent} from "./billing/billing.component";
import {CloudletDetailsComponent} from "./cloudlet-details/cloudlet-details.component";
import {CloudletOnBoardComponent} from "./cloudlet-on-board/cloudlet-on-board.component";
import { CloudletComponent } from "./cloudlet/cloudlet.component";
import {DashboardMobileappComponent} from "./dashboard-mobileapp/dashboard-mobileapp.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import { EdgeDetailsComponent } from "./edge-details/edge-details.component";
import {EdgeOnboardComponent} from "./edge-onboard/edge-onboard.component";
import { LoginComponent } from "./login/login.component";
import { MainPageComponent } from "./main-page/main-page.component";
import { MarketPlaceComponent } from "./market-place/market-place.component";
import { MicroServiceDetailsComponent } from "./micro-service-details/micro-service-details.component";
import {MicroServiceOnBoardComponent} from "./micro-service-on-board/micro-service-on-board.component";
import {MicroServiceComponent} from "./micro-service/micro-service.component";
import {MobileAppDetailsComponent} from "./mobile-app-details/mobile-app-details.component";
import {MobileAppComponent} from "./mobile-app/mobile-app.component";
import {MobileAppsOnBoardComponent} from "./mobile-apps-on-board/mobile-apps-on-board.component";
import { MonitoringComponent } from "./monitoring/monitoring.component";
import { PaasAdminComponent } from "./paas-admin/paas-admin.component";
import {ProfileComponent} from "./profile/profile.component";
import { RoutingComponent } from "./routing/routing.component";
import {SignUpComponent} from "./sign-up/sign-up.component";
import {TelcoSignupComponent} from "./telco-signup/telco-signup.component";
import { TelcoUsageComponent } from "./telco-usage/telco-usage.component";
import { DashboardNewCoComponent } from "./dashboard-new-co/dashboard-new-co.component";
import { FeedbackComponent } from './feedback/feedback.component';
import {VMIComponent} from "./vmi/vmi.component";
import {SdkManagerComponent} from "./sdk-manager/sdk-manager.component";
import { CloudletUsageGraphComponent } from "./cloudlet-usage-graph/cloudlet-usage-graph.component";

export const AppRoutes: any = [
    { path: "microservicemarketplace", component: MarketPlaceComponent },
    { path: "dashboard", component: MainPageComponent },
    { path: "signup", component: SignUpComponent },
    { path: "microservice", component: MicroServiceComponent },
    { path: "onboard", component: MicroServiceOnBoardComponent },
    { path: "mainpage", component: MainPageComponent },
    { path: "profile", component: ProfileComponent },
    { path: "login", component: LoginComponent },
    { path: "microservicedetails", component: MicroServiceDetailsComponent },
	   { path: "mobileOnBoard", component: MobileAppsOnBoardComponent },
    { path: "mobileApp", component: MobileAppComponent },
    { path: "mobileappdetails", component: MobileAppDetailsComponent },
    { path: "billing", component: BillingComponent },
    { path: "dash", component: DashboardComponent },
    { path: "dashMobile", component: DashboardMobileappComponent },
    { path: "paasadmin", component: PaasAdminComponent },
    { path: "edgedetails", component: EdgeDetailsComponent },
    { path: "cloudlet", component: CloudletComponent },
    { path: "cloudletOnBoard", component: CloudletOnBoardComponent },
    { path: "telcoSignup", component: TelcoSignupComponent },
    { path: "cloudletDetails", component: CloudletDetailsComponent },
    { path: "monitoring", component: MonitoringComponent },
    { path: "telcoUsage", component: TelcoUsageComponent },
    { path: "routeReports", component: RoutingComponent },
    { path: "edgeOnboard", component: EdgeOnboardComponent },
	{ path: "newcodash", component: DashboardNewCoComponent },
  { path: "feedback" , component: FeedbackComponent},
	{ path: "vmi", component : VMIComponent},
  {path:"sdkManage" , component : SdkManagerComponent},
  {path:"cloudletGraph", component : CloudletUsageGraphComponent}
];

export const AppComponents: any = [
    MarketPlaceComponent,
    MainPageComponent,
    SignUpComponent,
    ProfileComponent,
    LoginComponent,
    MicroServiceDetailsComponent,
    MobileAppComponent,
    MobileAppDetailsComponent,
    BillingComponent,
    PaasAdminComponent,
    EdgeDetailsComponent,
    CloudletComponent,
    CloudletOnBoardComponent,
    TelcoSignupComponent,
    TelcoUsageComponent,
    RoutingComponent,
    VMIComponent,
];
