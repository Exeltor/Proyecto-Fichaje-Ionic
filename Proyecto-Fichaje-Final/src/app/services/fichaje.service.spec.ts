import { TestBed } from '@angular/core/testing';

import { FichajeService } from './fichaje.service';

describe('FichajeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FichajeService = TestBed.get(FichajeService);
    expect(service).toBeTruthy();
  });
});
