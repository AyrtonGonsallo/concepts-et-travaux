import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierEquipementsTacheComponent } from './modifier-equipements-tache.component';

describe('ModifierEquipementsTacheComponent', () => {
  let component: ModifierEquipementsTacheComponent;
  let fixture: ComponentFixture<ModifierEquipementsTacheComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModifierEquipementsTacheComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModifierEquipementsTacheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
