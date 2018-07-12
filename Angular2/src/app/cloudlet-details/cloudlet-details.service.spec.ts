/* tslint:disable:no-unused-variable */

import { async, inject, TestBed } from "@angular/core/testing";
import { CloudletDetailsService } from "./cloudlet-details.service";

describe("CloudletDetailsService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CloudletDetailsService],
    });
  });

  it("should ...", inject([CloudletDetailsService], (service: CloudletDetailsService) => {
    expect(service).toBeTruthy();
  }));
});
