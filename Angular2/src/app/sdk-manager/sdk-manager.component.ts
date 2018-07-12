import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { GlobalServiceService } from "../global-service.service";
import { Configuration } from "../app.constants";
import { InnerSDK, SDK, VersionCheck } from "../common-services/sdk";
import { SDKManagerService } from "./sdk-manager.service";
import { SessionTimeout } from "../common-services/session-timeout";

@Component( {
    selector: "app-sdk-manager",
    templateUrl: "./sdk-manager.component.html",
    providers: [ SDKManagerService ],
} )
export class SdkManagerComponent implements OnInit {

    public sdkDownload: boolean = true;
    public sdkUpload: boolean = false;
    public languages: string[] = [];
    public sdkObj = new InnerSDK();
    public attachment: string;
    public errorMessage: string;
    public attachmentFile: File;
    public lang: string = "";
    public version: string = "";
    public deleteSuccess: boolean = false;
    public deleteFailure: boolean = false;
    public deleteConfirm: boolean = false;
    public fileFlag: string = "untouched";
    public uploadSuccess: boolean = false;
    public uploadFailure: boolean = false;
    public sdksBkp = [];
    public olderSDKs: SDK[] = [];
    public olderSDK: SDK[] = [];
    public latestSDKs: InnerSDK[] = [];
    public versionArray: VersionCheck[][];
    public sdkError: boolean = false;
    public formatFlag: string = "untouched";
    public noOlderVersions: boolean = true;
    public validation: boolean = true;
    public sdkDescription: string= "";
    public identifier: string;

    constructor( private globalservice: GlobalServiceService,
        private configuration: Configuration,
        private sdkManagerService: SDKManagerService,
        private route: Router,
        private sessionTimeout: SessionTimeout ) {
          this.lang = this.configuration.languages[0];
          this.versionArray = [];
    }

    public ngOnInit() {
        this.initial();
    }

    public initial() {
        this.getSDK();
    }

    public getSDK() {
        this.latestSDKs = [];
        this.olderSDKs = [];
        this.sdksBkp = [];
        let sampleSDK: SDK;
        this.sdkManagerService.getSDK().subscribe(
            ( data ) => {
                this.sdksBkp = data;
                for ( let bkp of this.sdksBkp) {
                    if ( this.checkUniqueness( bkp.sdkLanguage ) ) {
                        sampleSDK = new SDK();
                        sampleSDK.language = bkp.sdkLanguage;
                        sampleSDK.sdks.push( bkp );
                        this.olderSDKs.push( sampleSDK );
                    } else {
                        for ( let oldsdk of this.olderSDKs ) {
                            if ( bkp.sdkLanguage.toLowerCase() === oldsdk.language.toLowerCase() ) {
                                oldsdk.sdks.push( bkp );
                            }
                        }
                    }
                }
                let version: string = "";
                let maxVersion: VersionCheck[] = [];
                for ( let i = 0; i < this.olderSDKs.length; i++ ) {
                    this.versionArray[i] = [];
                    for ( let j = 0; j < this.olderSDKs[i].sdks.length; j++ ) {
                        this.versionArray[i][j] = new VersionCheck();
                        if (this.olderSDKs[i].sdks[j].sdkVersion[0].toLowerCase() === "v") {
                          version = this.olderSDKs[i].sdks[j].sdkVersion.substring( 1 );
                        } else {
                          version = this.olderSDKs[i].sdks[j].sdkVersion;
                        }
                        this.olderSDKs[i].sdks[j].sdkVersion = version;
                        this.versionArray[i][j].version = +version;
                        this.versionArray[i][j].index = j;
                        this.versionArray[i][j].langIndex = i;
                    }
                }

                for ( let i = 0; i < this.versionArray.length; i++ ) {
                    maxVersion[i] = this.versionArray[i][0];
                    for ( let j = 0; j < this.versionArray[i].length; j++ ) {
                        if ( this.versionArray[i][j].version > maxVersion[i].version ) {
                            maxVersion[i] = this.versionArray[i][j];
                        }
                    }
                }

                for ( let max of maxVersion) {
                    this.latestSDKs.push( this.olderSDKs[max.langIndex].sdks[max.index] );
                }
                this.latestSDKs.sort( function( a, b ) {
                    let nameA = a.sdkVersion;
                    let nameB = b.sdkVersion;
                    if ( nameA > nameB ) {
                      return -1;
                    }
                    if ( nameA < nameB ) {
                      return 1;
                    }
                    return 0;
                } );

                for ( let max of maxVersion) {
                    this.olderSDKs[max.langIndex].sdks.splice( max.index, 1 );
                }

                let ver: VersionCheck[] = [];

                for ( let i = 0; i < this.olderSDKs.length; i++ ) {
                    ver = [];
                    for ( let j = 0; j < this.olderSDKs[i].sdks.length; j++ ) {
                        ver[j] = new VersionCheck();
                        ver[j].langIndex = i;
                        ver[j].index = j;
                        ver[j].version = +this.olderSDKs[i].sdks[j].sdkVersion;
                    }
                    ver.sort( function( a, b ) {
                        let nameA = a.version;
                        let nameB = b.version;
                        if ( nameA > nameB ) {
                          return -1;
                        }
                        if ( nameA < nameB ) {
                          return 1;
                        }
                        return 0;
                    } );
                    this.olderSDK[i] = new SDK();
                    this.olderSDK[i].language = this.olderSDKs[i].language;
                    for ( let j = 0; j < ver.length; j++ ) {
                        this.olderSDK[i].sdks.push( this.olderSDKs[ver[j].langIndex].sdks[ver[j].index] );
                    }
                }
                for (let old of this.olderSDK) {
                  if( old.sdks.length > 0) {
                    this.noOlderVersions = false;
                    break;
                  }
                }
            },
            ( error ) => {
                this.sdkError = true;
                this.sessionTimeout.checkSession(error);
                if ( error.json().message === null || error.json().message === undefined ||
                    error.json().message === "" ) {
                    this.errorMessage = "SDK list could not be fetched";
                } else {
                    this.errorMessage = error.json().message;
                }
            } );
    }

    public checkUniqueness( language: string ) {
        for ( let old of this.olderSDKs) {
            if ( old.language.toLowerCase() === language.toLowerCase() ) {
                return false;
            }
        }
        return true;
    }

    public downloadSDK(name: string , identifier: string) {
        let url = this.globalservice.baseURL + this.configuration.downloadSDK + name + "/" + identifier + "/";
        window.open( url, "_blank" );
    }

    public dToU() {
        this.uploadSuccess = false;
        this.uploadFailure = false;
        this.lang = this.configuration.languages[0];
        this.version = "";
        this.attachment = "";
        this.formatFlag = "untouched";
        this.validation = false;
        this.sdkDescription = "";
    }

    public changeVersion() {
      this.validation = true;
    }

    public onChangeTemplate( event: EventTarget ) {
        let file: File;
        let img = new Image();
        let eventObj: MSInputMethodContext = <MSInputMethodContext> event;
        let target: HTMLInputElement = <HTMLInputElement> eventObj.target;
        let files: FileList = target.files;
        let extn = "";
        file = files[0];
        this.attachmentFile = files[0];
        let fileName = "";
        fileName = this.attachmentFile.name;
        extn = fileName.substr( fileName.lastIndexOf( "." ) + 1 );
        if ( this.configuration.sdkFormats.indexOf( extn ) === -1 ) {
            this.formatFlag = "invalid";
        } else {
            this.formatFlag = "valid";
        }
        let myReader: FileReader = new FileReader();

        myReader.onloadend = ( e ) => {
            this.attachment = myReader.result;
        };
        myReader.readAsDataURL( file );
        myReader.onerror = function( error ) {
        };
    }

    public submitSDK() {
        this.sdkManagerService.uploadSDK( this.attachmentFile, this.lang, this.version, this.sdkDescription ).subscribe(
            ( data ) => {
                this.uploadSuccess = true;
                this.uploadFailure = false;
            },
            ( error ) => {
                this.uploadSuccess = false;
                this.uploadFailure = true;
                this.sessionTimeout.checkSession(error);
                if ( error.json().message === null || error.json().message === undefined ||
                    error.json().message === "" ) {
                    this.errorMessage = "SDK list could not be fetched";
                } else {
                    this.errorMessage = error.json().message;
                }
            } );
    }

    public deleteSDK() {
        this.sdkManagerService.deleteSDK( this.identifier ).subscribe(
            ( data ) => {
                this.deleteSuccess = true;
                this.deleteConfirm = false;
                this.deleteFailure = false;
            },
            ( error ) => {
                this.deleteSuccess = false;
                this.deleteFailure = true;
                this.deleteConfirm = false;
                this.sessionTimeout.checkSession(error);
                if ( error.json().message === null || error.json().message === undefined ||
                    error.json().message === "" ) {
                    this.errorMessage = "SDK list could not be fetched";
                } else {
                    this.errorMessage = error.json().message;
                }
            } );
    }

    public setDelete( identifier: string) {
        this.identifier = identifier;
        this.deleteConfirm = true;
    }

    public uploadFinish() {
        this.getSDK();
    }
}
