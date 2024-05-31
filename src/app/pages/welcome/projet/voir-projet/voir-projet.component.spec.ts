import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoirProjetComponent } from './voir-projet.component';

describe('VoirProjetComponent', () => {
  let component: VoirProjetComponent;
  let fixture: ComponentFixture<VoirProjetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VoirProjetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VoirProjetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
