import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierRoleComponent } from './modifier-role.component';

describe('ModifierRoleComponent', () => {
  let component: ModifierRoleComponent;
  let fixture: ComponentFixture<ModifierRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModifierRoleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModifierRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
