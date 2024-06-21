import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PointsClesComponent } from './points-cles.component';

describe('PointsClesComponent', () => {
  let component: PointsClesComponent;
  let fixture: ComponentFixture<PointsClesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PointsClesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PointsClesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
