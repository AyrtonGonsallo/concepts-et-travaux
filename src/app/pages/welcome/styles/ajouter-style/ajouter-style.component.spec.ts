import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterStyleComponent } from './ajouter-style.component';

describe('AjouterStyleComponent', () => {
  let component: AjouterStyleComponent;
  let fixture: ComponentFixture<AjouterStyleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AjouterStyleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AjouterStyleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
