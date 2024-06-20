import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierBesoinComponent } from './modifier-besoin.component';

describe('ModifierBesoinComponent', () => {
  let component: ModifierBesoinComponent;
  let fixture: ComponentFixture<ModifierBesoinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModifierBesoinComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModifierBesoinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
