import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterEtapeDevisComponent } from './ajouter-etape.component';

describe('AjouterEtapeDevisComponent', () => {
  let component: AjouterEtapeDevisComponent;
  let fixture: ComponentFixture<AjouterEtapeDevisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AjouterEtapeDevisComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AjouterEtapeDevisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
