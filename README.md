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

```bash
ng e2e
```

Cette commande nécessite l’installation préalable d’un paquet fournissant les capacités de test end-to-end.

## Aide

Pour en savoir plus sur Angular CLI, exécuter `ng help` ou consulter la [documentation Angular CLI](https://angular.io/cli).
