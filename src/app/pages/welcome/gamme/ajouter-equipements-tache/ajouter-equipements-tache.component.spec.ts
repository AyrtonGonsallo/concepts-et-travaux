import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterEquipementsTacheComponent } from './ajouter-equipements-tache.component';

describe('AjouterEquipementsTacheComponent', () => {
  let component: AjouterEquipementsTacheComponent;
  let fixture: ComponentFixture<AjouterEquipementsTacheComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AjouterEquipementsTacheComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AjouterEquipementsTacheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
