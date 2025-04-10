import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoseDeRevetementsMurauxListeComponent } from './pose-de-revetements-muraux-liste.component';

describe('PoseDeRevetementsMurauxListeComponent', () => {
  let component: PoseDeRevetementsMurauxListeComponent;
  let fixture: ComponentFixture<PoseDeRevetementsMurauxListeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoseDeRevetementsMurauxListeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PoseDeRevetementsMurauxListeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
