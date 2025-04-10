import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenovationElectriquePartielleCalculComponent } from './renovation-electrique-partielle-calcul.component';

describe('RenovationElectriquePartielleCalculComponent', () => {
  let component: RenovationElectriquePartielleCalculComponent;
  let fixture: ComponentFixture<RenovationElectriquePartielleCalculComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RenovationElectriquePartielleCalculComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RenovationElectriquePartielleCalculComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
