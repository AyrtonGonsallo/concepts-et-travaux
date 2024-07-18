import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierTacheGeneraleComponent } from './modifier-tache-generale.component';

describe('ModifierTacheGeneraleComponent', () => {
  let component: ModifierTacheGeneraleComponent;
  let fixture: ComponentFixture<ModifierTacheGeneraleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModifierTacheGeneraleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModifierTacheGeneraleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
