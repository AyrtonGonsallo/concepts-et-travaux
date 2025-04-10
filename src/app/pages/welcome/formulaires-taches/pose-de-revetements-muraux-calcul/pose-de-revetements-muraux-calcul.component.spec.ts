import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoseDeRevetementsMurauxCalculComponent } from './pose-de-revetements-muraux-calcul.component';

describe('PoseDeRevetementsMurauxCalculComponent', () => {
  let component: PoseDeRevetementsMurauxCalculComponent;
  let fixture: ComponentFixture<PoseDeRevetementsMurauxCalculComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoseDeRevetementsMurauxCalculComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PoseDeRevetementsMurauxCalculComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
