import { TestBed } from '@angular/core/testing';

import { DatastreamService } from './datastream.service';

describe('DatastreamService', () => {
  let service: DatastreamService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatastreamService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
