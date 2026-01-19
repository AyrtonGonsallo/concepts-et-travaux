import { Component } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../../Services/auth.service';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ApiConceptsEtTravauxService } from '../../../../Services/api-concepts-et-travaux.service';
import { DevisTache } from '../../../../Models/DevisTache';
import { Remise } from '../../../../Models/Remise';
interface Artisan {
  Id: number;
  Nom: string;
  Prenom: string;
  CategorieArtisan: string; // facultatif si tu veux filtrer par catégorie
}

interface Categorie {
  nom: string;
}


@Component({
  selector: 'app-modifier-devis-piece',
  templateUrl: './modifier-devis-piece.component.html',
  styleUrl: './modifier-devis-piece.component.css'
})
export class ModifierDevisPieceComponent {

  validateForm: FormGroup<{
    Titre: FormControl<string>;
    Commentaire: FormControl<string>;
   
    
  }>;


 
  reloadCurrentRoute(): void {
    const currentUrl = this.router.url;

    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  submitForm(): void {

  
    
    if (this.validateForm.valid) {

      console.log('submit', this.validateForm.value);
      this.devisService.updateCommentaireDevisPiece(parseInt(this.devisId),this.validateForm.value).subscribe(
        (response) => {
          console.log('Devis modifié avec succès :', response);
          this.message.create('success', `Devis modifié avec succès`);
          this.reloadCurrentRoute()
        },
        (error) => {
          console.error('Erreur lors de la modification de l\'devis :', error);
        }
      );
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

 remises:Remise[] = [];


    get_all_devis_remises(devisId: string): void {
      this.devisService.get_all_devis_remises( parseInt(devisId, 10)).subscribe(
        (response) => {
          this.remises=response
          console.log("réponse de la requette get_all_devis_remises",response);
          
        },
        (error) => {
          console.error('Erreur lors de la recuperation des get_all_devis_remises :', error);
        }
      );
      
    }

  constructor(private authService: AuthService,private fb: NonNullableFormBuilder,private http: HttpClient,private devisService: ApiConceptsEtTravauxService, private route: ActivatedRoute,private message: NzMessageService, private router: Router) {
    this.validateForm = this.fb.group({
      
    Commentaire: ['', []],
     Titre: ['', [Validators.required]],
      
    });

     this.remiseForm = this.fb.group({
        Titre: this.fb.control<string | null>(null, Validators.required),
        Type: this.fb.control<string | null>(null, Validators.required),
        Pourcentage: this.fb.control<number | null>(null, ),
        Valeur: this.fb.control<number | null>(null, ),
        Commentaire: this.fb.control<string | null>(null, ),
        DevisID: this.fb.control<number | null>(parseInt(this.devisId), Validators.required), // devispiece.ID sera assigné dynamiquement
      });

   
  }

  
  devisId="";
  ngOnInit(): void {
    // Obtenez l'ID de l'devis à partir de l'URL
    this.devisId = (this.route.snapshot.paramMap.get('id')??'0');
    // Utilisez l'ID pour récupérer les détails de l'devis
    this.getDetails(this.devisId);
    this.getPieces();
     this.get_all_devis_remises(this.devisId);

     this.remiseForm = this.fb.group({
        Titre: this.fb.control<string | null>(null, Validators.required),
        Type: this.fb.control<string | null>(null, Validators.required),
        Pourcentage: this.fb.control<number | null>(null, ),
        Valeur: this.fb.control<number | null>(null, ),
        Commentaire: this.fb.control<string | null>(null, ),
        DevisID: this.fb.control<number | null>(parseInt(this.devisId), Validators.required), // devispiece.ID sera assigné dynamiquement
      });

     
      this.devisService.getUsersByRole(2).subscribe(
      (response: any) => {
        this.artisans = response.map((a: any) => ({
          Id: a.Id,
          Nom: a.Nom,
          Prenom: a.Prenom,
          CategorieArtisan: a.CategorieArtisan || 0 // ou mettre 0 si pas de catégorie
        }));
        this.filteredArtisans=this.artisans
        console.log( " response ",response )
        console.log( " this.artisans ",this.artisans )
      },
      (error: any) => {
        console.error('Erreur lors de la récupération des artisans :', error);
      }
    );
    this.load_parametres()
   
  }



  
  tva = 0
  coefficient = 0
  load_parametres(){
    this.devisService.get_parametre_by_id_or_nom(6,"TVA")
        .subscribe(
          (data) => {
            this.tva=1+(data.Valeur/100);
            console.log("tva",data)
          },
          (error) => {
            console.error('Erreur lors de la recupération des parametres', error);
          });

    this.devisService.get_parametre_by_id_or_nom(1,"coefficient")
        .subscribe(
          (data) => {
            this.coefficient=data.Valeur;
          },
          (error) => {
            console.error('Erreur lors de la recupération des parametres', error);
          });
  }
  
   remiseForm: FormGroup<{
    Titre: FormControl<string | null>;
    Type: FormControl<string | null>;
    Pourcentage: FormControl<number | null>;
    Valeur: FormControl<number | null>;
    Commentaire: FormControl<string | null>;
    DevisID: FormControl<number | null>;
  }> ;
  apiBaseUrl: string = `${environment.apiUrl}/open-file/`;
  // Méthode pour récupérer les détails de l'devis à partir de l'API
  getDetails(devisId: string): void {
    this.devisService.getDevisPieceById( parseInt(devisId, 10)).subscribe(
      (response) => {
        this.devispiece=response
       this.listOfTaches=response.DevisTaches
        this.validateForm.patchValue(response);
        console.log("réponse de la requette get_devis",response);

         this.artisansAjoutes = response.Artisans.map((a: any) => ({
          Id: a.Id,
          Nom: a.Nom,
          Prenom: a.Prenom,
          CategorieArtisan: a.CategorieArtisan || 0 // ou mettre 0 si pas de catégorie
        }));
        console.log("this.artisansAjoutes",this.artisansAjoutes)
        
        
      },
      (error) => {
        console.error('Erreur lors de la recuperation des details devis :', error);
      }
    );
    
  }

 deleteRemise(p_Id: number) {
    if (this.authService.isAdminorSuperAdmin()) {
      this.devisService.delete_remise(p_Id).subscribe(
        () => {
          //console.log('DevisPiece supprimé avec succès');
          this.message.success( 'remise supprimée avec succès');
          // Mettez ici le code pour actualiser la liste des devis_pieces si nécessaire
          this.get_all_devis_remises((this.devisId));
          this.getDetails(this.devisId);
        },
        (error) => {
          console.error('Erreur lors de la suppression de la remise:', error);
          this.message.error( 'Erreur lors de la suppression de la remise');
        }
      );
      
      return true
    } else {
      this.message.info( `Vous n'avez pas assez de privilèges pour faire cette opération`);
      return false;
    }
    
  }


  cancel(): void {
    this.message.info('suppression annulée');
  }
  
  submitremiseForm(): void {
    if (this.remiseForm.valid) {
      console.log('submit', this.remiseForm.value);
      
      this.devisService.add_remise(this.remiseForm.value).subscribe(
        (response) => {
          console.log('remise ajoutée avec succès :', response);
          this.message.create('success', `remise ajoutée avec succès`);
          this.get_all_devis_remises(this.devisId);
          this.remiseForm = this.fb.group({
            Titre: this.fb.control<string | null>(null, Validators.required),
            Type: this.fb.control<string | null>(null, Validators.required),
            Pourcentage: this.fb.control<number | null>(null, ),
            Valeur: this.fb.control<number | null>(null, ),
            Commentaire: this.fb.control<string | null>(null, ),
            DevisID: this.fb.control<number | null>(parseInt(this.devisId) , Validators.required), // devispiece.ID sera assigné dynamiquement
          });
          this.getDetails(this.devisId);
        },
        (error) => {
          console.error('Erreur lors de l\'ajout de la remise :', error);
        }
      );
    } else {
      Object.values(this.remiseForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });

      
    }
  }

  
  devispiece:any
  pieces:any[]=[];

  getPieces(): void {
    this.devisService.getPieces().subscribe(
      (response) => {
       
        this.pieces=response;
        console.log("réponse de la requette get pieces",this.pieces);
      },
      (error) => {
        console.error('Erreur lors de la recuperation des pieces :', error);
      }
    );
    
  }
  isnotAdmin(){
    return !this.authService.isAdmin()
  }
  listOfTaches:DevisTache[] =[]
 
  
  
  

  

  modifier_tache(type_de_travail_id: number|undefined, tacheID: number) {
    let url = '';
  
    switch (type_de_travail_id) {
      case 4: // Création de murs non porteurs
        url = `/administration/formules-et-tests/modifier-creation-murs-non-porteur/${tacheID}?mode=modification`;
        break;
      case 3: // Démolition de cloisons ou ouverture partielle
        url = `/administration/formules-et-tests/modifier-demolition-cloisons/${tacheID}?mode=modification`;
        break;
      case 7: // Dépose des anciennes installations de salle de bain
        url = `/administration/formules-et-tests/modifier-installation-sanitaires/${tacheID}?mode=modification`;
        break;
      case 13: // Rénovation électrique partielle
        url = `/administration/formules-et-tests/modifier-renovation-electrique/${tacheID}?mode=modification`;
        break;
      case 15: // Rénovation électrique complète
        url = `/administration/formules-et-tests/modifier-renovation-electrique-complete/${tacheID}?mode=modification`;
        break;
      case 12: // Remplacement de radiateur
        url = `/administration/formules-et-tests/modifier-remplacement-radiateur/${tacheID}?mode=modification`;
        break;
      case 16: // Installation de nouveaux équipements sanitaires
        url = `/administration/formules-et-tests/modifier-installation-sanitaires/${tacheID}?mode=modification`;
        break;
      case 2: // Pose de nouveaux équipements de cuisine
        url = `/administration/formules-et-tests/modifier-pose-equipements-cuisine/${tacheID}?mode=modification`;
        break;
      case 5: // Pose de revêtements muraux
        url = `/administration/formules-et-tests/modifier-revetements-muraux/${tacheID}?mode=modification`;
        break;
      case 8: // Pose de revêtements muraux
        url = `/administration/formules-et-tests/modifier-revetements-plafond/${tacheID}?mode=modification`;
        break;
      case 9: // Pose de revêtements muraux
        url = `/administration/formules-et-tests/modifier-revetements-sol/${tacheID}?mode=modification`;
        break;
      case 10: // Remplacement de portes
        url = `/administration/formules-et-tests/modifier-remplacement-portes/${tacheID}?mode=modification`;
        break;
      default:
        console.error('Type de travail inconnu :', type_de_travail_id);
        return;
    }
  
    // Redirection
    // window.location.href = url;

    this.router.navigateByUrl(url, {
      state: { mode: 'modification' } // optionnel
    });
  }
  


  categories: Categorie[] = [
    { nom: 'électricien' },
    { nom: 'maçon' },
    {  nom: 'peintre' }
  ];

  selectedCategorie: string | null = null;

  artisans: Artisan[] = [];
  filteredArtisans: Artisan[] = [];
  selectedArtisans: number[] = [];
  artisansAjoutes: Artisan[] = [];

  onCategorieChange() {
    if (this.selectedCategorie != null) {
      this.filteredArtisans = this.artisans.filter(
        a => a.CategorieArtisan === this.selectedCategorie
      );
      this.selectedArtisans = [];
    } else {
      this.filteredArtisans = [...this.artisans]; // tous les artisans
    }
  }

  ajouterArtisans() {
    const nouveaux = this.artisans.filter(a => 
      this.selectedArtisans.includes(a.Id) &&
      !this.artisansAjoutes.some(x => x.Id === a.Id)
    );
    this.artisansAjoutes = [...this.artisansAjoutes, ...nouveaux];
    this.selectedArtisans = [];
    const payload = {
      Utilisateur: this.devispiece.Utilisateur,
      AdresseIP: this.devispiece.AdresseIP,
      Date: this.devispiece.Date,
      Commentaire: this.devispiece.Commentaire,
      Prix: this.devispiece.Prix,
      Payed: this.devispiece.Payed,
      VisiteFaite: this.devispiece.VisiteFaite,
      VisiteID: this.devispiece.VisiteID,
      UtilisateurID: this.devispiece.UtilisateurID,
      selected_artisans: this.artisansAjoutes.map(a => a.Id)
    };


    console.log(payload)
    this.devisService.updateDevisPiece(parseInt(this.devisId), payload).subscribe(
      (response) => {
       
        this.pieces=response;
        console.log("réponse de la requette get pieces",this.pieces);
      },
      (error) => {
        console.error('Erreur lors de la recuperation des pieces :', error);
      }
    );
  }

  supprimerArtisan(id: number) {
    this.artisansAjoutes = this.artisansAjoutes.filter(a => a.Id !== id);

    const payload = {
      Utilisateur: this.devispiece.Utilisateur,
      AdresseIP: this.devispiece.AdresseIP,
      Date: this.devispiece.Date,
      Commentaire: this.devispiece.Commentaire,
      Prix: this.devispiece.Prix,
      Payed: this.devispiece.Payed,
      VisiteFaite: this.devispiece.VisiteFaite,
      VisiteID: this.devispiece.VisiteID,
      UtilisateurID: this.devispiece.UtilisateurID,
      selected_artisans: this.artisansAjoutes.map(a => a.Id)
    };


    this.devisService.updateDevisPiece(parseInt(this.devisId), payload).subscribe(
      (response) => {
       
        this.pieces=response;
        console.log("réponse de la requette get pieces",this.pieces);
      },
      (error) => {
        console.error('Erreur lors de la recuperation des pieces :', error);
      }
    );
  }

}