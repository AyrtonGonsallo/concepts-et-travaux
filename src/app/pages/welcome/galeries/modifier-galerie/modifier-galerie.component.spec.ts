import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierGalerieComponent } from './modifier-galerie.component';

describe('ModifierGalerieComponent', () => {
  let component: ModifierGalerieComponent;
  let fixture: ComponentFixture<ModifierGalerieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModifierGalerieComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModifierGalerieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
