import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstallationSanitairesListeComponent } from './installation-sanitaires-liste.component';

describe('InstallationSanitairesListeComponent', () => {
  let component: InstallationSanitairesListeComponent;
  let fixture: ComponentFixture<InstallationSanitairesListeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InstallationSanitairesListeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InstallationSanitairesListeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
