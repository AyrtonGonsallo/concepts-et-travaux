import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterEtapeComponent } from './ajouter-etape.component';

describe('AjouterEtapeComponent', () => {
  let component: AjouterEtapeComponent;
  let fixture: ComponentFixture<AjouterEtapeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AjouterEtapeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AjouterEtapeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
