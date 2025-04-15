import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreationMursNonPorteursListeComponent } from './creation-murs-non-porteurs-liste.component';

describe('CreationMursNonPorteursListeComponent', () => {
  let component: CreationMursNonPorteursListeComponent;
  let fixture: ComponentFixture<CreationMursNonPorteursListeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreationMursNonPorteursListeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreationMursNonPorteursListeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
