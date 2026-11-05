import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtisanPrestationsComponent } from './artisan-prestations.component';

describe('ArtisanPrestationsComponent', () => {
  let component: ArtisanPrestationsComponent;
  let fixture: ComponentFixture<ArtisanPrestationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArtisanPrestationsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArtisanPrestationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
