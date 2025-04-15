import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoseEquipementsCuisineListeComponent } from './pose-equipements-cuisine-liste.component';

describe('PoseEquipementsCuisineListeComponent', () => {
  let component: PoseEquipementsCuisineListeComponent;
  let fixture: ComponentFixture<PoseEquipementsCuisineListeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoseEquipementsCuisineListeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PoseEquipementsCuisineListeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
