import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterTravailComponent } from './ajouter-travail.component';

describe('AjouterTravailComponent', () => {
  let component: AjouterTravailComponent;
  let fixture: ComponentFixture<AjouterTravailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AjouterTravailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AjouterTravailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
