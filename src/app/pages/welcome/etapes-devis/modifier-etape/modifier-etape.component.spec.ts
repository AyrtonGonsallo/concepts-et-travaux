import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierEtapeDevisComponent } from './modifier-etape.component';

describe('ModifierEtapeDevisComponent', () => {
  let component: ModifierEtapeDevisComponent;
  let fixture: ComponentFixture<ModifierEtapeDevisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModifierEtapeDevisComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModifierEtapeDevisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
