import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemolitionCloisonsCalculComponent } from './demolition-cloisons-calcul.component';

describe('DemolitionCloisonsCalculComponent', () => {
  let component: DemolitionCloisonsCalculComponent;
  let fixture: ComponentFixture<DemolitionCloisonsCalculComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DemolitionCloisonsCalculComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DemolitionCloisonsCalculComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
