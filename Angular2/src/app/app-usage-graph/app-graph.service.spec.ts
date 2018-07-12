/* tslint:disable:no-unused-variable */

import { async, inject, TestBed } from "@angular/core/testing";
import { AppGraphService } from "./app-graph.service";

describe("AppGraphService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppGraphService],
    });
  });

  it("should ...", inject([AppGraphService], (service: AppGraphService) => {
    expect(service).toBeTruthy();
  }));
});
