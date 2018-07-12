import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule, JsonpModule } from "@angular/http";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule, Routes } from "@angular/router";
import { ChartsModule } from "ng2-charts";
import { DatePickerModule } from "ng2-datepicker";
import {DropdownModule} from "ng2-dropdown";
import {Ng2PaginationModule} from "ng2-pagination";
import {TooltipModule} from "ng2-tooltip";
import {AppGraphService} from "./app-usage-graph/app-graph.service";
import { AppUsageGraphComponent } from "./app-usage-graph/app-usage-graph.component";
import { AppComponent } from "./app.component";
import {Configuration} from "./app.constants";
// import { MarketPlaceComponent } from './market-place/market-place.component';
// import { MainPageComponent } from './main-page/main-page.component';
import { AppComponents, AppRoutes } from "./app.routing";
import { BillingComponent } from "./billing/billing.component";
import {BillingService} from "./billing/billing.service";
import { CloudletDetailsComponent } from "./cloudlet-details/cloudlet-details.component";
import { CloudletOnBoardComponent } from "./cloudlet-on-board/cloudlet-on-board.component";
import { CloudletUsageGraphComponent } from "./cloudlet-usage-graph/cloudlet-usage-graph.component";
import {CloudletListingService} from "./cloudlet/cloudlet-listing.service";
import { CloudletComponent } from "./cloudlet/cloudlet.component";
import {CountryState} from "./common-services/countrystatelist";
import {OrderBy} from "./common-services/OrderBy";
import {ProfileServiceService} from "./common-services/profile.service";
import { SchedulerService } from "./common-services/scheduler.service";
import {ValidationService} from "./common-services/validation.service";
import { ControlMessagesComponent } from "./control-messages/control-messages.component";
import { DashboardMobileappComponent } from "./dashboard-mobileapp/dashboard-mobileapp.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import {EdgeDetailServiceService} from "./edge-details/edge-detail-service.service";
import { EdgeDetailsComponent } from "./edge-details/edge-details.component";
import {EdgeOnboardComponent} from "./edge-onboard/edge-onboard.component";
import {EdgeOnboardService} from "./edge-onboard/edge-onboard.service";
import {EqualValidator} from "./equal-validator.directive";
import {GlobalServiceService} from "./global-service.service";
import {MarketPlaceService} from "./market-place/marketPlace.service";
import {MicroServiceDetailsService} from "./micro-service-details/micro-service-details.service";
import {MicroServiceOnBoardComponent} from "./micro-service-on-board/micro-service-on-board.component";
import {MicroServiceOnboardService} from "./micro-service-on-board/micro-service-onboard.service";
import {MicroServiceComponent} from "./micro-service/micro-service.component";
import { MobileAppDetailsComponent } from "./mobile-app-details/mobile-app-details.component";
import { MobileAppComponent } from "./mobile-app/mobile-app.component";
import { MobileAppsOnBoardComponent } from "./mobile-apps-on-board/mobile-apps-on-board.component";
import { MonitoringComponent } from "./monitoring/monitoring.component";
import {EdgeListingService} from "./paas-admin/edge-listing.service";
import { PaasAdminComponent } from "./paas-admin/paas-admin.component";
import { ProfileComponent } from "./profile/profile.component";
import { RoutingComponent } from "./routing/routing.component";
import {MicroServiceGraphService} from "./service-usage-graph/micro-service-graph.service";
import { ServiceUsageGraphComponent } from "./service-usage-graph/service-usage-graph.component";
import { TelcoSignupComponent } from "./telco-signup/telco-signup.component";
import { TelcoUsageComponent } from "./telco-usage/telco-usage.component";
import { DashboardNewCoComponent } from "./dashboard-new-co/dashboard-new-co.component";
import {NewCoDashboardService} from "./dashboard-new-co/dashboard-new-co.service";
import { FeedbackComponent } from './feedback/feedback.component';
import { VMIComponent } from "./vmi/vmi.component";
import {AppUsageDetailsForVMI} from "./vmi/vmi.service";
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { LoaderComponent } from './loader/loader.component';
import { PopoverModule } from 'ngx-popover';
import {FeedbackServiceService} from "./feedback/feedback-service.service";
import { SdkManagerComponent } from './sdk-manager/sdk-manager.component';
import { SDKManagerService } from './sdk-manager/sdk-manager.service';
import { End } from './common-services/endp';

/*const appRoutes: Routes = [
  { path: 'microservicemarketplace', component: MarketPlaceComponent },
   { path: 'dashboard', component: MainPageComponent }
];*/

@NgModule( {
    declarations: [
        AppComponent,
        ControlMessagesComponent,
        EqualValidator,
        OrderBy,
        MicroServiceComponent,
        MicroServiceOnBoardComponent,
        ...AppComponents,
        ProfileComponent,
        MobileAppsOnBoardComponent,
        MobileAppComponent,
        MobileAppDetailsComponent,
        BillingComponent,
        DashboardComponent,
        DashboardMobileappComponent,
        PaasAdminComponent,
        EdgeDetailsComponent,
        EdgeOnboardComponent,
        CloudletComponent,
        TelcoSignupComponent,
        CloudletOnBoardComponent,
        AppUsageGraphComponent,
        CloudletDetailsComponent,
        EdgeOnboardComponent,
        ServiceUsageGraphComponent,
        CloudletUsageGraphComponent,
        MonitoringComponent,
        TelcoUsageComponent,
        RoutingComponent,
        DashboardNewCoComponent,
        FeedbackComponent,
        VMIComponent,
        LoaderComponent,
        SdkManagerComponent,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        JsonpModule,
        RouterModule,
        RouterModule.forRoot( AppRoutes),
        Ng2PaginationModule,
        DropdownModule,
        ChartsModule,
        DatePickerModule,
        MultiselectDropdownModule,
        PopoverModule,
        TooltipModule,
    ],
    providers: [GlobalServiceService, MicroServiceGraphService, ValidationService, MarketPlaceService,
        CountryState, MicroServiceDetailsService, MicroServiceOnboardService, Configuration, SchedulerService,
        ProfileServiceService, BillingService, EdgeListingService, EdgeDetailServiceService, CloudletListingService,
        AppGraphService, EdgeOnboardService, NewCoDashboardService, AppUsageDetailsForVMI, FeedbackServiceService,SDKManagerService,End],
    bootstrap: [AppComponent],
    //   bootstrap: [SignUpComponent]
})
export class AppModule { }
