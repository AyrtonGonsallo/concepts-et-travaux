import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierAutorisationComponent } from './modifier-autorisation.component';

describe('ModifierAutorisationComponent', () => {
  let component: ModifierAutorisationComponent;
  let fixture: ComponentFixture<ModifierAutorisationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModifierAutorisationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModifierAutorisationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
