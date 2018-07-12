import { Component, OnInit } from "@angular/core";
import { Router, RouterModule}  from "@angular/router";
import {GlobalServiceService} from "../global-service.service";

@Component({
    selector: "app-routing",
    templateUrl: "./routing.component.html",
    styleUrls: ["./routing.component.css"],
})
export class RoutingComponent implements OnInit {

    constructor(private route: Router,private globalservice: GlobalServiceService) { }

    public ngOnInit() {
      if(this.globalservice.route == "ms") {
        this.route.navigate(["/microservice"], { skipLocationChange: true });
      }
      else if(this.globalservice.route == "app") {
        this.route.navigate(["/mobileApp"], { skipLocationChange: true });
      }
      else if(this.globalservice.route == "cloudlet") {
        this.route.navigate(["/cloudlet"], { skipLocationChange: true });
      }
      else if(this.globalservice.route == "edge") {
        this.route.navigate(["/paasadmin"], { skipLocationChange: true });
      }
      else if(this.globalservice.route == "marketplace") {
        this.route.navigate(["/microservicemarketplace"], { skipLocationChange: true });
      }
      else if(this.globalservice.route == "sdkManage") {
        this.route.navigate(["/sdkManage"], { skipLocationChange: true });
      }
      else if(this.globalservice.route == "feedback") {
        this.route.navigate(["/feedback"], { skipLocationChange: true });
      }
    }

}
