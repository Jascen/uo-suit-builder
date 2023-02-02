import { TestBed } from '@angular/core/testing';

import { SuitBuilderService } from './suit-builder.service';

describe('SuitBuilderService', () => {
  let service: SuitBuilderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SuitBuilderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
