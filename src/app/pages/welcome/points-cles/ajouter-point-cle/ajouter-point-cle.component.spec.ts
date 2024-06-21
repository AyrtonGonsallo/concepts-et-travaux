import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterPointCleComponent } from './ajouter-point-cle.component';

describe('AjouterPointCleComponent', () => {
  let component: AjouterPointCleComponent;
  let fixture: ComponentFixture<AjouterPointCleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AjouterPointCleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AjouterPointCleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
