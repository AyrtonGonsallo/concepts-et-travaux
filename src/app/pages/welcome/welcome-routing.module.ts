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
import { ModifierPieceComponent } from './piece/modifier-piece/modifier-piece.component';
import { ModifierBesoinComponent } from './besoin-projet/modifier-besoin/modifier-besoin.component';
import { AjouterBesoinComponent } from './besoin-projet/ajouter-besoin/ajouter-besoin.component';
import { AjouterEtapeComponent } from './etapes-projet/ajouter-etape/ajouter-etape.component';
import { ModifierEtapeComponent } from './etapes-projet/modifier-etape/modifier-etape.component';
import { EtapesDevisComponent } from './etapes-devis/etapes-devis.component';
import { AjouterEtapeDevisComponent } from './etapes-devis/ajouter-etape/ajouter-etape.component';
import { ModifierEtapeDevisComponent } from './etapes-devis/modifier-etape/modifier-etape.component';
import { AjouterCategorieComponent } from './categorie-piece/ajouter-categorie/ajouter-categorie.component';
import { ModifierCategorieComponent } from './categorie-piece/modifier-categorie/modifier-categorie.component';
import { QuestionComponent } from './question/question.component';
import { AjouterQuestionComponent } from './question/ajouter-question/ajouter-question.component';
import { ModifierQuestionComponent } from './question/modifier-question/modifier-question.component';
import { CategorieQuestionComponent } from './categorie-question/categorie-question.component';
import { ModifierCategorieQComponent } from './categorie-question/modifier-categorie/modifier-categorie.component';
import { AjouterCategorieQComponent } from './categorie-question/ajouter-categorie/ajouter-categorie.component';
import { PointsClesComponent } from './points-cles/points-cles.component';
import { AjouterPointCleComponent } from './points-cles/ajouter-point-cle/ajouter-point-cle.component';
import { ModifierPointCleComponent } from './points-cles/modifier-point-cle/modifier-point-cle.component';
import { AvisComponent } from './avis/avis.component';
import { AjouterAvisComponent } from './avis/ajouter-avis/ajouter-avis.component';
import { ModifierAvisComponent } from './avis/modifier-avis/modifier-avis.component';
import { ModifierFrontPageComponent } from './front-page/modifier-front-page/modifier-front-page.component';
import { AjouterFrontPageComponent } from './front-page/ajouter-front-page/ajouter-front-page.component';
import { FrontPageComponent } from './front-page/front-page.component';
import { EquipementsComponent } from './equipements/equipements.component';
import { AjouterEquipementComponent } from './equipements/ajouter-equipement/ajouter-equipement.component';
import { ModifierEquipementComponent } from './equipements/modifier-equipement/modifier-equipement.component';
import { AjouterTravailComponent } from './travaux/ajouter-travail/ajouter-travail.component';
import { ModifierTravailComponent } from './travaux/modifier-travail/modifier-travail.component';
import { TravauxComponent } from './travaux/travaux.component';
import { AjouterModeleComponent } from './modeles-equipements/ajouter-modele/ajouter-modele.component';
import { ModifierModeleComponent } from './modeles-equipements/modifier-modele/modifier-modele.component';
import { ModelesEquipementsComponent } from './modeles-equipements/modeles-equipements.component';
import { DevisPiecesComponent } from './devis-pieces/devis-pieces.component';
import { ModifierDevisPieceComponent } from './devis-pieces/modifier-devis-piece/modifier-devis-piece.component';
import { AjouterDevisPieceComponent } from './devis-pieces/ajouter-devis-piece/ajouter-devis-piece.component';
import { ModifierGammeComponent } from './gamme/modifier-gamme/modifier-gamme.component';
import { AjouterGammeComponent } from './gamme/ajouter-gamme/ajouter-gamme.component';
import { GammeComponent } from './gamme/gamme.component';
import { TachesGeneralesComponent } from './taches-generales/taches-generales.component';
import { ModifierTacheGeneraleComponent } from './taches-generales/modifier-tache-generale/modifier-tache-generale.component';
import { AjouterTacheGeneraleComponent } from './taches-generales/ajouter-tache-generale/ajouter-tache-generale.component';
import { TestsFormulesComponent } from './tests-formules/tests-formules.component';
import { ParametresComponent } from './parametres/parametres.component';
import { AjouterParametreComponent } from './parametres/ajouter-parametre/ajouter-parametre.component';
import { ModifierParametreComponent } from './parametres/modifier-parametre/modifier-parametre.component';

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
      { path: 'besoins-projet/modifier-besoin/:id', component: ModifierBesoinComponent }, // Nouvelle route pour ajouter un compte avec un ID
      { path: 'besoins-projet/ajouter-besoin', component: AjouterBesoinComponent }, // Nouvelle route pour ajouter un compte avec un ID
      { path: 'categories-piece/modifier-besoin/:id', component: ModifierCategorieComponent }, // Nouvelle route pour ajouter un compte avec un ID
      { path: 'categories-piece/ajouter-besoin', component: AjouterCategorieComponent }, // Nouvelle route pour ajouter un compte avec un ID
      { path: 'etapes-projet/modifier-etape/:id', component: ModifierEtapeComponent }, // Nouvelle route pour ajouter un compte avec un ID
      { path: 'etapes-projet/ajouter-etape', component: AjouterEtapeComponent }, // Nouvelle route pour ajouter un compte avec un ID
      { path: 'nota-bene', component: EtapesDevisComponent },
      { path: 'nota-bene/modifier-nota-bene/:id', component: ModifierEtapeDevisComponent }, // Nouvelle route pour ajouter un compte avec un ID
      { path: 'nota-bene/ajouter-nota-bene', component: AjouterEtapeDevisComponent }, // Nouvelle route pour ajouter un compte avec un ID
      { path: 'questions', component: QuestionComponent },
      { path: 'questions/modifier-question/:id', component: ModifierQuestionComponent }, // Nouvelle route pour ajouter un compte avec un ID
      { path: 'questions/ajouter-question', component: AjouterQuestionComponent }, // Nouvelle route pour ajouter un compte avec un ID
      { path: 'categories-question', component: CategorieQuestionComponent },
      { path: 'categories-question/modifier-categorie/:id', component: ModifierCategorieQComponent }, // Nouvelle route pour ajouter un compte avec un ID
      { path: 'categories-question/ajouter-categorie', component: AjouterCategorieQComponent },
      { path: 'galeries', component: GaleriesComponent },
      { path: 'galeries/ajouter-galerie', component: AjouterGalerieComponent },
      { path: 'galeries/modifier-galerie/:id', component: ModifierGalerieComponent },
      { path: 'pieces', component: PieceComponent },
      { path: 'points-cles', component: PointsClesComponent },
      { path: 'points-cles/ajouter-point-cle', component: AjouterPointCleComponent },
      { path: 'points-cles/modifier-point-cle/:id', component: ModifierPointCleComponent },
      { path: 'avis', component: AvisComponent },
      { path: 'avis/ajouter-avis', component: AjouterAvisComponent },
      { path: 'avis/modifier-avis/:id', component: ModifierAvisComponent },
      { path: 'parametres', component: ParametresComponent },
      { path: 'parametres/ajouter-parametre', component: AjouterParametreComponent },
      { path: 'parametres/modifier-parametre/:id', component: ModifierParametreComponent },
      { path: 'equipements', component: EquipementsComponent },
      { path: 'formules-et-tests', component: TestsFormulesComponent },
      { path: 'equipements/ajouter-equipement', component: AjouterEquipementComponent },
      { path: 'equipements/modifier-equipement/:id', component: ModifierEquipementComponent },
      { path: 'travaux', component: TravauxComponent },
      { path: 'travaux/ajouter-travail', component: AjouterTravailComponent },
      { path: 'travaux/modifier-travail/:id', component: ModifierTravailComponent },
      { path: 'modeles-equipements', component: ModelesEquipementsComponent },
      { path: 'modeles-equipements/ajouter-modele', component: AjouterModeleComponent },
      { path: 'modeles-equipements/modifier-modele/:id', component: ModifierModeleComponent },
      { path: 'front-pages', component: FrontPageComponent },
      { path: 'front-pages/ajouter-front-page', component: AjouterFrontPageComponent },
      { path: 'front-pages/modifier-front-page/:id', component: ModifierFrontPageComponent },
      { path: 'pieces/ajouter-piece', component: AjouterPieceComponent },
      { path: 'realisations', component: RealisationComponent },
      { path: 'realisations/ajouter-realisation', component: AjouterRealisationComponent },
      { path: 'realisations/modifier-realisation/:id', component: ModifierRealisationComponent },
      { path: 'pieces/modifier-piece/:id', component: ModifierPieceComponent },
      { path: 'devis-pieces', component: DevisPiecesComponent },
      { path: 'devis-pieces/modifier-devis-piece/:id', component: ModifierDevisPieceComponent }, // Nouvelle route pour ajouter un compte avec un ID
      { path: 'devis-pieces/ajouter-devis-piece', component: AjouterDevisPieceComponent }, // Nouvelle route pour ajouter un compte avec un ID
      { path: 'gammes', component: GammeComponent },
      { path: 'gammes/modifier-gamme/:id', component: ModifierGammeComponent }, // Nouvelle route pour ajouter un compte avec un ID
      { path: 'gammes/ajouter-gamme', component: AjouterGammeComponent }, // Nouvelle route pour ajouter un compte avec un ID
      { path: 'taches-generales', component: TachesGeneralesComponent },
      { path: 'taches-generales/modifier-tache-generale/:id', component: ModifierTacheGeneraleComponent }, // Nouvelle route pour ajouter un compte avec un ID
      { path: 'taches-generales/ajouter-tache-generale', component: AjouterTacheGeneraleComponent }, // Nouvelle route pour ajouter un compte avec un ID
      
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
