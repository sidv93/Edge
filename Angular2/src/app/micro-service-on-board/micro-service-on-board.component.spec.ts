/* tslint:disable:no-unused-variable */
import { DebugElement } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

import { MicroServiceOnBoardComponent } from "./micro-service-on-board.component";

describe("MicroServiceOnBoardComponent", () => {
  let component: MicroServiceOnBoardComponent;
  let fixture: ComponentFixture<MicroServiceOnBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MicroServiceOnBoardComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MicroServiceOnBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
