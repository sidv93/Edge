/* tslint:disable:no-unused-variable */
import { DebugElement } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

import { AppUsageGraphComponent } from "./app-usage-graph.component";

describe("AppUsageGraphComponent", () => {
  let component: AppUsageGraphComponent;
  let fixture: ComponentFixture<AppUsageGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppUsageGraphComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppUsageGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
