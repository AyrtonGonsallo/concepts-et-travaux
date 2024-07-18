import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TachesGeneralesComponent } from './taches-generales.component';

describe('TachesGeneralesComponent', () => {
  let component: TachesGeneralesComponent;
  let fixture: ComponentFixture<TachesGeneralesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TachesGeneralesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TachesGeneralesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
