import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierStyleComponent } from './modifier-style.component';

describe('ModifierStyleComponent', () => {
  let component: ModifierStyleComponent;
  let fixture: ComponentFixture<ModifierStyleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModifierStyleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModifierStyleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
