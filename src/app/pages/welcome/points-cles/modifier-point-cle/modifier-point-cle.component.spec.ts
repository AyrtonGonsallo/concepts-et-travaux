import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierPointCleComponent } from './modifier-point-cle.component';

describe('ModifierPointCleComponent', () => {
  let component: ModifierPointCleComponent;
  let fixture: ComponentFixture<ModifierPointCleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModifierPointCleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModifierPointCleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
