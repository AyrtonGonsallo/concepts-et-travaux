# ConceptsEtTravaux

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.3.5.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

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
