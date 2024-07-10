import { TestBed } from '@angular/core/testing';

import { CalculDevisService } from './calcul-devis.service';

describe('CalculDevisService', () => {
  let service: CalculDevisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalculDevisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
