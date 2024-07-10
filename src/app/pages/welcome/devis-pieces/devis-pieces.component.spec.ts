import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevisPiecesComponent } from './devis-pieces.component';

describe('DevisPiecesComponent', () => {
  let component: DevisPiecesComponent;
  let fixture: ComponentFixture<DevisPiecesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DevisPiecesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DevisPiecesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
