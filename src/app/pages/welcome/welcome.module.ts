import { NgModule } from '@angular/core';

import { WelcomeRoutingModule } from './welcome-routing.module';

import { WelcomeComponent } from './welcome.component';
import { SharedModule } from '../../shared/shared.module';
import { AutorisationsComponent } from './autorisations/autorisations.component';
import { ComptesComponent } from './comptes/comptes.component';
import { RolesComponent } from './roles/roles.component';
import { AjouterCompteComponent } from './comptes/ajouter-compte/ajouter-compte.component';
import { ModifierCompteComponent } from './comptes/modifier-compte/modifier-compte.component';
import { AjouterAutorisationComponent } from './autorisations/ajouter-autorisation/ajouter-autorisation.component';
import { AjouterRoleComponent } from './roles/ajouter-role/ajouter-role.component';
import { ModifierRoleComponent } from './roles/modifier-role/modifier-role.component';
import { ModifierAutorisationComponent } from './autorisations/modifier-autorisation/modifier-autorisation.component';
@NgModule({
  imports: [WelcomeRoutingModule,SharedModule ],
  declarations: [WelcomeComponent, AutorisationsComponent, ComptesComponent, RolesComponent, AjouterCompteComponent, ModifierCompteComponent, AjouterAutorisationComponent, AjouterRoleComponent, ModifierRoleComponent, ModifierAutorisationComponent],
  exports: [WelcomeComponent]
})
export class WelcomeModule {
 
 }
