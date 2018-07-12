/* tslint:disable:no-unused-variable */

import { async, inject, TestBed } from "@angular/core/testing";
import { MicroServiceDetailsService } from "./micro-service-details.service";

describe("MicroServiceDetailsService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MicroServiceDetailsService],
    });
  });

  it("should ...", inject([MicroServiceDetailsService], (service: MicroServiceDetailsService) => {
    expect(service).toBeTruthy();
  }));
});
