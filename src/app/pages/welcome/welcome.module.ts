import { NgModule } from '@angular/core';

import { WelcomeRoutingModule } from './welcome-routing.module';

import { WelcomeComponent } from './welcome.component';
import { SharedModule } from '../../shared/shared.module';
import { AutorisationsComponent } from './autorisations/autorisations.component';
import { ComptesComponent } from './comptes/comptes.component';
import { RolesComponent } from './roles/roles.component';
@NgModule({
  imports: [WelcomeRoutingModule,SharedModule ],
  declarations: [WelcomeComponent, AutorisationsComponent, ComptesComponent, RolesComponent],
  exports: [WelcomeComponent]
})
export class WelcomeModule { }
