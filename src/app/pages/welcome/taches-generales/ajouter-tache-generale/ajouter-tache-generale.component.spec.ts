import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterTacheGeneraleComponent } from './ajouter-tache-generale.component';

describe('AjouterTacheGeneraleComponent', () => {
  let component: AjouterTacheGeneraleComponent;
  let fixture: ComponentFixture<AjouterTacheGeneraleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AjouterTacheGeneraleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AjouterTacheGeneraleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
