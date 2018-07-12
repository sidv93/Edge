/* tslint:disable:no-unused-variable */

import { async, inject, TestBed } from "@angular/core/testing";
import { ProfileServiceService } from "./profile-service.service";

describe("ProfileServiceService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProfileServiceService],
    });
  });

  it("should ...", inject([ProfileServiceService], (service: ProfileServiceService) => {
    expect(service).toBeTruthy();
  }));
});
