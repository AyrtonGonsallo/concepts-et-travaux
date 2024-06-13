import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EtapesProjetComponent } from './etapes-projet.component';

describe('EtapesProjetComponent', () => {
  let component: EtapesProjetComponent;
  let fixture: ComponentFixture<EtapesProjetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EtapesProjetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EtapesProjetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
