/* tslint:disable:no-unused-variable */

import { async, inject, TestBed } from "@angular/core/testing";
import { MicroServiceGraphService } from "./micro-service-graph.service";

describe("MicroServiceGraphService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MicroServiceGraphService],
    });
  });

  it("should ...", inject([MicroServiceGraphService], (service: MicroServiceGraphService) => {
    expect(service).toBeTruthy();
  }));
});
