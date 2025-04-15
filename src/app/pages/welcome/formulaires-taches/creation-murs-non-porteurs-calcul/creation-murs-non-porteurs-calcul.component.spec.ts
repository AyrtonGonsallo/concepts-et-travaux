import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreationMursNonPorteursCalculComponent } from './creation-murs-non-porteurs-calcul.component';

describe('CreationMursNonPorteursCalculComponent', () => {
  let component: CreationMursNonPorteursCalculComponent;
  let fixture: ComponentFixture<CreationMursNonPorteursCalculComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreationMursNonPorteursCalculComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreationMursNonPorteursCalculComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
