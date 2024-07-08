import { NgModule } from '@angular/core';

import { WelcomeRoutingModule } from './welcome-routing.module';
import { EditorModule } from '@tinymce/tinymce-angular';
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
import { ProjetComponent } from './projet/projet.component';
import { AjouterProjetComponent } from './projet/ajouter-projet/ajouter-projet.component';
import { ModifierProjetComponent } from './projet/modifier-projet/modifier-projet.component';
import { VoirProjetComponent } from './projet/voir-projet/voir-projet.component';
import { BesoinProjetComponent } from './besoin-projet/besoin-projet.component';
import { EtapesProjetComponent } from './etapes-projet/etapes-projet.component';
import { CategoriePieceComponent } from './categorie-piece/categorie-piece.component';
import { PieceComponent } from './piece/piece.component';
import { AjouterPieceComponent } from './piece/ajouter-piece/ajouter-piece.component';
import { RealisationComponent } from './realisation/realisation.component';
import { AjouterRealisationComponent } from './realisation/ajouter-realisation/ajouter-realisation.component';
import { GaleriesComponent } from './galeries/galeries.component';
import { AjouterGalerieComponent } from './galeries/ajouter-galerie/ajouter-galerie.component';
import { ModifierGalerieComponent } from './galeries/modifier-galerie/modifier-galerie.component';
import { ModifierRealisationComponent } from './realisation/modifier-realisation/modifier-realisation.component';
import { ModifierPieceComponent } from './piece/modifier-piece/modifier-piece.component';
import { CategorieQuestionComponent } from './categorie-question/categorie-question.component';
import { AjouterCategorieQComponent } from './categorie-question/ajouter-categorie/ajouter-categorie.component';
import { ModifierCategorieQComponent } from './categorie-question/modifier-categorie/modifier-categorie.component';
import { AjouterCategorieComponent } from './categorie-piece/ajouter-categorie/ajouter-categorie.component';
import { ModifierCategorieComponent } from './categorie-piece/modifier-categorie/modifier-categorie.component';
import { QuestionComponent } from './question/question.component';
import { AjouterQuestionComponent } from './question/ajouter-question/ajouter-question.component';
import { ModifierQuestionComponent } from './question/modifier-question/modifier-question.component';
import { AjouterBesoinComponent } from './besoin-projet/ajouter-besoin/ajouter-besoin.component';
import { ModifierBesoinComponent } from './besoin-projet/modifier-besoin/modifier-besoin.component';
import { AjouterEtapeComponent } from './etapes-projet/ajouter-etape/ajouter-etape.component';
import { ModifierEtapeComponent } from './etapes-projet/modifier-etape/modifier-etape.component';
import { PointsClesComponent } from './points-cles/points-cles.component';
import { AjouterPointCleComponent } from './points-cles/ajouter-point-cle/ajouter-point-cle.component';
import { ModifierPointCleComponent } from './points-cles/modifier-point-cle/modifier-point-cle.component';
import { AvisComponent } from './avis/avis.component';
import { AjouterAvisComponent } from './avis/ajouter-avis/ajouter-avis.component';
import { ModifierAvisComponent } from './avis/modifier-avis/modifier-avis.component';
import { FrontPageComponent } from './front-page/front-page.component';
import { AjouterFrontPageComponent } from './front-page/ajouter-front-page/ajouter-front-page.component';
import { ModifierFrontPageComponent } from './front-page/modifier-front-page/modifier-front-page.component';
import { EquipementsComponent } from './equipements/equipements.component';
import { AjouterEquipementComponent } from './equipements/ajouter-equipement/ajouter-equipement.component';
import { ModifierEquipementComponent } from './equipements/modifier-equipement/modifier-equipement.component';
import { TravauxComponent } from './travaux/travaux.component';
import { AjouterTravailComponent } from './travaux/ajouter-travail/ajouter-travail.component';
import { ModifierTravailComponent } from './travaux/modifier-travail/modifier-travail.component';
@NgModule({
  imports: [WelcomeRoutingModule,SharedModule,  EditorModule,  ],
  declarations: [WelcomeComponent, AutorisationsComponent,AjouterCategorieComponent ,ModifierCategorieComponent , ComptesComponent, RolesComponent, AjouterCompteComponent, ModifierCompteComponent, AjouterAutorisationComponent, AjouterRoleComponent, ModifierRoleComponent, ModifierAutorisationComponent, ProjetComponent, AjouterProjetComponent, ModifierProjetComponent, VoirProjetComponent, BesoinProjetComponent, EtapesProjetComponent, CategoriePieceComponent, PieceComponent, AjouterPieceComponent, RealisationComponent, AjouterRealisationComponent, GaleriesComponent, AjouterGalerieComponent, ModifierGalerieComponent, ModifierRealisationComponent, ModifierPieceComponent, CategorieQuestionComponent, AjouterCategorieQComponent, ModifierCategorieQComponent, QuestionComponent, AjouterQuestionComponent, ModifierQuestionComponent, AjouterBesoinComponent, ModifierBesoinComponent, AjouterEtapeComponent, ModifierEtapeComponent, PointsClesComponent, AjouterPointCleComponent, ModifierPointCleComponent, AvisComponent, AjouterAvisComponent, ModifierAvisComponent, FrontPageComponent, AjouterFrontPageComponent , ModifierFrontPageComponent, EquipementsComponent, AjouterEquipementComponent, ModifierEquipementComponent, TravauxComponent, AjouterTravailComponent, ModifierTravailComponent],
  exports: [WelcomeComponent]
})
export class WelcomeModule {
 
 }
