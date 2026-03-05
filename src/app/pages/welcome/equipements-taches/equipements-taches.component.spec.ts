import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipementsTachesComponent } from './equipements-taches.component';

describe('EquipementsTachesComponent', () => {
  let component: EquipementsTachesComponent;
  let fixture: ComponentFixture<EquipementsTachesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EquipementsTachesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EquipementsTachesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
