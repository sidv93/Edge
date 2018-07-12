/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MobileAppDashboardService } from './mobile-app-dashboard.service';

describe('MobileAppDashboardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MobileAppDashboardService]
    });
  });

  it('should ...', inject([MobileAppDashboardService], (service: MobileAppDashboardService) => {
    expect(service).toBeTruthy();
  }));
});
