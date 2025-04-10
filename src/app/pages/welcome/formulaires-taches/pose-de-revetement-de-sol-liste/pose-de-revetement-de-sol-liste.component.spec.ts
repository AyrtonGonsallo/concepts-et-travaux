import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoseDeRevetementDeSolListeComponent } from './pose-de-revetement-de-sol-liste.component';

describe('PoseDeRevetementDeSolListeComponent', () => {
  let component: PoseDeRevetementDeSolListeComponent;
  let fixture: ComponentFixture<PoseDeRevetementDeSolListeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoseDeRevetementDeSolListeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PoseDeRevetementDeSolListeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
