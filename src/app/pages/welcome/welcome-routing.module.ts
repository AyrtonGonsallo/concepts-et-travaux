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
import { IsAdminGuard } from '../../Guards/IsAdminGuard';
import { IsHimGuard } from '../../Guards/IsHimGuard';
import { ProjetComponent } from './projet/projet.component';
import { ModifierProjetComponent } from './projet/modifier-projet/modifier-projet.component';
import { AjouterProjetComponent } from './projet/ajouter-projet/ajouter-projet.component';
import { VoirProjetComponent } from './projet/voir-projet/voir-projet.component';
import { IsNotArtisanGuard } from '../../Guards/IsNotArtisanGuard';

const routes: Routes = [
 
  { 
    path: '', 
    component: WelcomeComponent, // Utilise le LayoutComponent comme parent
    children: [
      { path: '', component:ComptesComponent },
      { path: 'autorisations', component: AutorisationsComponent },
      { path: 'comptes', component: ComptesComponent },
      { path: 'roles', component: RolesComponent },
      { path: 'projets', component: ProjetComponent },
      { path: 'projets/voir-projet/:id', component: VoirProjetComponent ,}, // Nouvelle route pour ajouter un compte avec un ID
      { path: 'projets/modifier-projet/:id', component: ModifierProjetComponent ,canActivate: [IsAdminGuard]}, // Nouvelle route pour ajouter un compte avec un ID
      { path: 'projets/ajouter-projet', component: AjouterProjetComponent,canActivate: [IsNotArtisanGuard] }, // Nouvelle route pour ajouter un compte avec un ID
      
      { path: 'comptes/modifier-compte/:id', component: ModifierCompteComponent ,canActivate: [IsHimGuard]}, // Nouvelle route pour ajouter un compte avec un ID
      { path: 'comptes/ajouter-compte', component: AjouterCompteComponent,canActivate: [IsAdminGuard] }, // Nouvelle route pour ajouter un compte avec un ID
      { path: 'autorisations/modifier-autorisation/:id', component: ModifierAutorisationComponent,canActivate: [IsAdminGuard] }, // Nouvelle route pour ajouter un compte avec un ID
      { path: 'autorisations/ajouter-autorisation', component: AjouterAutorisationComponent,canActivate: [IsAdminGuard]}, // Nouvelle route pour ajouter un compte avec un ID
      { path: 'roles/modifier-role/:id', component: ModifierRoleComponent,canActivate: [IsAdminGuard] }, // Nouvelle route pour ajouter un compte avec un ID
      { path: 'roles/ajouter-role', component: AjouterRoleComponent ,canActivate: [IsAdminGuard]} // Nouvelle route pour ajouter un compte avec un ID

      // Autres routes de la page d'accueil
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WelcomeRoutingModule { }
