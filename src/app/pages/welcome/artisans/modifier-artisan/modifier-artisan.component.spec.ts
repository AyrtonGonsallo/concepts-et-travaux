import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierArtisanComponent } from './modifier-artisan.component';

describe('ModifierArtisanComponent', () => {
  let component: ModifierArtisanComponent;
  let fixture: ComponentFixture<ModifierArtisanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModifierArtisanComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModifierArtisanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
