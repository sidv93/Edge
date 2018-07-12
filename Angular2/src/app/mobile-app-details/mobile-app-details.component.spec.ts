/* tslint:disable:no-unused-variable */
import { DebugElement } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

import { MobileAppDetailsComponent } from "./mobile-app-details.component";

describe("MobileAppDetailsComponent", () => {
  let component: MobileAppDetailsComponent;
  let fixture: ComponentFixture<MobileAppDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobileAppDetailsComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileAppDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
