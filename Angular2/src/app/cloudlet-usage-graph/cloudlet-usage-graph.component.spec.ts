/* tslint:disable:no-unused-variable */
import { DebugElement } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

import { CloudletUsageGraphComponent } from "./cloudlet-usage-graph.component";

describe("CloudletUsageGraphComponent", () => {
  let component: CloudletUsageGraphComponent;
  let fixture: ComponentFixture<CloudletUsageGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CloudletUsageGraphComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CloudletUsageGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
