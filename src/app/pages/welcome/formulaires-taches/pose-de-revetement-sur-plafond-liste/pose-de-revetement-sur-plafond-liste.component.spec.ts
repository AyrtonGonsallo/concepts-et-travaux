import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoseDeRevetementSurPlafondListeComponent } from './pose-de-revetement-sur-plafond-liste.component';

describe('PoseDeRevetementSurPlafondListeComponent', () => {
  let component: PoseDeRevetementSurPlafondListeComponent;
  let fixture: ComponentFixture<PoseDeRevetementSurPlafondListeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoseDeRevetementSurPlafondListeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PoseDeRevetementSurPlafondListeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
