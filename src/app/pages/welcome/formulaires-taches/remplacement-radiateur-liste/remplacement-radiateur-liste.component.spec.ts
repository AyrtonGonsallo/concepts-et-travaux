import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemplacementRadiateurListeComponent } from './remplacement-radiateur-liste.component';

describe('RemplacementRadiateurListeComponent', () => {
  let component: RemplacementRadiateurListeComponent;
  let fixture: ComponentFixture<RemplacementRadiateurListeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RemplacementRadiateurListeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RemplacementRadiateurListeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
