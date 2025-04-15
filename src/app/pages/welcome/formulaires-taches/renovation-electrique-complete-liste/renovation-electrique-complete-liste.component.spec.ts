import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenovationElectriqueCompleteListeComponent } from './renovation-electrique-complete-liste.component';

describe('RenovationElectriqueCompleteListeComponent', () => {
  let component: RenovationElectriqueCompleteListeComponent;
  let fixture: ComponentFixture<RenovationElectriqueCompleteListeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RenovationElectriqueCompleteListeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RenovationElectriqueCompleteListeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
