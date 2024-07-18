import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierGammeComponent } from './modifier-gamme.component';

describe('ModifierGammeComponent', () => {
  let component: ModifierGammeComponent;
  let fixture: ComponentFixture<ModifierGammeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModifierGammeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModifierGammeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
