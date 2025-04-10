import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoseDeRevetementDeSolCalculComponent } from './pose-de-revetement-de-sol-calcul.component';

describe('PoseDeRevetementDeSolCalculComponent', () => {
  let component: PoseDeRevetementDeSolCalculComponent;
  let fixture: ComponentFixture<PoseDeRevetementDeSolCalculComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoseDeRevetementDeSolCalculComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PoseDeRevetementDeSolCalculComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
