import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorieArtisanComponent } from './categorie-artisan.component';

describe('CategorieArtisanComponent', () => {
  let component: CategorieArtisanComponent;
  let fixture: ComponentFixture<CategorieArtisanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CategorieArtisanComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CategorieArtisanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
