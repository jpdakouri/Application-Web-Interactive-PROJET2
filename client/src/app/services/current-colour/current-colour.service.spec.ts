import { TestBed } from '@angular/core/testing';

import { CurrentColourService } from './current-colour.service';

describe('CurrentColourService', () => {
  let service: CurrentColourService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CurrentColourService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
