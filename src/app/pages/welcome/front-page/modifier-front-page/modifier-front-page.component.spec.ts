import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierFrontPageComponent } from './modifier-front-page.component';

describe('ModifierFrontPageComponent', () => {
  let component: ModifierFrontPageComponent;
  let fixture: ComponentFixture<ModifierFrontPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModifierFrontPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModifierFrontPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
