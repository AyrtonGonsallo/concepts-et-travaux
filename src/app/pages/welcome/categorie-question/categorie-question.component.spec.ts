import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorieQuestionComponent } from './categorie-question.component';

describe('CategorieQuestionComponent', () => {
  let component: CategorieQuestionComponent;
  let fixture: ComponentFixture<CategorieQuestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CategorieQuestionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CategorieQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
