import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenovationElectriqueCompleteCalculComponent } from './renovation-electrique-complete-calcul.component';

describe('RenovationElectriqueCompleteCalculComponent', () => {
  let component: RenovationElectriqueCompleteCalculComponent;
  let fixture: ComponentFixture<RenovationElectriqueCompleteCalculComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RenovationElectriqueCompleteCalculComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RenovationElectriqueCompleteCalculComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
