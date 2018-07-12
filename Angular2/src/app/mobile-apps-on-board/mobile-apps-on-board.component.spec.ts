/* tslint:disable:no-unused-variable */
import { DebugElement } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

import { MobileAppsOnBoardComponent } from "./mobile-apps-on-board.component";

describe("MobileAppsOnBoardComponent", () => {
  let component: MobileAppsOnBoardComponent;
  let fixture: ComponentFixture<MobileAppsOnBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobileAppsOnBoardComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileAppsOnBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
