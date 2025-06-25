import { Component } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { ApiConceptsEtTravauxService } from '../../../../Services/api-concepts-et-travaux.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSelectSizeType } from 'ng-zorro-antd/select';
import { CalculDevisService } from '../../../../Services/calcul-devis.service';
import { AuthService } from '../../../../Services/auth.service';
import { Paiement } from '../../../../Models/Paiement';
import { Projet } from '../../../../Models/Projet';
// Définir le type des valeurs du formulaire avec la propriété Autorisations
interface FormValues {
  Nom?: string;
  Status?: string;
  Description?: string;
  User_id?: number;
  Client_id?: number;
  Valider?:boolean;
  Artisans?: any[]; // Type de la liste des artisans, ajustez selon le besoin
  Devis?: any[]; // Type de la liste des devis, ajustez selon le besoin
}

@Component({
  selector: 'app-modifier-projet',
  templateUrl: './modifier-projet.component.html',
  styleUrl: './modifier-projet.component.css'
})
export class ModifierProjetComponent {
  size: NzSelectSizeType = 'default';
  paiements:Paiement[] = [];
  project:any;

  validateForm: FormGroup<{
    Description: FormControl<string>;
    Status: FormControl<string>;
    Valider:FormControl<boolean>;
    Date_de_debut_des_travaux: FormControl<Date>;
    Date_de_fin_des_travaux: FormControl<Date>;
  }>;
   liste_des_status = [
    'visite à régler',
    'visite programmée',
    'projet validé',
    'acompte payé',
    'travaux démarrés',
    'travaux en cours',
    'travaux achevés',
    'travaux livrés'
  ] as const;
  multipleValue : number[] = [];
  multipleValue2 : number[] = [];
  artisans: any;
  
  submitForm(): void {
    if (this.validateForm.valid) {
      const formValues: FormValues = { ...this.validateForm.value };
          // Ajout du champ 'Autorisations' avec la liste des autorisations
          formValues.Artisans = this.multipleValue;
          formValues.Devis = this.multipleValue2;
          console.log('submit', formValues);
          this.userService.updateProjet(parseInt(this.projetId??'0'),formValues).subscribe(
            (response: any) => {
              console.log('projet modifiée avec succès :', response);
              this.message.create('success', `projet modifiée avec succès`);
              this.router.navigate(['/administration/projets']);
            },
            (error: any) => {
              console.error('Erreur lors de la modification de l\'projet :', error);
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



  devis:any

  constructor(private fb: NonNullableFormBuilder,private userService: ApiConceptsEtTravauxService,private authService: AuthService,private calculDevisService:CalculDevisService, private route: ActivatedRoute,private message: NzMessageService, private router: Router) {
    this.validateForm = this.fb.group({
      
    Description: ['', [Validators.required]],
    Status: ['', [Validators.required]],
    Valider: [false, [Validators.required]],
    Date_de_debut_des_travaux: [new Date(), []],
    Date_de_fin_des_travaux: [new Date(), []],
      
    });
  }

  projetId:string =  this.route.snapshot.paramMap.get('id')??'0';

  ngOnInit(): void {
    this.getProjetDetails(this.projetId);
    this.userService.getUsersByRole(2).subscribe(
      (response: any) => {
        console.log('liste des artisans récupérée :', response);
        this.artisans=response
        //this.message.create('success', `liste des artisans récupérée`);
      },
      (error: any) => {
        console.error('Erreur lors de la recuperation des artisans :', error);
      }
    );

    this.userService.getAllDevisPieces().subscribe(
      (response: any) => {
        console.log('liste des devis récupérée :', response);
        this.devis=response
      },
      (error: any) => {
        console.error('Erreur lors de la recuperation des devus :', error);
      }
    );

     this.get_all_projet_paiements(this.projetId);
        this.paiementForm = this.fb.group({
          TypeDePaiement: this.fb.control<string | null>(null, Validators.required),
          Type: this.fb.control<string | null>(null, Validators.required),
          Montant: this.fb.control<number | null>(null, Validators.required),
          Date: this.fb.control<string | null>(new Date().toISOString(), Validators.required), // Date du jour
          DevisID: this.fb.control<number | null>(parseInt(this.projetId), Validators.required), // devispiece.ID sera assigné dynamiquement
        });


  }



  get_all_projet_paiements(devisId: string): void {
      this.userService.get_all_projet_paiements( parseInt(devisId, 10)).subscribe(
        (response) => {
          this.paiements=response
          console.log("réponse de la requette get_paiments",response);
          
        },
        (error) => {
          console.error('Erreur lors de la recuperation des details paiments :', error);
        }
      );
      
    }
  // Méthode pour récupérer les détails de l'utilisateur à partir de l'API
  getProjetDetails(userId: string): void {
    this.userService.get_projet( parseInt(userId, 10)).subscribe(
      (response) => {
        this.project=response
        this.validateForm.patchValue(response);
        this.date_de_programmation=(this.project.Visite)?this.project.Visite.DateDeProgrammation:null
        response.Artisans.forEach((artisan: any) => {
          // Ajouter l'ID de l'artisan à multipleValue
          this.multipleValue.push(artisan.Id);
        });
        response.Devis.forEach((d: any) => {
          // Ajouter l'ID de l'artisan à multipleValue
          this.multipleValue2.push(d.ID);
        });
        console.log("réponse de la requette get_projet",this.project);
      },
      (error) => {
        console.error('Erreur lors de la recuperation des details projet :', error);
      }
    );
    
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
      this.userService.add_paiement(this.paiementForm.value).subscribe(
        (response) => {
          console.log('paiement ajouté avec succès :', response);
          this.message.create('success', `paiement ajouté avec succès`);
          this.get_all_projet_paiements(this.projetId);
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
      this.userService.delete_paiement(p_Id).subscribe(
        () => {
          //console.log('DevisPiece supprimé avec succès');
          this.message.success( 'Paiement supprimé avec succès');
          // Mettez ici le code pour actualiser la liste des devis_pieces si nécessaire
          this.get_all_projet_paiements((this.projetId));
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


  
  date_de_programmation=null
  notifier_le_client_que_la_visite_est_finie = false;
  add_visite_date(){
  


    if (this.notifier_le_client_que_la_visite_est_finie || this.date_de_programmation) {
      const dateProg = this.date_de_programmation;
      const visiteData = {
        Date: new Date().toISOString(), // Génère la date actuelle au format ISO
        DateDeProgrammation:dateProg
      };
      if(this.date_de_programmation && !this.notifier_le_client_que_la_visite_est_finie){
        console.log('Visite envoyée :', visiteData);
        this.userService.update_visite(this.project.Visite.ID, visiteData).subscribe(
          (response) => {
            console.log('Visite programée avec succès :', response);
            this.message.success("Visite programée avec succès")        
            this.userService.send_visite_scheduled(this.project.Visite.ID,this.project.Id).subscribe(
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
        this.userService.send_visite_done(this.project.Visite.ID,this.project.Id).subscribe(
          (response) => {
            console.log('Message de visite terminée envoyé au client avec succès :', response);
            this.message.success("Message de visite terminée envoyé au client avec succès")        
           
          },
          (error) => {
            console.error('Erreur lors de l\'envoi du message de visite terminée :', error);
          }
        );
      }
      
    } 

  
  }

  notify_client_visit_ended(){

  }
disableBeforeToday = (current: Date): boolean => {
  const today = new Date();
  // Supprime l'heure pour ne comparer que les dates
  today.setHours(0, 0, 0, 0);
  return current < today;
};
}