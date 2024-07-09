import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelesEquipementsComponent } from './modeles-equipements.component';

describe('ModelesEquipementsComponent', () => {
  let component: ModelesEquipementsComponent;
  let fixture: ComponentFixture<ModelesEquipementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModelesEquipementsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModelesEquipementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
