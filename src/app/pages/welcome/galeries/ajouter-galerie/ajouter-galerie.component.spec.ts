import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterGalerieComponent } from './ajouter-galerie.component';

describe('AjouterGalerieComponent', () => {
  let component: AjouterGalerieComponent;
  let fixture: ComponentFixture<AjouterGalerieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AjouterGalerieComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AjouterGalerieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
