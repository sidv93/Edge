/* tslint:disable:no-unused-variable */
import { DebugElement } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

import { TelcoSignupComponent } from "./telco-signup.component";

describe("TelcoSignupComponent", () => {
  let component: TelcoSignupComponent;
  let fixture: ComponentFixture<TelcoSignupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TelcoSignupComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TelcoSignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
