import { TestBed } from '@angular/core/testing';

import { ApiConceptsEtTravauxService } from './api-concepts-et-travaux.service';

describe('ApiConceptsEtTravauxService', () => {
  let service: ApiConceptsEtTravauxService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiConceptsEtTravauxService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
