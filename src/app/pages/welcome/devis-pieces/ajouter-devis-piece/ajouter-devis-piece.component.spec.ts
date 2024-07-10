import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterDevisPieceComponent } from './ajouter-devis-piece.component';

describe('AjouterDevisPieceComponent', () => {
  let component: AjouterDevisPieceComponent;
  let fixture: ComponentFixture<AjouterDevisPieceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AjouterDevisPieceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AjouterDevisPieceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
