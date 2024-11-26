import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierEtapeComponent } from './modifier-etape.component';

describe('ModifierEtapeComponent', () => {
  let component: ModifierEtapeComponent;
  let fixture: ComponentFixture<ModifierEtapeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModifierEtapeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModifierEtapeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
