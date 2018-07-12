import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { Configuration } from "../app.constants";
import {CloudLetOnBoard} from "../common-services/cloudLetOnBoard";
import {OnBoardStatus} from "../common-services/onBoardStatus";
import { GlobalServiceService } from "../global-service.service";
import {EdgeListingService} from "../paas-admin/edge-listing.service";
import { EdgePresent} from "../paas-admin/edgePresent";
import {SignUp} from "../sign-up/sign-up.model";
import {CloudletListingService} from "./cloudlet-listing.service";
import { CloudletImages } from "./cloudletPresent";
import { SessionTimeout } from "../common-services/session-timeout";

@Component({
    selector: "app-cloudlet",
    templateUrl: "./cloudlet.component.html",
    styleUrls: ["./cloudlet.component.css"],
    providers: [Configuration, CloudletListingService, EdgeListingService,SessionTimeout],
})
export class CloudletComponent implements OnInit {

    public errorMessage: string;
    public initialItems: number;
    public imageUploadFlag = true;
    public imageUploadSuccess;
    public sort: any = 0;
    public sortImage: any = 0;
    public sortDropdown: string = "Alphabetic";
    public timerCloudlet;
    public timerImages;
    private allCloudlets: CloudLetOnBoard[];
    private pendingCloudlets: OnBoardStatus[] = [];
    private pendingCloudletImages: OnBoardStatus[] = [];
    private cloudletScheduler: CloudLetOnBoard[];
    private cloudletImageScheduler: CloudletImages[];
    private allCloudletImages: CloudletImages[];
    private newImage = new CloudletImages();
    private edgeList: EdgePresent[] = [];
    private listOfEdges: string[] = [];
    private allOnboardedEdge: EdgePresent[];
    private cloudletPresentFlag = true;
    private imagePresentFlag = true;
    private duplicateImageName: boolean = false;
    private cloudletsFlag: number;
    // private operatorsList:string[]=[];
    // private edgesList:string[]=[];
    private userList: SignUp[];
    public loading: boolean = false;
    public counterCloud:number  = 1;
    public timerForLogoutCloud;
    public counterImage:number  = 1;
    public timerForLogoutImage;

    constructor(private publicConfiguration: Configuration, private router: Router,
        private globalServiceObj: GlobalServiceService, private cloudletListService: CloudletListingService,
        private edgeListingService: EdgeListingService, private sessionTimeout : SessionTimeout) {
        // 	this.allCloudlets = [new CloudletPresent(),new CloudletPresent(),new CloudletPresent(),
        //new CloudletPresent(), new CloudletPresent(), new CloudletPresent(); ];
        this.initialItems = publicConfiguration.MinItemFirstLoad;
    }

    public ngOnInit() {
        this.cloudletsFlag = this.globalServiceObj.cloudletsFlag;
        this.newImage.edgeName = null;
        if (this.globalServiceObj.cloudletNavigation) {
            this.globalServiceObj.cloudletNavigation = false;
            document.getElementById("openModalButton").click();
        }
        else if (this.globalServiceObj.cloudletsFlag == 1) {
            this.fetchAllCloudlets();
        }
        else if (this.globalServiceObj.cloudletsFlag == 2) {
            this.fetchAllImages();
        }


    }

    // Following function to fetch all images of cloudlet on clicking 1st tab or by default on loading first time
    public fetchAllCloudlets() {
        this.loading = true;
        this.cloudletsFlag = 1;
        this.cloudletListService.getCloudletList().subscribe(
            (data) => {
                this.allCloudlets = <CloudLetOnBoard[]>data[0];
                this.userList = <SignUp[]>data[1];
                if (this.allCloudlets.length == 0) {
                    this.cloudletPresentFlag = false;
                    this.errorMessage = "No records found";
                }
                else {
                    this.cloudletPresentFlag = true;

                    for (let i = 0; i < this.allCloudlets.length; i++) {
                        if (this.allCloudlets[i].onBoardStatus.toLocaleLowerCase() == "pending") {
                            if (this.checkUniqueness(this.allCloudlets[i].cloudletName)) {
                                this.pendingCloudlets.push(new OnBoardStatus(this.allCloudlets[i].cloudletName,
                                    this.allCloudlets[i].onBoardStatus));
                            }
                        }
                    }
                    if (this.userList.length != 0) {
                        for (let i = 0; i < this.userList.length; i++) {
                            if (this.checkUniqueOperator(this.userList[i].companyName) &&  (this.userList[i].companyName != null && this.userList[i].companyName != undefined && this.userList[i].companyName != "")) {
                                this.globalServiceObj.operatorsList.push(this.userList[i].companyName);
                            }
                        }
                    }
                }
                this.loading=false;
            },
            (error) => {
                    this.cloudletPresentFlag = false;
                    this.sessionTimeout.checkSession(error);
                    if (error.json().message == null || error.json().message == undefined || error.json().message == "") {
                        this.errorMessage = "Cloudlets could not be fetched";
                    }
                    else {
                        this.errorMessage = error.json().message;
                    }
                    this.loading=false;
            }
        );

        this.timerCloudlet = setInterval(() => {
            if (this.pendingCloudlets.length > 0 && this.cloudletsFlag == 1)
                this.schedulerCloudlet();
        }, 5000);

    }

    public checkUniqueOperator(operator: string) {
        let flag = true;
        for (let i = 0; i < this.globalServiceObj.operatorsList.length; i++) {
            if (this.globalServiceObj.operatorsList[i] == operator)
                flag = false;
        }
        return flag;
    }

    public checkUniqueEdges(edge: string) {
        let flag = true;
        for (let i = 0; i < this.globalServiceObj.edgesList.length; i++) {
            if (this.globalServiceObj.edgesList[i] == edge)
                flag = false;
        }
        return flag;
    }

    public ngOnDestroy() {
        if (this.timerCloudlet) {
            clearInterval(this.timerCloudlet);
        }
        if (this.timerImages) {
            clearInterval(this.timerImages);
        }
        this.cloudletsFlag = 0;
        clearInterval(this.timerForLogoutCloud);
        clearInterval(this.timerForLogoutImage);
    }

    public routerOnDeactivate()  {
        if (this.timerCloudlet) {
            clearInterval(this.timerCloudlet);
        }
        if (this.timerImages) {
            clearInterval(this.timerImages);
        }
        this.cloudletsFlag = 0;
        }

    // Following function to fetch all images of cloudlet on clicking second tab
    public fetchAllImages() {
        this.loading=true;
        this.cloudletsFlag = 2;
        this.cloudletListService.getImageList().subscribe(
            (data) => {
                this.allCloudletImages = <CloudletImages[]>data;
                if (this.allCloudletImages.length == 0) {
                    this.imagePresentFlag = false;
                    this.errorMessage = "No records found";
                }
                else {
                    this.imagePresentFlag = true;
                    for (let i = 0; i < this.allCloudletImages.length; i++) {
                        if (this.allCloudletImages[i].status != undefined ||
						this.allCloudletImages[i].status != null || this.allCloudletImages[i].status != "") {
                            if (this.allCloudletImages[i].status.toLocaleLowerCase() == "pending") {
                                if (this.checkUniqueImages(this.allCloudletImages[i].imageName)) {
                                    this.pendingCloudletImages.
                                        push(new OnBoardStatus(this.allCloudletImages[i].imageName,
                                            this.allCloudletImages[i].status));
                                }
                            }
                        }
                    }

                }
                this.loading = false;
            },
            (error) => {
                    this.imagePresentFlag = false;
                    this.sessionTimeout.checkSession(error);
                    if (error.json().message == null || error.json().message == undefined || error.json().message == "") {
                        this.errorMessage = "Images could not be fetched";
                    }
                    else {
                        this.errorMessage = error.json().message;
                    }
                    this.loading = false;
            }
        );

        this.fetchAllEdgeList();
        this.timerImages = setInterval(() => {
            if (this.pendingCloudletImages.length > 0 && this.cloudletsFlag == 2)
                this.schedulerImages();
        }, 5000);
    }

    public setTab(selectedTab: string) {
        clearInterval(this.timerCloudlet);
        clearInterval(this.timerImages);
        (<HTMLInputElement>document.getElementById("srchterm")).value = "";
        if (selectedTab == "cloudlet") {
            this.globalServiceObj.cloudletsFlag = 1;
            this.cloudletsFlag = this.globalServiceObj.cloudletsFlag;
            // this.cloudletsFlag = 1;
            this.fetchAllCloudlets();
            // (<HTMLInputElement> document.getElementById("srchterm")).value = "";
        }
        else if (selectedTab == "cloudletImage") {
            // this.cloudletsFlag = 2;
            this.globalServiceObj.cloudletsFlag = 2;
            this.cloudletsFlag = this.globalServiceObj.cloudletsFlag;
            this.fetchAllImages();
            // (<HTMLInputElement> document.getElementById("srchterm")).value = "";
        }
        else if (selectedTab == "usage") {
            // this.cloudletsFlag = 3;
            this.globalServiceObj.cloudletsFlag = 3;
            this.cloudletsFlag = this.globalServiceObj.cloudletsFlag;
        }
    }

    public onChangeEvent() {
        this.loading = true;
        if (this.globalServiceObj.cloudletsFlag == 1) {
            this.cloudletListService.getSortingDetail(this.sort).subscribe((res: CloudLetOnBoard[]) => {
                this.allCloudlets = res;
                if (this.allCloudlets.length == 0) {
                    this.cloudletPresentFlag = false;
                    this.errorMessage = "No records found";
                }
                else {
                    this.cloudletPresentFlag = true;
                }
                this.loading = false;
            },
                (error) => {
                    this.cloudletPresentFlag = false;
                    this.sessionTimeout.checkSession(error);
                    if (error.json().message == null || error.json().message == undefined ||
          error.json().message == "") {
                        this.errorMessage = "Sorted data could not be fetched";
                    }
                    else {
                        this.errorMessage = error.json().message;
                    }
                    this.loading = false;
                }
            );
        }
        else if (this.globalServiceObj.cloudletsFlag == 2) {
            this.cloudletListService.getSortingDetail(this.sortImage).subscribe((res: CloudletImages[]) => {
                this.allCloudletImages = res;
                if (this.allCloudletImages.length == 0) {
                    this.imagePresentFlag = false;
                    this.errorMessage = "No records found";
                }
                else {
                    this.imagePresentFlag = true;
                }
                this.loading = false;
            },
                (error) => {
                    this.imagePresentFlag = false;
                    this.sessionTimeout.checkSession(error);
                    if (error.json().message == null || error.json().message == undefined ||
          error.json().message == "") {
                        this.errorMessage = "Sorted data could not be fetched";
                    }
                    else {
                        this.errorMessage = error.json().message;
                    }
                    this.loading = false;
                },
            );
        }

    }

    public search(term) {
      this.loading = true;
        if (this.globalServiceObj.cloudletsFlag == 1) {
            this.cloudletListService.search(term).subscribe((res: CloudLetOnBoard[]) => {
                this.allCloudlets = res;
                if (this.allCloudlets.length == 0) {
                    this.cloudletPresentFlag = false;
                    this.errorMessage = "No records found";
                }
                else {
                    this.cloudletPresentFlag = true;
                }
                this.loading = false;
            },
                (error) => {
                    this.cloudletPresentFlag = false;
                    this.sessionTimeout.checkSession(error);
                    this.allCloudlets =[];
                    if (error.json().message == null || error.json().message == undefined ||
          error.json().message == "") {
                        this.errorMessage = term + " could not be fetched";
                    }
                    else {
                        this.errorMessage = error.json().message;
                    }
                    this.loading = false;
                }
            );
        }
        else if (this.globalServiceObj.cloudletsFlag == 2) {
            this.cloudletListService.search(term).subscribe((res: CloudletImages[]) => {
                this.allCloudletImages = res;
                if (this.allCloudletImages.length == 0) {
                    this.imagePresentFlag = false;
                    this.errorMessage = "No records found";
                }
                else {
                    this.imagePresentFlag = true;
                }
                this.loading = false;
            },
                (error) => {
                    this.imagePresentFlag = false;
                    this.allCloudletImages = [];
                    this.sessionTimeout.checkSession(error);
                    if (error.json().message == null || error.json().message == undefined ||
          error.json().message == "") {
                        this.errorMessage = term + " could not be fetched";
                    }
                    else {
                        this.errorMessage = error.json().message;
                    }
                    this.loading = false;
                },
            );

        }
    }


    public schedulerCloudlet() {

        let searchApps: string[] = [];
        this.cloudletScheduler = [];
        if(this.counterCloud == 1) {
        this.counterCloud++;
        this.timerForLogoutCloud = setInterval(() => {
          this.allCloudlets=[];
          this.loading=true;
          alert(this.publicConfiguration.timeoutMsg);
          window.location.reload(false);
        }, this.globalServiceObj.sessionTimeout );
        }
        for (let i = 0; i < this.pendingCloudlets.length; i++) {
            searchApps.push(this.pendingCloudlets[i].name);
        }

        if(this.allCloudlets.length > 0 ) {
        this.cloudletListService.getCloudlets(searchApps).subscribe((res: CloudLetOnBoard[]) => {
            this.cloudletScheduler = res;
            for (let i = 0; i < this.cloudletScheduler.length; i++) {
                for (let j = 0; j < this.allCloudlets.length; j++) {
                    if (this.cloudletScheduler[i].cloudletName == this.allCloudlets[j].cloudletName) {
                        if (this.cloudletScheduler[i].onBoardStatus != this.allCloudlets[j].onBoardStatus) {
                            this.allCloudlets[j].onBoardStatus = this.cloudletScheduler[i].onBoardStatus;
                        }
                    }
                }
            }
            this.pendingCloudlets = [];
            for (let i = 0; i < this.allCloudlets.length; i++) {
                if (this.allCloudlets[i].onBoardStatus.toLocaleLowerCase() == "pending") {
                    if (this.checkUniqueness(this.allCloudlets[i].cloudletName)) {
                        this.pendingCloudlets.push(new OnBoardStatus
                            (this.allCloudlets[i].cloudletName, this.allCloudlets[i].onBoardStatus));
                    }
                }
            }
        },
            (error) => {
                this.sessionTimeout.checkSession(error);
                if (error.json().message == null || error.json().message == undefined || error.json().message == "") {
                    //this.errorMessage = "Cloudlets could not be fetched";
                    console.log("Cloudlets could not be fetched");
                }
                else {
                    //this.errorMessage = error.json().message;
                    console.log("Error from scheduler=" + error.json().message);
                }
            },
        );
        }
    }

    public schedulerImages() {
        let searchApps: string[] = [];
        this.cloudletImageScheduler = [];
        if(this.counterImage == 1) {
        this.counterImage++;
        this.timerForLogoutImage = setInterval(() => {
          this.allCloudletImages=[];
          this.loading=true;
          alert(this.publicConfiguration.timeoutMsg);
          window.location.reload(false);
        }, this.globalServiceObj.sessionTimeout );
        }
        for (let i = 0; i < this.pendingCloudletImages.length; i++) {
            searchApps.push(this.pendingCloudletImages[i].name);
        }

        if(this.allCloudletImages.length > 0) {
        this.cloudletListService.getCloudletImages(searchApps).subscribe((res: CloudletImages[]) => {
            this.cloudletImageScheduler = res;
            for (let i = 0; i < this.cloudletImageScheduler.length; i++) {
                for (let j = 0; j < this.allCloudletImages.length; j++) {
                    if (this.cloudletImageScheduler[i].imageName == this.allCloudletImages[j].imageName) {
                        if (this.cloudletImageScheduler[i].status != this.allCloudletImages[j].status) {
                            this.allCloudletImages[j].status = this.cloudletImageScheduler[i].status;
                        }
                    }
                }
            }
            this.pendingCloudletImages = [];
            for (let i = 0; i < this.allCloudletImages.length; i++) {
                if (this.allCloudletImages[i].status.toLocaleLowerCase() == "pending") {
                    if (this.checkUniqueImages(this.allCloudletImages[i].imageName)) {
                        this.pendingCloudletImages.push(new OnBoardStatus
                            (this.allCloudletImages[i].imageName, this.allCloudletImages[i].status));
                    }
                }
            }
        },
            (error) => {
                this.sessionTimeout.checkSession(error);
                if (error.json().message == null || error.json().message == undefined || error.json().message == "") {
                    //this.errorMessage = "Images could not be fetched";
                    console.log("Images could not be fetched");
                }
                else {
                    //this.errorMessage = error.json().message;
                    console.log("Error message from scheduler=" +error.json().message);
                }

            },
        );
        }
    }

    public checkUniqueness(cloudletName: string) {
        let flag = true;
        for (let i = 0; i < this.pendingCloudlets.length; i++) {
            if (this.pendingCloudlets[i].name == cloudletName) {
                flag = false;
            }
        }
        return flag;
    }

    public checkUniqueImages(imageName: string) {
        let flag = true;
        for (let i = 0; i < this.pendingCloudletImages.length; i++) {
            if (this.pendingCloudletImages[i].name == imageName) {
                flag = false;
            }
        }
        return flag;
    }

    public cloudletDetail(cloudletNamePassed: string) {
        if (this.globalServiceObj.cloudletsFlag == 1)
            this.globalServiceObj.cloudletName = cloudletNamePassed;
        else if (this.globalServiceObj.cloudletsFlag == 2)
            this.globalServiceObj.cloudletImage = cloudletNamePassed;
        this.router.navigate(["/cloudletDetails"], { skipLocationChange: true });
    }

    public redirect() {
        this.router.navigate(["/cloudletOnBoard"], { skipLocationChange: true });
    }

    public imageUpload() {
        this.loading=true;
        this.cloudletListService.uploadImage(this.newImage).subscribe((res: any) => {
            this.imageUploadSuccess = true;
            this.imageUploadFlag = false;
            this.OnCloseCloudletImageOnboard();
            this.loading = false;
        },
            (error) => {
                this.imageUploadSuccess = false;
                this.imageUploadFlag = false;
                this.OnCloseCloudletImageOnboard();
                this.sessionTimeout.checkSession(error);

                  if (error.json().message == null || error.json().message == undefined || error.json().message == "") {
                      this.errorMessage = "Image could not be uploaded";
                  }
                  else {
                      this.errorMessage = error.json().message;
                  }
                this.loading = false;
            }
        );
    }

    public OnCloseCloudletImageOnboard() {
        this.globalServiceObj.cloudletsFlag = 2;
        this.fetchAllImages();
    }

    public openUploadModal(form: FormGroup) {
        form.reset();
        this.newImage = new CloudletImages();
        this.imageUploadFlag = true;
        this.duplicateImageName = false;
    }
    public getAllEdges() {
        this.loading = true;
        this.edgeListingService.getEdgeList().subscribe((res: EdgePresent[]) => {
            this.edgeList = res;
            for (let i = 0; i < this.edgeList.length; i++) {
                this.listOfEdges.push(this.edgeList[i].edgeName);
            }
            this.loading = false;
        },
            (error) => {
                this.sessionTimeout.checkSession(error);
                if (error.json().message == null || error.json().message == undefined || error.json().message == "") {
                    this.errorMessage = "Edges could not be fetched";
                }
                else {
                    this.errorMessage = error.json().message;
                }
                this.loading = false;
            }
        );
    }

    public validateImageName() {
        this.duplicateImageName = false;
        this.loading = true;
        this.cloudletListService.validateImageName(this.newImage.imageName).subscribe((res) => {
            if (res.status != "success") {
                this.duplicateImageName = true;
            }
            else
                this.duplicateImageName = false;

            this.loading = false;
        },
            (error) => {
                this.duplicateImageName = true;
                this.sessionTimeout.checkSession(error);
                if (error.json().message == null || error.json().message == undefined || error.json().message == "") {
                    this.errorMessage = "Image name could not be validated";
                }
                else {
                    this.errorMessage = error.json().message;
                }
            });
    }

    public OnClose() {

        this.newImage = null;
        this.newImage = new CloudletImages();
        this.globalServiceObj.cloudletsFlag = 2;
        //this.router.navigate( ["/cloudlet"] , { skipLocationChange: true });
        this.fetchAllImages();

    }

    private fetchAllEdgeList() {
        this.loading =true;
        this.cloudletListService.getEdgeList().subscribe(
            (data) => {
                this.allOnboardedEdge = <EdgePresent[]>data;
                if (this.allOnboardedEdge.length > 0) {

                    for (let i = 0; i < this.allOnboardedEdge.length; i++) {
                        if (this.allOnboardedEdge[i].edgeName != undefined ||
						this.allOnboardedEdge[i].edgeName != null || this.allOnboardedEdge[i].edgeName != "") {
                            if (this.checkUniqueEdges(this.allOnboardedEdge[i].edgeName)) {
                                this.globalServiceObj.edgesList.push(this.allOnboardedEdge[i].edgeName);
                            }
                        }
                    }
                }
                this.loading = false;
            },
            (error) => {
              this.sessionTimeout.checkSession(error);
            }
        );
    }
}
