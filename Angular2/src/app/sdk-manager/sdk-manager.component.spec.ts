/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SdkManagerComponent } from './sdk-manager.component';

describe('SdkManagerComponent', () => {
  let component: SdkManagerComponent;
  let fixture: ComponentFixture<SdkManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SdkManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SdkManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
