import { TestBed } from '@angular/core/testing';

import { CanvasOverwriterService } from './canvas-overwriter.service';

describe('CanvasOverwriterService', () => {
  let service: CanvasOverwriterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CanvasOverwriterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
