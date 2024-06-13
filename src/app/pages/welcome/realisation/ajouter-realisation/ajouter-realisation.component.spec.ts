import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterRealisationComponent } from './ajouter-realisation.component';

describe('AjouterRealisationComponent', () => {
  let component: AjouterRealisationComponent;
  let fixture: ComponentFixture<AjouterRealisationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AjouterRealisationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AjouterRealisationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
