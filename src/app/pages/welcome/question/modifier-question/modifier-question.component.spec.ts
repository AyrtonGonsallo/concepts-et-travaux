import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierQuestionComponent } from './modifier-question.component';

describe('ModifierQuestionComponent', () => {
  let component: ModifierQuestionComponent;
  let fixture: ComponentFixture<ModifierQuestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModifierQuestionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModifierQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
