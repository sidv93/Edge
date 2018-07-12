/* tslint:disable:no-unused-variable */
import { DebugElement } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

import { CloudletComponent } from "./cloudlet.component";

describe("CloudletComponent", () => {
  let component: CloudletComponent;
  let fixture: ComponentFixture<CloudletComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CloudletComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CloudletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
