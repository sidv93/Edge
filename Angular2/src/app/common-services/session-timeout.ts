import { Configuration } from '../app.constants';
import { Injectable } from "@angular/core";

@Injectable()
export class SessionTimeout {

    constructor(private publicConfiguration: Configuration) {
    }

    public checkSession(error : any) {

        if( error.json().code.toLowerCase() === "session-timeout") {
          alert(this.publicConfiguration.timeoutMsg);
          window.location.reload(false);
        }

        if( error.json().code.toLowerCase() === "invalid-client") {
          alert(this.publicConfiguration.invalidAccess);
          window.location.reload(false);
        }
    }
}
