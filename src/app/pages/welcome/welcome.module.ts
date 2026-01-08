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
import { AjouterEtapeDevisComponent } from './etapes-devis/ajouter-etape/ajouter-etape.component';
import { ModifierEtapeDevisComponent } from './etapes-devis/modifier-etape/modifier-etape.component';
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
import { ModelesEquipementsComponent } from './modeles-equipements/modeles-equipements.component';
import { AjouterModeleComponent } from './modeles-equipements/ajouter-modele/ajouter-modele.component';
import { ModifierModeleComponent } from './modeles-equipements/modifier-modele/modifier-modele.component';
import { DevisPiecesComponent } from './devis-pieces/devis-pieces.component';
import { AjouterDevisPieceComponent } from './devis-pieces/ajouter-devis-piece/ajouter-devis-piece.component';
import { ModifierDevisPieceComponent } from './devis-pieces/modifier-devis-piece/modifier-devis-piece.component';
import { GammeComponent } from './gamme/gamme.component';
import { AjouterGammeComponent } from './gamme/ajouter-gamme/ajouter-gamme.component';
import { ModifierGammeComponent } from './gamme/modifier-gamme/modifier-gamme.component';
import { TachesGeneralesComponent } from './taches-generales/taches-generales.component';
import { AjouterTacheGeneraleComponent } from './taches-generales/ajouter-tache-generale/ajouter-tache-generale.component';
import { ModifierTacheGeneraleComponent } from './taches-generales/modifier-tache-generale/modifier-tache-generale.component';
import { EtapesDevisComponent } from './etapes-devis/etapes-devis.component';
import { TestsFormulesComponent } from './tests-formules/tests-formules.component';
import { ModifierParametreComponent } from './parametres/modifier-parametre/modifier-parametre.component';
import { ParametresComponent } from './parametres/parametres.component';
import { AjouterParametreComponent } from './parametres/ajouter-parametre/ajouter-parametre.component';
import { PoseDeRevetementDeSolListeComponent } from './formulaires-taches/pose-de-revetement-de-sol-liste/pose-de-revetement-de-sol-liste.component';
import { PoseDeRevetementDeSolCalculComponent } from './formulaires-taches/pose-de-revetement-de-sol-calcul/pose-de-revetement-de-sol-calcul.component';
import { PoseDeRevetementSurPlafondListeComponent } from './formulaires-taches/pose-de-revetement-sur-plafond-liste/pose-de-revetement-sur-plafond-liste.component';
import { PoseDeRevetementSurPlafondCalculComponent } from './formulaires-taches/pose-de-revetement-sur-plafond-calcul/pose-de-revetement-sur-plafond-calcul.component';
import { PoseDeRevetementsMurauxListeComponent } from './formulaires-taches/pose-de-revetements-muraux-liste/pose-de-revetements-muraux-liste.component';
import { PoseDeRevetementsMurauxCalculComponent } from './formulaires-taches/pose-de-revetements-muraux-calcul/pose-de-revetements-muraux-calcul.component';
import { RenovationElectriquePartielleListeComponent } from './formulaires-taches/renovation-electrique-partielle-liste/renovation-electrique-partielle-liste.component';
import { RenovationElectriquePartielleCalculComponent } from './formulaires-taches/renovation-electrique-partielle-calcul/renovation-electrique-partielle-calcul.component';
import { RemplacementDePortesListeComponent } from './formulaires-taches/remplacement-de-portes-liste/remplacement-de-portes-liste.component';
import { RemplacementDePortesCalculComponent } from './formulaires-taches/remplacement-de-portes-calcul/remplacement-de-portes-calcul.component';
import { DemolitionCloisonsCalculComponent } from './formulaires-taches/demolition-cloisons-calcul/demolition-cloisons-calcul.component';
import { DemolitionCloisonsListeComponent } from './formulaires-taches/demolition-cloisons-liste/demolition-cloisons-liste.component';
import { CreationMursNonPorteursCalculComponent } from './formulaires-taches/creation-murs-non-porteurs-calcul/creation-murs-non-porteurs-calcul.component';
import { CreationMursNonPorteursListeComponent } from './formulaires-taches/creation-murs-non-porteurs-liste/creation-murs-non-porteurs-liste.component';
import { RemplacementRadiateurCalculComponent } from './formulaires-taches/remplacement-radiateur-calcul/remplacement-radiateur-calcul.component';
import { RemplacementRadiateurListeComponent } from './formulaires-taches/remplacement-radiateur-liste/remplacement-radiateur-liste.component';
import { RenovationElectriqueCompleteListeComponent } from './formulaires-taches/renovation-electrique-complete-liste/renovation-electrique-complete-liste.component';
import { RenovationElectriqueCompleteCalculComponent } from './formulaires-taches/renovation-electrique-complete-calcul/renovation-electrique-complete-calcul.component';
import { InstallationSanitairesListeComponent } from './formulaires-taches/installation-sanitaires-liste/installation-sanitaires-liste.component';
import { InstallationSanitairesCalculComponent } from './formulaires-taches/installation-sanitaires-calcul/installation-sanitaires-calcul.component';
import { PoseEquipementsCuisineListeComponent } from './formulaires-taches/pose-equipements-cuisine-liste/pose-equipements-cuisine-liste.component';
import { PoseEquipementsCuisineCalculComponent } from './formulaires-taches/pose-equipements-cuisine-calcul/pose-equipements-cuisine-calcul.component';
import { ClientsComponent } from './clients/clients.component';
import { VoirDetailsClientComponent } from './clients/voir-details-client/voir-details-client.component';
import { FichiersComponent } from './fichiers/fichiers.component';
import { VoirProjetsClientComponent } from './clients/voir-projets-client/voir-projets-client.component';

@NgModule({
  imports: [WelcomeRoutingModule,SharedModule,  EditorModule,  ],
  declarations: [WelcomeComponent,ParametresComponent,AjouterParametreComponent, AutorisationsComponent,AjouterCategorieComponent ,ModifierCategorieComponent , ComptesComponent, RolesComponent, AjouterCompteComponent, ModifierCompteComponent, AjouterAutorisationComponent, AjouterRoleComponent, ModifierRoleComponent, ModifierAutorisationComponent, ProjetComponent, AjouterProjetComponent, ModifierProjetComponent, VoirProjetComponent, BesoinProjetComponent, EtapesProjetComponent, CategoriePieceComponent, PieceComponent, AjouterPieceComponent, RealisationComponent, AjouterRealisationComponent, GaleriesComponent, AjouterGalerieComponent, ModifierGalerieComponent, ModifierRealisationComponent, ModifierPieceComponent, CategorieQuestionComponent, AjouterCategorieQComponent, ModifierCategorieQComponent, QuestionComponent, AjouterQuestionComponent, ModifierQuestionComponent, AjouterBesoinComponent, ModifierBesoinComponent, AjouterEtapeComponent, ModifierEtapeComponent,AjouterEtapeDevisComponent, ModifierEtapeDevisComponent, PointsClesComponent, AjouterPointCleComponent, ModifierPointCleComponent, AvisComponent, AjouterAvisComponent, ModifierAvisComponent, FrontPageComponent, AjouterFrontPageComponent , ModifierFrontPageComponent, EquipementsComponent, AjouterEquipementComponent, ModifierEquipementComponent, TravauxComponent, AjouterTravailComponent, ModifierTravailComponent, ModelesEquipementsComponent, AjouterModeleComponent, ModifierModeleComponent, DevisPiecesComponent, AjouterDevisPieceComponent, ModifierDevisPieceComponent, GammeComponent, AjouterGammeComponent, ModifierGammeComponent, TachesGeneralesComponent, AjouterTacheGeneraleComponent, ModifierTacheGeneraleComponent, EtapesDevisComponent, TestsFormulesComponent, ModifierParametreComponent, PoseDeRevetementDeSolListeComponent, PoseDeRevetementDeSolCalculComponent, PoseDeRevetementSurPlafondListeComponent, PoseDeRevetementSurPlafondCalculComponent, PoseDeRevetementsMurauxListeComponent, PoseDeRevetementsMurauxCalculComponent, RenovationElectriquePartielleListeComponent, RenovationElectriquePartielleCalculComponent, RemplacementDePortesListeComponent, RemplacementDePortesCalculComponent, DemolitionCloisonsCalculComponent, DemolitionCloisonsListeComponent, CreationMursNonPorteursCalculComponent, CreationMursNonPorteursListeComponent, RemplacementRadiateurCalculComponent, RemplacementRadiateurListeComponent, RenovationElectriqueCompleteListeComponent, RenovationElectriqueCompleteCalculComponent, InstallationSanitairesListeComponent, InstallationSanitairesCalculComponent, PoseEquipementsCuisineListeComponent, PoseEquipementsCuisineCalculComponent, ClientsComponent, VoirDetailsClientComponent, FichiersComponent, VoirProjetsClientComponent,],
  exports: [WelcomeComponent]
})
export class WelcomeModule {
 
 }
