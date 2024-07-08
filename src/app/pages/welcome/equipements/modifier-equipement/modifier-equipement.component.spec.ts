import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierEquipementComponent } from './modifier-equipement.component';

describe('ModifierEquipementComponent', () => {
  let component: ModifierEquipementComponent;
  let fixture: ComponentFixture<ModifierEquipementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModifierEquipementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModifierEquipementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
