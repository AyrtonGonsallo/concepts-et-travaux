import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterPieceComponent } from './ajouter-piece.component';

describe('AjouterPieceComponent', () => {
  let component: AjouterPieceComponent;
  let fixture: ComponentFixture<AjouterPieceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AjouterPieceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AjouterPieceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
