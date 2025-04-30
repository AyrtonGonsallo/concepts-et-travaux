import { Component } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../../Services/auth.service';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ApiConceptsEtTravauxService } from '../../../../Services/api-concepts-et-travaux.service';
import { DevisTache } from '../../../../Models/DevisTache';
import { DevisPiece } from '../../../../Models/DevisPiece';
import { CalculDevisService } from '../../../../Services/calcul-devis.service';
import { Paiement } from '../../../../Models/Paiement';

@Component({
  selector: 'app-modifier-devis-piece',
  templateUrl: './modifier-devis-piece.component.html',
  styleUrl: './modifier-devis-piece.component.css'
})
export class ModifierDevisPieceComponent {

  validateForm: FormGroup<{
    Username: FormControl<string>;
    AdresseIP: FormControl<string>;
    UtilisateurID: FormControl<number>;
    Date: FormControl<string>;
    Commentaire: FormControl<string>;
    PieceID: FormControl<number>;
    Prix: FormControl<number>;
    Payed: FormControl<boolean>;
    VisiteFaite: FormControl<boolean>;
    VisiteID: FormControl<number>;
    DevisID: FormControl<number>;
    
  }>;
 
  submitForm(): void {
    
    if (this.validateForm.valid) {

      console.log('submit', this.validateForm.value);
      this.devisService.updateDevisPiece(parseInt(this.devisId),this.validateForm.value).subscribe(
        (response) => {
          console.log('Devis modifié avec succès :', response);
          this.message.create('success', `Devis modifié avec succès`);
          this.router.navigate(['/administration/devis-pieces']);
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



  constructor(private authService: AuthService,private calculDevisService:CalculDevisService,private fb: NonNullableFormBuilder,private http: HttpClient,private devisService: ApiConceptsEtTravauxService, private route: ActivatedRoute,private message: NzMessageService, private router: Router) {
    this.validateForm = this.fb.group({
      Username: ['', [Validators.required]],
      AdresseIP: ['', [Validators.required]],
      Date: ['', [Validators.required]],
      Commentaire: ['', []],
      PieceID: [0, []],
      UtilisateurID: [0, []],
      Prix: [0, []],
      Payed: [false, []],
      VisiteFaite: [false, []],
      VisiteID: [0, []],
      DevisID: [0, []],
      
    });

   
  }

  
  devisId="";
  ngOnInit(): void {
    // Obtenez l'ID de l'devis à partir de l'URL
    this.devisId = (this.route.snapshot.paramMap.get('id')??'0');
    // Utilisez l'ID pour récupérer les détails de l'devis
    this.getDetails(this.devisId);
    this.getPieces();
    this.get_all_devis_paiements(this.devisId);
    this.paiementForm = this.fb.group({
      TypeDePaiement: this.fb.control<string | null>(null, Validators.required),
      Type: this.fb.control<string | null>(null, Validators.required),
      Montant: this.fb.control<number | null>(null, Validators.required),
      Date: this.fb.control<string | null>(new Date().toISOString(), Validators.required), // Date du jour
      DevisID: this.fb.control<number | null>(parseInt(this.devisId), Validators.required), // devispiece.ID sera assigné dynamiquement
    });
  }
  apiBaseUrl: string = `${environment.apiUrl}/open-file/`;
  // Méthode pour récupérer les détails de l'devis à partir de l'API
  getDetails(devisId: string): void {
    this.devisService.getDevisPieceById( parseInt(devisId, 10)).subscribe(
      (response) => {
        this.devispiece=response
       this.listOfTaches=response.DevisTaches
        this.validateForm.patchValue(response);
        console.log("réponse de la requette get_devis",response);
        this.visiteForm = this.fb.group({
          DateDeProgrammation: this.fb.control<Date | null>((this.devispiece.Visite)?this.devispiece.Visite.DateDeProgrammation:null, [ Validators.required, ]),
          Objet: this.fb.control< string| null>("prog_date", [ Validators.required, ])
        });
      },
      (error) => {
        console.error('Erreur lors de la recuperation des details devis :', error);
      }
    );
    
  }

  get_all_devis_paiements(devisId: string): void {
    this.devisService.get_all_devis_paiements( parseInt(devisId, 10)).subscribe(
      (response) => {
        this.paiements=response
        console.log("réponse de la requette get_paiments",response);
        
      },
      (error) => {
        console.error('Erreur lors de la recuperation des details paiments :', error);
      }
    );
    
  }
  devispiece:any
  pieces:any[]=[];
  paiements:Paiement[] = [];
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
 
  
  
  visiteForm: FormGroup<{
    DateDeProgrammation: FormControl<Date | null>;
    Objet: FormControl<string | null>;
    
  }> = this.fb.group({
    DateDeProgrammation: this.fb.control<Date | null>(null, [Validators.required]),
    Objet: this.fb.control<string | null>('prog_date', [ Validators.required, ])
  });
  add_visite_date(){
  


    if (this.visiteForm.valid) {
      const dateProg = this.visiteForm.get('DateDeProgrammation')?.value;
      const obj = this.visiteForm.get('Objet')?.value;
      const visiteData = {
        Date: new Date().toISOString(), // Génère la date actuelle au format ISO
        DateDeProgrammation:dateProg
      };
      if(obj=="prog_date"){
        console.log('Visite envoyée :', visiteData);
        this.devisService.update_visite(this.devispiece.Visite.ID, visiteData).subscribe(
          (response) => {
            console.log('Visite programée avec succès :', response);
            this.message.success("Visite programée avec succès")        
            this.devisService.send_visite_scheduled(this.devispiece.Visite.ID).subscribe(
              (response) => {
                console.log('Message de visite programmée envoyé au client avec succès :', response);
                this.message.success("Message de visite programmée envoyé au client avec succès")        
               
              },
              (error) => {
                console.error('Erreur lors de l\'envoi du message de visite programmée :', error);
              }
            );
          },
          (error) => {
            console.error('Erreur lors de l\'ajout de la visite :', error);
          }
        );
      }else{
        this.devisService.send_visite_done(this.devispiece.Visite.ID).subscribe(
          (response) => {
            console.log('Message de visite terminée envoyé au client avec succès :', response);
            this.message.success("Message de visite terminée envoyé au client avec succès")        
           
          },
          (error) => {
            console.error('Erreur lors de l\'envoi du message de visite terminée :', error);
          }
        );
      }
      
    } else {
      Object.values(this.visiteForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }

  
  }

  notify_client_visit_ended(){

  }

  paiementForm: FormGroup<{
    TypeDePaiement: FormControl<string | null>;
    Type: FormControl<string | null>;
    Montant: FormControl<number | null>;
    Date: FormControl<string | null>;
    DevisID: FormControl<number | null>;
  }> = this.fb.group({
    TypeDePaiement: this.fb.control<string | null>(null, Validators.required),
    Type: this.fb.control<string | null>(null, Validators.required),
    Montant: this.fb.control<number | null>(null, Validators.required),
    Date: this.fb.control<string | null>(null, Validators.required), // Date du jour
    DevisID: this.fb.control<number | null>(null, Validators.required), // devispiece.ID sera assigné dynamiquement
  });
  

  submitpaiementForm(): void {
    if (this.paiementForm.valid) {
      console.log('submit', this.paiementForm.value);
      this.devisService.add_paiement(this.paiementForm.value).subscribe(
        (response) => {
          console.log('paiement ajouté avec succès :', response);
          this.message.create('success', `paiement ajouté avec succès`);
          this.get_all_devis_paiements(this.devisId);
        },
        (error) => {
          console.error('Erreur lors de l\'ajout du paiement :', error);
        }
      );
    } else {
      Object.values(this.paiementForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
  cancel(): void {
    this.message.info('suppression annulée');
  }
  deletePaiement(p_Id: number) {
    if (this.authService.isAdminorSuperAdmin()) {
      this.devisService.delete_paiement(p_Id).subscribe(
        () => {
          //console.log('DevisPiece supprimé avec succès');
          this.message.success( 'Paiement supprimé avec succès');
          // Mettez ici le code pour actualiser la liste des devis_pieces si nécessaire
          this.get_all_devis_paiements((this.devisId));
        },
        (error) => {
          console.error('Erreur lors de la suppression de l\'utilisateur :', error);
          this.message.error( 'Erreur lors de la suppression de l\'utilisateur');
        }
      );
      
      return true
    } else {
      this.message.info( `Vous n'avez pas assez de privilèges pour faire cette opération`);
      return false;
    }
    
  }

  modifier_tache(type_de_travail_id: number|undefined, tacheID: number) {
    let url = '';
  
    switch (type_de_travail_id) {
      case 4: // Création de murs non porteurs
        url = `/admin/administration/formules-et-tests/modifier-creation-murs-non-porteur/${tacheID}?mode=modification`;
        break;
      case 3: // Démolition de cloisons ou ouverture partielle
        url = `/admin/administration/formules-et-tests/modifier-demolition-cloisons/${tacheID}?mode=modification`;
        break;
      case 7: // Dépose des anciennes installations de salle de bain
        url = `/admin/administration/formules-et-tests/modifier-installation-sanitaires/${tacheID}?mode=modification`;
        break;
      case 13: // Rénovation électrique partielle
        url = `/admin/administration/formules-et-tests/modifier-renovation-electrique/${tacheID}?mode=modification`;
        break;
      case 15: // Rénovation électrique complète
        url = `/admin/administration/formules-et-tests/modifier-renovation-electrique-complete/${tacheID}?mode=modification`;
        break;
      case 12: // Remplacement de radiateur
        url = `/admin/administration/formules-et-tests/modifier-remplacement-radiateur/${tacheID}?mode=modification`;
        break;
      case 16: // Installation de nouveaux équipements sanitaires
        url = `/admin/administration/formules-et-tests/modifier-installation-sanitaires/${tacheID}?mode=modification`;
        break;
      case 2: // Pose de nouveaux équipements de cuisine
        url = `/admin/administration/formules-et-tests/modifier-pose-equipements-cuisine/${tacheID}?mode=modification`;
        break;
      case 5: // Pose de revêtements muraux
        url = `/admin/administration/formules-et-tests/modifier-revetements-muraux/${tacheID}?mode=modification`;
        break;
      case 8: // Pose de revêtements muraux
        url = `/admin/administration/formules-et-tests/modifier-revetements-plafond/${tacheID}?mode=modification`;
        break;
      case 9: // Pose de revêtements muraux
        url = `/admin/administration/formules-et-tests/modifier-revetements-sol/${tacheID}?mode=modification`;
        break;
      case 10: // Remplacement de portes
        url = `/admin/administration/formules-et-tests/modifier-remplacement-portes/${tacheID}?mode=modification`;
        break;
      default:
        console.error('Type de travail inconnu :', type_de_travail_id);
        return;
    }
  
    // Redirection
    window.location.href = url;
  }
  

}