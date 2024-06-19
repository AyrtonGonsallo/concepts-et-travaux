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
import { EtapesProjetComponent } from './etapes-projet/etapes-projet.component';
import { BesoinProjetComponent } from './besoin-projet/besoin-projet.component';
import { CategoriePieceComponent } from './categorie-piece/categorie-piece.component';
import { PieceComponent } from './piece/piece.component';
import { AjouterPieceComponent } from './piece/ajouter-piece/ajouter-piece.component';
import { RealisationComponent } from './realisation/realisation.component';
import { AjouterRealisationComponent } from './realisation/ajouter-realisation/ajouter-realisation.component';
import { GaleriesComponent } from './galeries/galeries.component';
import { AjouterGalerieComponent } from './galeries/ajouter-galerie/ajouter-galerie.component';
import { ModifierGalerieComponent } from './galeries/modifier-galerie/modifier-galerie.component';
import { ModifierRealisationComponent } from './realisation/modifier-realisation/modifier-realisation.component';

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
      { path: 'etapes-projet', component: EtapesProjetComponent },
      { path: 'besoins-projet', component: BesoinProjetComponent },
      { path: 'categories-piece', component: CategoriePieceComponent },
      { path: 'galeries', component: GaleriesComponent },
      { path: 'galeries/ajouter-galerie', component: AjouterGalerieComponent },
      { path: 'galeries/modifier-galerie/:id', component: ModifierGalerieComponent },
      { path: 'pieces', component: PieceComponent },
      { path: 'pieces/ajouter-piece', component: AjouterPieceComponent },
      { path: 'realisations', component: RealisationComponent },
      { path: 'realisations/ajouter-realisation', component: AjouterRealisationComponent },
      { path: 'realisations/modifier-realisation/:id', component: ModifierRealisationComponent },
      { path: 'comptes/modifier-compte/:id', component: ModifierCompteComponent }, // Nouvelle route pour ajouter un compte avec un ID
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
