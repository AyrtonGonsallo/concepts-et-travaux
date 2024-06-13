import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriePieceComponent } from './categorie-piece.component';

describe('CategoriePieceComponent', () => {
  let component: CategoriePieceComponent;
  let fixture: ComponentFixture<CategoriePieceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CategoriePieceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CategoriePieceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
