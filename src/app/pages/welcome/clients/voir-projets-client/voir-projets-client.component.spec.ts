import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoirProjetsClientComponent } from './voir-projets-client.component';

describe('VoirProjetsClientComponent', () => {
  let component: VoirProjetsClientComponent;
  let fixture: ComponentFixture<VoirProjetsClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VoirProjetsClientComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VoirProjetsClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
