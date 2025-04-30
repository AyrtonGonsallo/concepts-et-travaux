import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoirDevisClientsComponent } from './voir-devis-clients.component';

describe('VoirDevisClientsComponent', () => {
  let component: VoirDevisClientsComponent;
  let fixture: ComponentFixture<VoirDevisClientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VoirDevisClientsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VoirDevisClientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
