import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestsFormulesComponent } from './tests-formules.component';

describe('TestsFormulesComponent', () => {
  let component: TestsFormulesComponent;
  let fixture: ComponentFixture<TestsFormulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestsFormulesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TestsFormulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
