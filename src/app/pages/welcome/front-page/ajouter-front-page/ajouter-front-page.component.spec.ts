import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterFrontPageComponent } from './ajouter-front-page.component';

describe('AjouterFrontPageComponent', () => {
  let component: AjouterFrontPageComponent;
  let fixture: ComponentFixture<AjouterFrontPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AjouterFrontPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AjouterFrontPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
