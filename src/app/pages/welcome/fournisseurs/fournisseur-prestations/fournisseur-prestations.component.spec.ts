import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FournisseurPrestationsComponent } from './fournisseur-prestations.component';

describe('FournisseurPrestationsComponent', () => {
  let component: FournisseurPrestationsComponent;
  let fixture: ComponentFixture<FournisseurPrestationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FournisseurPrestationsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FournisseurPrestationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
