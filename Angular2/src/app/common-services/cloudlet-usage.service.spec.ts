/* tslint:disable:no-unused-variable */

import { async, inject, TestBed } from "@angular/core/testing";
import { CloudletUsageService } from "./cloudlet-usage.service";

describe("CloudletUsageService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CloudletUsageService],
    });
  });

  it("should ...", inject([CloudletUsageService], (service: CloudletUsageService) => {
    expect(service).toBeTruthy();
  }));
});
