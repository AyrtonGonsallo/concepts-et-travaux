import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemplacementDePortesListeComponent } from './remplacement-de-portes-liste.component';

describe('RemplacementDePortesListeComponent', () => {
  let component: RemplacementDePortesListeComponent;
  let fixture: ComponentFixture<RemplacementDePortesListeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RemplacementDePortesListeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RemplacementDePortesListeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
