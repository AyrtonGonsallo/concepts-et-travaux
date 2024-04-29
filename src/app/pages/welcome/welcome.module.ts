import { NgModule } from '@angular/core';

import { WelcomeRoutingModule } from './welcome-routing.module';

import { WelcomeComponent } from './welcome.component';
import { SharedModule } from '../../shared/shared.module';
import { AutorisationsComponent } from './autorisations/autorisations.component';
import { ComptesComponent } from './comptes/comptes.component';
import { RolesComponent } from './roles/roles.component';
import { AjouterCompteComponent } from './comptes/ajouter-compte/ajouter-compte.component';
import { ModifierCompteComponent } from './comptes/modifier-compte/modifier-compte.component';
@NgModule({
  imports: [WelcomeRoutingModule,SharedModule ],
  declarations: [WelcomeComponent, AutorisationsComponent, ComptesComponent, RolesComponent, AjouterCompteComponent, ModifierCompteComponent],
  exports: [WelcomeComponent]
})
export class WelcomeModule { }
