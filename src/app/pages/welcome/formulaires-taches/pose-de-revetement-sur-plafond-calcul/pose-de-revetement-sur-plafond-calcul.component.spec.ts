import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoseDeRevetementSurPlafondCalculComponent } from './pose-de-revetement-sur-plafond-calcul.component';

describe('PoseDeRevetementSurPlafondCalculComponent', () => {
  let component: PoseDeRevetementSurPlafondCalculComponent;
  let fixture: ComponentFixture<PoseDeRevetementSurPlafondCalculComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoseDeRevetementSurPlafondCalculComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PoseDeRevetementSurPlafondCalculComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
