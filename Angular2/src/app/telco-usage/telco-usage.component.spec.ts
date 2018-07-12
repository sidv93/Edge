/* tslint:disable:no-unused-variable */
import { DebugElement } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

import { TelcoUsageComponent } from "./telco-usage.component";

describe("TelcoUsageComponent", () => {
  let component: TelcoUsageComponent;
  let fixture: ComponentFixture<TelcoUsageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TelcoUsageComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TelcoUsageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
