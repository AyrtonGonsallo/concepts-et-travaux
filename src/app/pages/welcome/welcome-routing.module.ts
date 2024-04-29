import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WelcomeComponent } from './welcome.component';
import { AutorisationsComponent } from './autorisations/autorisations.component';
import { ComptesComponent } from './comptes/comptes.component';
import { RolesComponent } from './roles/roles.component';
import { AjouterCompteComponent } from './comptes/ajouter-compte/ajouter-compte.component';
import { ModifierCompteComponent } from './comptes/modifier-compte/modifier-compte.component';
import { ModifierAutorisationComponent } from './autorisations/modifier-autorisation/modifier-autorisation.component';
import { AjouterAutorisationComponent } from './autorisations/ajouter-autorisation/ajouter-autorisation.component';
import { ModifierRoleComponent } from './roles/modifier-role/modifier-role.component';
import { AjouterRoleComponent } from './roles/ajouter-role/ajouter-role.component';

const routes: Routes = [
 
  { 
    path: '', 
    component: WelcomeComponent, // Utilise le LayoutComponent comme parent
    children: [
      { path: '', component: AutorisationsComponent },
      { path: 'autorisations', component: AutorisationsComponent },
      { path: 'comptes', component: ComptesComponent },
      { path: 'roles', component: RolesComponent },
      { path: 'comptes/modifier-compte/:id', component: ModifierCompteComponent }, // Nouvelle route pour ajouter un compte avec un ID
      { path: 'comptes/ajouter-compte', component: AjouterCompteComponent }, // Nouvelle route pour ajouter un compte avec un ID
      { path: 'autorisations/modifier-autorisation/:id', component: ModifierAutorisationComponent }, // Nouvelle route pour ajouter un compte avec un ID
      { path: 'autorisations/ajouter-autorisation', component: AjouterAutorisationComponent}, // Nouvelle route pour ajouter un compte avec un ID
      { path: 'roles/modifier-role/:id', component: ModifierRoleComponent }, // Nouvelle route pour ajouter un compte avec un ID
      { path: 'roles/ajouter-role', component: AjouterRoleComponent } // Nouvelle route pour ajouter un compte avec un ID

      // Autres routes de la page d'accueil
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WelcomeRoutingModule { }
