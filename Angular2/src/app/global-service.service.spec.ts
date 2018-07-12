/* tslint:disable:no-unused-variable */

import { async, inject, TestBed } from "@angular/core/testing";
import { GlobalServiceService } from "./global-service.service";

describe("GlobalServiceService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GlobalServiceService],
    });
  });

  it("should ...", inject([GlobalServiceService], (service: GlobalServiceService) => {
    expect(service).toBeTruthy();
  }));
});
