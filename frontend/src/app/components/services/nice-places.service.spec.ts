import { TestBed } from '@angular/core/testing';

import { NicePlacesService } from './nice-places.service';

describe('NicePlacesService', () => {
  let service: NicePlacesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NicePlacesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
