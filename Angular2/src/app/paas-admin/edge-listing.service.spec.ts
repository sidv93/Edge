/* tslint:disable:no-unused-variable */

import { async, inject, TestBed } from "@angular/core/testing";
import { EdgeListingService } from "./edge-listing.service";

describe("EdgeListingService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EdgeListingService],
    });
  });

  it("should ...", inject([EdgeListingService], (service: EdgeListingService) => {
    expect(service).toBeTruthy();
  }));
});
