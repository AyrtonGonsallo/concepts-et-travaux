import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterParametreComponent } from './ajouter-parametre.component';

describe('AjouterParametreComponent', () => {
  let component: AjouterParametreComponent;
  let fixture: ComponentFixture<AjouterParametreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AjouterParametreComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AjouterParametreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
