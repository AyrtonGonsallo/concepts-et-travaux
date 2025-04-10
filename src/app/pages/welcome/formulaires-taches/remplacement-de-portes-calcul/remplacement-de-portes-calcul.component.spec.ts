import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemplacementDePortesCalculComponent } from './remplacement-de-portes-calcul.component';

describe('RemplacementDePortesCalculComponent', () => {
  let component: RemplacementDePortesCalculComponent;
  let fixture: ComponentFixture<RemplacementDePortesCalculComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RemplacementDePortesCalculComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RemplacementDePortesCalculComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
