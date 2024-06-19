import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierRealisationComponent } from './modifier-realisation.component';

describe('ModifierRealisationComponent', () => {
  let component: ModifierRealisationComponent;
  let fixture: ComponentFixture<ModifierRealisationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModifierRealisationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModifierRealisationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
