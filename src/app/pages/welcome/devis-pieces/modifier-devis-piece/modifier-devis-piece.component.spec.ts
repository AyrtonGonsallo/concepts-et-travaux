import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierDevisPieceComponent } from './modifier-devis-piece.component';

describe('ModifierDevisPieceComponent', () => {
  let component: ModifierDevisPieceComponent;
  let fixture: ComponentFixture<ModifierDevisPieceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModifierDevisPieceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModifierDevisPieceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
