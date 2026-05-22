import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterArtisanComponent } from './ajouter-artisan.component';

describe('AjouterArtisanComponent', () => {
  let component: AjouterArtisanComponent;
  let fixture: ComponentFixture<AjouterArtisanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AjouterArtisanComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AjouterArtisanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
