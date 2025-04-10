import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenovationElectriquePartielleListeComponent } from './renovation-electrique-partielle-liste.component';

describe('RenovationElectriquePartielleListeComponent', () => {
  let component: RenovationElectriquePartielleListeComponent;
  let fixture: ComponentFixture<RenovationElectriquePartielleListeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RenovationElectriquePartielleListeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RenovationElectriquePartielleListeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
