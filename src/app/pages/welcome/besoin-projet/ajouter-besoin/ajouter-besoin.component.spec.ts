import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterBesoinComponent } from './ajouter-besoin.component';

describe('AjouterBesoinComponent', () => {
  let component: AjouterBesoinComponent;
  let fixture: ComponentFixture<AjouterBesoinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AjouterBesoinComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AjouterBesoinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
