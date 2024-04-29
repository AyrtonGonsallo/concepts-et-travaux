import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterRoleComponent } from './ajouter-role.component';

describe('AjouterRoleComponent', () => {
  let component: AjouterRoleComponent;
  let fixture: ComponentFixture<AjouterRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AjouterRoleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AjouterRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
