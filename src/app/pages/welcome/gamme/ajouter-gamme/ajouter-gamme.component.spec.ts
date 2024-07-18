import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterGammeComponent } from './ajouter-gamme.component';

describe('AjouterGammeComponent', () => {
  let component: AjouterGammeComponent;
  let fixture: ComponentFixture<AjouterGammeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AjouterGammeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AjouterGammeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
