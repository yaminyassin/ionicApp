import { TestBed } from '@angular/core/testing';

import { RoutingPlaceService } from './routing-place.service';

describe('RoutingPlaceService', () => {
  let service: RoutingPlaceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoutingPlaceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
