import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstallationSanitairesCalculComponent } from './installation-sanitaires-calcul.component';

describe('InstallationSanitairesCalculComponent', () => {
  let component: InstallationSanitairesCalculComponent;
  let fixture: ComponentFixture<InstallationSanitairesCalculComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InstallationSanitairesCalculComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InstallationSanitairesCalculComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
