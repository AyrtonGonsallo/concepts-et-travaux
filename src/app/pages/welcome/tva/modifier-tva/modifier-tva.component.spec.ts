import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierTvaComponent } from './modifier-tva.component';

describe('ModifierTvaComponent', () => {
  let component: ModifierTvaComponent;
  let fixture: ComponentFixture<ModifierTvaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModifierTvaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModifierTvaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
