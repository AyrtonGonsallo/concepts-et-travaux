import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemolitionCloisonsListeComponent } from './demolition-cloisons-liste.component';

describe('DemolitionCloisonsListeComponent', () => {
  let component: DemolitionCloisonsListeComponent;
  let fixture: ComponentFixture<DemolitionCloisonsListeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DemolitionCloisonsListeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DemolitionCloisonsListeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
