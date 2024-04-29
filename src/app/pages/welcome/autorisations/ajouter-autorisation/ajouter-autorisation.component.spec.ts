import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterAutorisationComponent } from './ajouter-autorisation.component';

describe('AjouterAutorisationComponent', () => {
  let component: AjouterAutorisationComponent;
  let fixture: ComponentFixture<AjouterAutorisationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AjouterAutorisationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AjouterAutorisationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
