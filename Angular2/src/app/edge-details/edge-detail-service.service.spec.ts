/* tslint:disable:no-unused-variable */

import { async, inject, TestBed } from "@angular/core/testing";
import { EdgeDetailServiceService } from "./edge-detail-service.service";

describe("EdgeDetailServiceService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EdgeDetailServiceService],
    });
  });

  it("should ...", inject([EdgeDetailServiceService], (service: EdgeDetailServiceService) => {
    expect(service).toBeTruthy();
  }));
});
