import { TestBed } from '@angular/core/testing';

import { ColourHistoryService } from './colour-history.service';

describe('ColourHistoryService', () => {
  let service: ColourHistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ColourHistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
