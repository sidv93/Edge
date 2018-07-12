/* tslint:disable:no-unused-variable */

import { async, inject, TestBed } from "@angular/core/testing";
import { EdgeOnboardService } from "./edge-onboard.service";

describe("EdgeOnboardService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EdgeOnboardService],
    });
  });

  it("should ...", inject([EdgeOnboardService], (service: EdgeOnboardService) => {
    expect(service).toBeTruthy();
  }));
});
