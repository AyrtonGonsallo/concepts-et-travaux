import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BesoinProjetComponent } from './besoin-projet.component';

describe('BesoinProjetComponent', () => {
  let component: BesoinProjetComponent;
  let fixture: ComponentFixture<BesoinProjetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BesoinProjetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BesoinProjetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
