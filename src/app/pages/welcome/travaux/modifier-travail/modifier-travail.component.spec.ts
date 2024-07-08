import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierTravailComponent } from './modifier-travail.component';

describe('ModifierTravailComponent', () => {
  let component: ModifierTravailComponent;
  let fixture: ComponentFixture<ModifierTravailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModifierTravailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModifierTravailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
