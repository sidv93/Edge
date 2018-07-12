/* tslint:disable:no-unused-variable */
import { DebugElement } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

import { EdgeComponent } from "./edge.component";

describe("EdgeComponent", () => {
  let component: EdgeComponent;
  let fixture: ComponentFixture<EdgeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EdgeComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EdgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
