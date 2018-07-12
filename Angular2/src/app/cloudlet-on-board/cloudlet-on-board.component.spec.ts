/* tslint:disable:no-unused-variable */
import { DebugElement } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

import { CloudletOnBoardComponent } from "./cloudlet-on-board.component";

describe("CloudletOnBoardComponent", () => {
  let component: CloudletOnBoardComponent;
  let fixture: ComponentFixture<CloudletOnBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CloudletOnBoardComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CloudletOnBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
