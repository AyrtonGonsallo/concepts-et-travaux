import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoseEquipementsCuisineCalculComponent } from './pose-equipements-cuisine-calcul.component';

describe('PoseEquipementsCuisineCalculComponent', () => {
  let component: PoseEquipementsCuisineCalculComponent;
  let fixture: ComponentFixture<PoseEquipementsCuisineCalculComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoseEquipementsCuisineCalculComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PoseEquipementsCuisineCalculComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
