import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemplacementRadiateurCalculComponent } from './remplacement-radiateur-calcul.component';

describe('RemplacementRadiateurCalculComponent', () => {
  let component: RemplacementRadiateurCalculComponent;
  let fixture: ComponentFixture<RemplacementRadiateurCalculComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RemplacementRadiateurCalculComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RemplacementRadiateurCalculComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
