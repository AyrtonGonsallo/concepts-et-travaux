import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrestationDetailsComponent } from './prestation-details.component';

describe('PrestationDetailsComponent', () => {
  let component: PrestationDetailsComponent;
  let fixture: ComponentFixture<PrestationDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrestationDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PrestationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
