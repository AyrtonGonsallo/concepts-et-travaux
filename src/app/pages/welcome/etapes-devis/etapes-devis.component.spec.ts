import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EtapesDevisComponent } from './etapes-devis.component';

describe('EtapesDevisComponent', () => {
  let component: EtapesDevisComponent;
  let fixture: ComponentFixture<EtapesDevisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EtapesDevisComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EtapesDevisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
