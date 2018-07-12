/* tslint:disable:no-unused-variable */

import { async, inject, TestBed } from "@angular/core/testing";
import { CloudletListingService } from "./cloudlet-listing.service";

describe("CloudletListingService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CloudletListingService],
    });
  });

  it("should ...", inject([CloudletListingService], (service: CloudletListingService) => {
    expect(service).toBeTruthy();
  }));
});
