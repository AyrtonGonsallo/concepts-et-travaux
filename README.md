# ConceptsEtTravaux

Application Angular de gestion de projets de travaux et de leurs données de référence. Le projet a été généré avec [Angular CLI](https://github.com/angular/angular-cli) version 17.3.5.

## Fonctionnalités des pages `src/app/pages/welcome`

Les écrans ci-dessous sont accessibles sous le layout `welcome`. Les routes et composants du module définissent les fonctionnalités de navigation. Pour les ressources disposant de routes d’ajout ou de modification, l’interface permet de gérer les enregistrements correspondants.

### Comptes et accès

- **Comptes** (`/comptes`) : consulter et gérer les comptes ; routes dédiées pour ajouter un compte et modifier un compte existant.
- **Autorisations** (`/autorisations`) : gérer les autorisations, avec écrans d’ajout et de modification.
- **Rôles** (`/roles`) : gérer les rôles, avec écrans d’ajout et de modification.
- L’ajout de comptes et la gestion des autorisations et des rôles sont protégés par le garde d’administration `IsAdminGuard`.

### Projets et préparation des travaux

- **Projets** (`/projets`) : consulter les projets, en ajouter et modifier un projet. La modification est réservée aux administrateurs et l’ajout est soumis au garde `IsNotArtisanGuard`.
- **Étapes de projet** (`/etapes-projet`) : gérer les étapes qui composent le déroulement d’un projet.
- **Besoins de projet** (`/besoins-projet`) : gérer les besoins associés à un projet.
- **Pièces** (`/pieces`) : consulter et gérer les pièces, avec écrans de création et de modification.
- **Catégories de pièces** (`/categories-piece`) : organiser les pièces par catégories.
- **Étapes de devis / « nota bene »** (`/nota-bene`) : gérer les étapes ou informations associées au devis.

### Questions, contenus et présentation

- **Questions** (`/questions`) et **catégories de questions** (`/categories-question`) : gérer les questions et leur classement.
- **Galeries** (`/galeries`) : créer et modifier des galeries.
- **Réalisations** (`/realisations`) : consulter, ajouter et modifier des réalisations.
- **Pages d’accueil** (`/front-pages`) : gérer les contenus des pages de présentation, avec création et modification.
- **Points clés** (`/points-cles`) : gérer les éléments mis en avant.
- **Avis** (`/avis`) : gérer les avis.
- **Styles** (`/styles`) : gérer les styles disponibles ; l’ajout est protégé par `IsAdminGuard`.

### Catalogue et tâches de travaux

- **Travaux** (`/travaux`) : gérer les travaux, avec écrans d’ajout et de modification.
- **Équipements** (`/equipements`) : gérer les équipements, avec écrans d’ajout et de modification.
- **Modèles d’équipements** (`/modeles-equipements`) : gérer les modèles d’équipements.
- **Tâches / gammes** (`/taches`) : gérer les tâches, avec création et modification.
- **Tâches générales** (`/taches-generales`) : gérer les tâches générales.
- **Équipements de tâches** (`/equipements-taches`) : associer et gérer les équipements utilisés par les tâches.
- **Devis de pièces** (`/devis-pieces`) : gérer les éléments de devis liés aux pièces.
- **Paramètres et TVA** (`/parametres`) : gérer les paramètres ainsi que les taux de TVA (routes distinctes d’ajout et de modification pour chacun).

### Formules et tests de calcul

La page **Formules et tests** (`/formules-et-tests`) donne accès à des listes de formules et à des écrans permettant de tester ou modifier leurs calculs. Les domaines déclarés dans les routes sont :

- revêtements muraux, de plafond et de sol ;
- remplacement de portes et de radiateurs ;
- rénovation électrique partielle ou complète ;
- démolition de cloisons et création de murs non porteurs ;
- installation de sanitaires ;
- pose d’équipements de cuisine.

### Clients, artisans et fournisseurs

- **Clients** (`/clients`) : consulter les clients, afficher leurs détails et voir leurs projets.
- **Fichiers** (`/fichiers`) : accéder à l’écran de gestion des fichiers.
- **Artisans** (`/artisans`) : consulter la liste, afficher les détails, gérer les artisans et accéder à leurs prestations. L’ajout d’un artisan est protégé par `IsAdminGuard`.
- **Catégories d’artisans** (`/categories-artisan`) : gérer les catégories d’artisans.
- **Fournisseurs** (`/fournisseurs`) : consulter la liste, afficher les détails, gérer les fournisseurs et accéder à leurs prestations. L’ajout d’un fournisseur est protégé par `IsAdminGuard`.
- **Catégories de fournisseurs** (`/categories-fournisseur`) : gérer les catégories de fournisseurs.
- Les routes de détail de prestation des artisans et fournisseurs utilisent le composant `PrestationDetailsComponent`.

## Développement

Lancer le serveur de développement :

```bash
ng serve
```

Puis ouvrir `http://localhost:4200/`. L’application se recharge automatiquement lorsque les fichiers source changent.

## Génération de code

```bash
ng generate component component-name
```

Angular CLI permet également de générer des directives, pipes, services, classes, guards, interfaces, enums et modules.

## Build

```bash
ng build
```

Les artefacts compilés sont enregistrés dans le répertoire `dist/`.

## Tests unitaires

```bash
ng test
```

Les tests sont exécutés avec [Karma](https://karma-runner.github.io).

## Tests end-to-end

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.


fais un fichier csv de test avec ces infos. Reste generique, ne bourre pas le fichier, regroupe et decris bien chaque test. J'ai mis problemes souvent rencontres: pour t'aider a des endroits


un devis a une pieces et des taches.
un projet a plusieurs devis.
pieces Buanderie, Chambre, Cuisine, Garage, Salle à manger, Salle d'eau/WC, Salle de bain, Salon
Buanderie : Création de murs non porteurs, Démolition de cloisons ou ouverture partielle sur des murs non porteurs, Dépose de revêtements muraux, Isolation interieure des murs de façade, Pose de revêtement de sol, Pose de revêtement sur plafond, Pose de revêtements muraux, Remplacement de radiateur, Remplacement ou ajout de porte, Rénovation électrique complète, Rénovation électrique partielle

Chambre : Création de murs non porteurs, Démolition de cloisons ou ouverture partielle sur des murs non porteurs, Dépose de revêtements muraux, Isolation interieure des murs de façade, Pose de revêtement de sol, Pose de revêtement sur plafond, Pose de revêtements muraux, Remplacement de radiateur, Remplacement ou ajout de porte, Rénovation électrique complète, Rénovation électrique partielle

Cuisine : Création de murs non porteurs, Démolition de cloisons ou ouverture partielle sur des murs non porteurs, Dépose de revêtements muraux, Pose de nouveaux équipements de cuisine, Pose de plomberie, Pose de revêtement de sol, Pose de revêtement sur plafond, Pose de revêtements muraux, Remplacement de radiateur, Remplacement ou ajout de porte, Rénovation électrique complète, Rénovation électrique partielle

Garage : Démolition de cloisons ou ouverture partielle sur des murs non porteurs, Dépose de revêtements muraux, Isolation interieure des murs de façade, Pose de revêtement de sol, Pose de revêtement sur plafond, Pose de revêtements muraux, Remplacement de radiateur, Remplacement ou ajout de porte, Rénovation électrique complète, Rénovation électrique partielle

Salle à manger : Création de murs non porteurs, Démolition de cloisons ou ouverture partielle sur des murs non porteurs, Dépose de revêtements muraux, Isolation interieure des murs de façade, Pose de revêtement de sol, Pose de revêtement sur plafond, Pose de revêtements muraux, Remplacement de radiateur, Remplacement ou ajout de porte, Rénovation électrique complète, Rénovation électrique partielle

Salle d'eau/WC : Création de murs non porteurs, Démolition de cloisons ou ouverture partielle sur des murs non porteurs, Dépose de revêtements muraux, Dépose des anciennes installations de salle de bain, Installation de nouveaux équipements sanitaires, Isolation interieure des murs de façade, Pose de plomberie, Pose de revêtement de sol, Pose de revêtement sur plafond, Pose de revêtements muraux, Remplacement de radiateur, Remplacement ou ajout de porte, Rénovation électrique complète, Rénovation électrique partielle

Salle de bain : Création de murs non porteurs, Démolition de cloisons ou ouverture partielle sur des murs non porteurs, Dépose de revêtements muraux, Dépose des anciennes installations de salle de bain, Installation de nouveaux équipements sanitaires, Isolation interieure des murs de façade, Pose de plomberie, Pose de revêtement de sol, Pose de revêtement sur plafond, Pose de revêtements muraux, Remplacement de radiateur, Remplacement ou ajout de porte, Rénovation électrique complète, Rénovation électrique partielle

Salon : Création de murs non porteurs, Démolition de cloisons ou ouverture partielle sur des murs non porteurs, Dépose de revêtements muraux, Isolation interieure des murs de façade, Pose de revêtement de sol, Pose de revêtement sur plafond, Pose de revêtements muraux, Remplacement de radiateur, Remplacement ou ajout de porte, Rénovation électrique complète, Rénovation électrique partielle

notions de prix (jargon du client me demande pas...)
DevisPiece a Prix et des DevisTache. Prix = somme de Prix dans DevisTache
DevisTache a plusieurs champs prix
Prix = Prix de déboursé remisé HT = prix deboursé HT - remise
PrixCoutant = Prix Coûtant HT = somme des taches avec tarifs artisans
PrixDebourseHT = Prix déboursé HT = somme des taches
PrixDeVenteHT = 	Prix de vente HT = Prix de vente remisé HT x coef
PrixDeVenteRemiseHT = Prix de vente remisé HT = prix deboursé HT - remise
PrixDeVenteRemiseTTC = 	Prix de vente remisé TTC = Prix de vente HT + tva



Le client peut etre connecte au depart ou non choisit une ou plusieurs pièces (Salon, Salle de bain, Cuisine), puis sélectionne un ou plusieurs parmi une liste de travaux propres à chaque pièce.

Il remplit ensuite un parcours par étapes (dimensions, revetements a enlever, etat des surfaces, gammes(revetements a ajouter), appareils/quantités), avec des calculs automatiques (surface, volume,) et une navigation Suivant/Précédent qui conserve les données.

Les saisies sont validées (bornes min/max, champs requis, types numériques) et les données sont persistées (durant la session qui dure 2heures attention si elle fini pendant une operation).

À la fin, le client soumet le devis : 
si il etati connecte ca va au serveur
sinon il doit se connecter/ creer un compte sans quiter la page /perdre l'etat de la page et soumettre
le prix est calculé côté serveur (non manipulable), le client voit un recap sur sa page. si il avait fait un autre/d'autres devis il dois pouvoir le consulter sur la page recap.

Un back-office admin permet de consulter les devis, modifier prix/dimensions/quantités, ajouter des remises, modifier la tva sur un devis et renvoyer un mail au client avec le prix et un pdf qui detaille les choix et prix des choix (tva, remises, coefficient).

Le tout avec des exigences de sécurité (injection, XSS, revalidation serveur), de performance, d'UX (récapitulatif, messages) et de compatibilité (mobile, navigateurs).

problemes souvent rencontres:
un formulaire a une etape est inbvalide et on passe quand meme. Infos perdues quand la session expire. Donnees(flags de passage) dans un mauvais etat apres double clic sur un bouton (soumission, retout ariere, avant) ce qui peut faire qu'on cale a une etape.

Deux modules complémentaires : import/export de prix liés aux artisans/fournisseurs, et demandes de paiement avec suivi de statut.

les artisans et founisseur peuvent se connecter au bo et ne voir que leuru propres tarifs

les tarifs sont des objets avec nom, travail lié, prix de pose(prix artisan), prix fournisseur et prix ht (somme des 2 precedents) 
on a des tarifs de reference avec les champs ActiverFournisseur et ActiverArtisan a false et 
les tarifs artisans avec ActiverArtisan true et ArtisanID valeur de l'artisan et GammeDeReferenceID le tarif de reference
les tarifs fournisseurs avec ActiverFournisseur true et FournisseurID valeur du fournisseur et GammeDeReferenceID le tarif de reference

un artisan ne doit modifier que prix de pose
un fourisseur ne doit modifier que pric fournisseur
chaqun ne voit que ses donnees
ils peuvent exporter un modele de tarifs xlsx a importer (il va de soi que par exemple un fournisseur ne dois pas voir prix de pose dans son modele)
ils peuvent les uploader et les importer
ils peuvent les modifier par formulaire interface

les clients et admin du devis ne doivent avoir que les tarifs de reference sur le devis
il y a une partie prix coutant sur chaque tache ou pour chaque tarif de reference on peut choisir le tarif artisan/fournisseur et le prix coutant est calcule a partit des tarifs de artisans/fournisseur sans compter les remises alors que le prix de vente est calcule a partir des tarifs de reference

problemes souvent rencontres:
les tarifs artisans/fournieeurs qui appaaissent sur le site et a la modification de taches dans le bo alors que la on ne doit avoir que les tarifs de reference. Le prix doit changer dans le devis si on modifie le prix d'un tarif de reference choisi sur une tache. Apres la modification d'une tache, le prix du devis n'est pas la somme du prix des taches sur tout quant il ya des remises


Demande de paiement
on a des objets paiement avec montant, lien(sur stripe), reference virement, type (acompte, visite, echeance, solde final), date(de creation),datedepaiement,projetid,status, commentaire, titre, TypeDePaiement en ligne /virement, requette (reglement/demande)

les paiements reglement sont la visite et l'acompte cree par le serveur. on ne odis pas pouvoir changer leur type. Ils sont toujours en ligne par stripe, donc ils on un lien.
les paiements demande sont des demandes faites par l'admin depuis le bo. on les cree avec lien et reference acr on ne sait pas comment le client paiera et apres si il paye par lien il faut modifier manuellement et si il paye par stripe un listener doit enregistrer la date et modifier le status.
problemes souvent rencontres:
le status qui change pas, la date de paiement qui s'enregistre pas. sur le dev le htacess qui bloque le listener. l'acompte qui a le type virement

Genertion du pdf recap projet 
pour chaque devis d'un projet on affiche 
les taches avec leur total
la tva et lee total ttv
on ne doit pas afficher les remises et le coef de vente
apres on met total ht projet = somme total ht devis sur projet
montant tva devis 1
montant tva devis 2...
total ttc projet

problemes souvent rencontres:
diffrences entre total ht projet et somme par devis
attention aux cas avec remises 


Faq et seo
on a des champs dans le bo (pour seo les title, desc, canonical, ulr de la page) pour faq (questions et categories de questions)
et il faut qu'ils aillent ou il faut sur les pages

problemes souvent rencontres:
les pages dynamiques et le ssr

Paiement sur le site

il peut payer depuis le panier ou dans son sepace membre dans les paiements dur les projets

problemes souvent rencontres:
retour non fluide apres paeiemnt, les ngif qui se resolvent lentement creant un aspect visuel hideux (bouton connection/moncompte cote a cote)
