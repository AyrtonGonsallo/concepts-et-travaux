import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtisanDetailsComponent } from './artisan-details.component';

describe('ArtisanDetailsComponent', () => {
  let component: ArtisanDetailsComponent;
  let fixture: ComponentFixture<ArtisanDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArtisanDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArtisanDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
