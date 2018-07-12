import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  // templateUrl: './app.component.html',
 template: ` <div style="height: 100%;" *ngIf="myValue==0">
      <app-login [counterValue]="myValue" (counterChange)="myValueChange($event);"></app-login>
      <router-outlet></router-outlet>
    </div>
    <div *ngIf="myValue==1">
      <router-outlet><app-main-page></app-main-page></router-outlet>
      </div>
      <div *ngIf="myValue==2">
	  <app-sign-up [counterValue]="myValue" (counterChange)="myValueChange($event);"></app-sign-up>
          <router-outlet></router-outlet>
        </div>
`,
})
export class AppComponent {
  public myValue: number = 0;
  public myValueChange(event) {
      this.myValue = event.value;
  }

}
