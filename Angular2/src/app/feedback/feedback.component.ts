import { Component, OnInit } from "@angular/core";
import { GlobalServiceService } from "../global-service.service";
import { Router, RouterModule } from "@angular/router";
import { Headers, Http, RequestOptions, Response, URLSearchParams } from "@angular/http";
import { Configuration } from "../app.constants";
import { FeedbackServiceService } from "./feedback-service.service";
import { FeedbackModal } from "./feedback.modal";
import { SessionTimeout } from "../common-services/session-timeout";

@Component( {
    selector: "app-feedback",
    templateUrl: "./feedback.component.html",
    styleUrls: ["./feedback.component.css"],
    providers: [FeedbackServiceService, Configuration],
} )
export class FeedbackComponent implements OnInit {

    public feedbackFile: File;
    public feedbackInfo = new FeedbackModal();
    public errorMessage: string;
    public saveFail = false;
    public allFeedback: boolean = false;
    public submitFeedback: boolean = false;
    public feedbacks: FeedbackModal[] = [];
    public allFeedbacks: FeedbackModal[] = [];
    public feedbackError: boolean = false;
    public sortString: string = "all";
    public category: string;
    public selectedFeedback = new FeedbackModal();
    public comments: string[] = [];
    public commentsFlag: boolean[] = [];
    public formatFlag: boolean = false;
    public sizeFlag: boolean = false;
    public fileCountFlag: boolean = false;
    public others: string;
    public uploadedFBFiles: File[] = [];
    public validationFlag: boolean = false;
    public count: number = 0;

    constructor( private globalservice: GlobalServiceService, private route: Router,
        private publicConfiguration: Configuration,
        private feedbackObj: FeedbackServiceService,
        private sessionTimeout: SessionTimeout ) {
    }

    public ngOnInit() {
        if ( this.globalservice.submitFeedback ) {
            this.submitFeedback = true;
            this.allFeedback = false;
            this.feedbackInfo.category = "suggestion";
            this.feedbackInfo.comments = "";
        } else {
            this.submitFeedback = false;
            this.allFeedback = true;
            this.globalservice.allFeedback = true;
            this.getAllFeedbacks();
        }
    }

    public onChangeTemplate( event: EventTarget ) {
        let file: File[] = [];
        let eventObj: MSInputMethodContext = <MSInputMethodContext> event;
        let target: HTMLInputElement = <HTMLInputElement> eventObj.target;
        let files: FileList = target.files;
        let fileName: string = "";
        let extn: string = "";
        let fileSize: number = 0;
        this.uploadedFBFiles = [];
        for ( let i = 0; i < files.length; i++ ) {
            this.uploadedFBFiles.push( files[i] );
        }
        this.fileCountFlag = false;
        for ( let i = 0; i < files.length; i++ ) {
            file[i] = files[i];
            fileName = file[i].name;
            extn = fileName.substr( fileName.lastIndexOf( "." ) + 1 );
            fileSize += file[i].size;
            if ( fileSize > 2097152 ) {
                this.sizeFlag = true;
                this.formatFlag = false;
                break;
            } else {
                this.sizeFlag = false;
            }
            if ( this.publicConfiguration.feedbackFormats.indexOf( extn ) === -1 ) {
                this.formatFlag = true;
                this.sizeFlag = false;
                break;
            } else {
                this.formatFlag = false;
            }
        }
    }

    public saveFeedback() {
        if ( this.feedbackInfo.category === "others" ) {
            this.feedbackInfo.category = this.others;
        }
        this.feedbackObj.saveFeedback( this.uploadedFBFiles, this.feedbackInfo ).subscribe(
            ( data ) => {
                this.saveFail = false;
                this.globalservice.feedbackSubmitted = true;
                this.feedbackInfo.comments = "";
            },
            ( error ) => {
                this.saveFail = true;
                this.globalservice.feedbackSubmitted = true;
                this.feedbackInfo.comments = "";
                this.sessionTimeout.checkSession(error);
                if ( error.json().message === null || error.json().message === undefined || error.json().message === "" ) {
                    this.errorMessage = "Feedback could not be saved";
                } else {
                    this.errorMessage = error.json().message;
                }
            });
    }

    public showFeedbacks() {
        this.globalservice.submitFeedback = false;
        this.globalservice.allFeedback = true;
        this.globalservice.route = "feedback";
        this.route.navigate( ["/routeReports"], { skipLocationChange: true } );
    }

    public getAllFeedbacks() {
        this.feedbackObj.getFeedback().subscribe(
            ( data ) => {
                this.feedbacks = data;
                this.allFeedbacks = this.feedbacks;
                for ( let feed of this.feedbacks ) {
                    if ( feed.comments !== null && feed.comments.length > 50 ) {
                        feed.longComments = feed.comments.substring( 0, 50 );
                    }
                }
                this.feedbackError = false;
            },
            ( error ) => {
                this.feedbackError = true;
                this.sessionTimeout.checkSession(error);
                if ( error.json().message === null || error.json().message === undefined || error.json().message === "" ) {
                    this.errorMessage = "Feedback could not be saved";
                } else {
                    this.errorMessage = error.json().message;
                }
            });
    }

    public sort() {
        this.feedbacks = [];
        if ( this.sortString.toLowerCase() === "all") {
          this.getAllFeedbacks();
        } else {
          this.feedbackObj.sort( this.sortString ).subscribe(
              ( data ) => {
                  if ( this.sortString.toLowerCase() !== "others") {
                    this.feedbacks = data;
                  } else {
                    this.allFeedbacks = data;
                    for ( let feed of this.allFeedbacks) {
                      if ( feed.category.toLowerCase() !== "suggestion" && feed.category.toLowerCase() !== "problem"
                      && feed.category.toLowerCase() !== "query") {
                        this.feedbacks.push(feed);
                      }
                    }
                  }
                  for ( let feed of this.feedbacks) {
                      if ( feed.comments.length > 50 ) {
                          feed.longComments = feed.comments.substring( 0, 50 );
                      }
                  }
                  this.feedbackError = false;
              },
              ( error ) => {
                  this.feedbackError = true;
                  this.sessionTimeout.checkSession(error);
                  if ( error.json().message === null || error.json().message === undefined || error.json().message === "" ) {
                      this.errorMessage = "Feedback could not be fetched";
                  } else {
                      this.errorMessage = error.json().message;
                  }
              });
        }

    }

    public seeMore( userId: string, category: string, timestamp: string, comments: string ) {
        this.selectedFeedback = new FeedbackModal();
        this.selectedFeedback.userId = userId;
        this.selectedFeedback.category = category;
        this.selectedFeedback.timestamp = timestamp;
        this.selectedFeedback.comments = comments;
    }

    public clearData() {
        this.feedbackInfo = new FeedbackModal();
        this.feedbackInfo.comments = "";
        this.feedbackInfo.category = "suggestion";
        this.others = "";
        this.uploadedFBFiles = [];
        this.globalservice.validation = false;
        this.globalservice.reload = false;
        if ( this.globalservice.allFeedback) {
          this.showFeedbacks();
        }
    }

    public ngOnDestroy() {
      this.globalservice.allFeedback = false;
    }

    public feed() {
      this.globalservice.validation = true;
    }

    public downloadAttachment( fileName: string ) {
        let url = this.globalservice.baseURL + this.publicConfiguration.downloadFeedback + fileName + "/";
        window.open( url, "_blank" );
    }
}
