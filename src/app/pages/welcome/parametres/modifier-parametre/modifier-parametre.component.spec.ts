import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierParametreComponent } from './modifier-parametre.component';

describe('ModifierParametreComponent', () => {
  let component: ModifierParametreComponent;
  let fixture: ComponentFixture<ModifierParametreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModifierParametreComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModifierParametreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
