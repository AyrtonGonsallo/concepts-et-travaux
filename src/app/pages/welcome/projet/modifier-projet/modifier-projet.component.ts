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
import { Remise } from '../../../../Models/Remise';
// Définir le type des valeurs du formulaire avec la propriété Autorisations
interface ArtisanOption {
  label: string;
  value: number;
  checked: boolean;
}

@Component({
  selector: 'app-modifier-projet',
  templateUrl: './modifier-projet.component.html',
  styleUrl: './modifier-projet.component.css'
})
export class ModifierProjetComponent {
  size: NzSelectSizeType = 'default';
  paiements:Paiement[] = [];
  remises:Remise[] = [];
  project:any;
  paiement_visite=false
  date_paiement_visite=""
  programmation_visite=false
  date_programmation_visite=""
  projet_valide=false
  date_validation_projet=""
  paiement_autorise=false
  date_autorisation_paiement=""
  acompte_paye=false
  date_paiement_acompte=""
  travaux_demarres=false
  travaux_en_cours=false
  travaux_acheves=false
  travaux_livres=false
  notes_remarques=""


  artisans: any;
 checkOptionsOne: ArtisanOption[] = [];

 
add_artisan(value: object[]): void {
   // console.log(value);
  }
  
  save(): void {
    const selectedIds = this.checkOptionsOne
    .filter(option => option.checked)
    .map(option => option.value);


    const etatProjet = {
      projet_id:this.projetId,
    paiement_visite: this.paiement_visite? 1 : 0,
    programmation_visite: this.programmation_visite? 1 : 0,
    projet_valide: this.projet_valide? 1 : 0,
    paiement_autorise: this.paiement_autorise? 1 : 0,
    acompte_paye: this.acompte_paye? 1 : 0,
    travaux_demarres: this.travaux_demarres? 1 : 0,
    travaux_en_cours: this.travaux_en_cours? 1 : 0,
    travaux_acheves: this.travaux_acheves? 1 : 0,
    travaux_livres: this.travaux_livres? 1 : 0,
    notes_remarques: this.notes_remarques,
    selected_artisans:selectedIds
    

  };

  console.log("JSON du projet :", etatProjet);
  this.userService.update_project_status(etatProjet).subscribe(
      (response: any) => {
       
        console.log('reponse de la mise a jour :', response);
       
        this.message.create('success', `Informations du projet mises à jour`);
      },
      (error: any) => {
        console.error('Erreur lors de la recuperation de la mise à jour :', error);
      }
    );
  }

  isLoadingSave = false;
  loadSave(): void {
    this.isLoadingSave = true;
    this.save()
    setTimeout(() => {
      this.isLoadingSave = false;
    }, 5000);
  }

  devis:any

  constructor(private fb: NonNullableFormBuilder,private userService: ApiConceptsEtTravauxService,private authService: AuthService,private calculDevisService:CalculDevisService, private route: ActivatedRoute,private message: NzMessageService, private router: Router) {
    
  }

  projetId:string =  this.route.snapshot.paramMap.get('id')??'0';

  ngOnInit(): void {
    this.userService.getUsersByRole(2).subscribe(
      (response: any) => {
       
        console.log('liste des artisans récupérée :', response);
        response.forEach((artisan: { Nom: any;Prenom: any; Id: number; }) => {
          this.checkOptionsOne.push({
            label: artisan.Nom+' '+artisan.Prenom,
            value:  artisan.Id ,
            checked: false
          });
        });

         this.getProjetDetails(this.projetId);
        
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
    this.get_all_projet_remises(this.projetId);

    this.paiementForm = this.fb.group({
      TypeDePaiement: this.fb.control<string | null>(null, Validators.required),
      Commentaire: this.fb.control<string | null>(null, Validators.required),
      Titre: this.fb.control<string | null>(null, Validators.required),
      Type: this.fb.control<string | null>(null, Validators.required),
      Montant: this.fb.control<number | null>(null, Validators.required),
      Requette: this.fb.control<string | null>("demande", Validators.required),
      Status: this.fb.control<boolean | null>(false, Validators.required),
      DateCreation: this.fb.control<string | null>(new Date().toISOString(), Validators.required), // Date du jour
      ProjetID: this.fb.control<number | null>(parseInt(this.projetId), Validators.required), // devispiece.ID sera assigné dynamiquement
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

    get_all_projet_remises(devisId: string): void {
      this.userService.get_all_projet_remises( parseInt(devisId, 10)).subscribe(
        (response) => {
          this.remises=response
          console.log("réponse de la requette get_all_projet_remises",response);
          
        },
        (error) => {
          console.error('Erreur lors de la recuperation des get_all_projet_remises :', error);
        }
      );
      
    }
  // Méthode pour récupérer les détails de l'utilisateur à partir de l'API
  getProjetDetails(userId: string): void {
    this.userService.get_projet( parseInt(userId, 10)).subscribe(
      (response) => {
        this.project=response
        this.paiement_visite=this.project.Visite?.Paye
        this.date_paiement_visite=this.project.Visite?.Date
        this.programmation_visite=(this.project.Visite?.DateDeProgrammation)?true:false
        this.date_programmation_visite=this.project.Visite?.DateDeProgrammation
        this.projet_valide=(this.project.Date_de_validation)?true:false
        this.date_validation_projet=this.project.Date_de_validation
        this.paiement_autorise=this.project.Valider
        this.notes_remarques=this.project.Description
        this.acompte_paye=(this.project.Payed)?true:false
        this.date_paiement_acompte=this.project.Date_de_paiement_acompte
        this.date_de_programmation=(this.project.Visite)?this.project.Visite.DateDeProgrammation:null
        const artisanIdsProjet = this.project.Artisans.map((a: { Id: any; }) => a.Id); // Récupère les IDs associés au projet

        this.checkOptionsOne.forEach(option => {
          if (artisanIdsProjet.includes(option.value)) {
            option.checked = true;
          }
        });
        
        switch (this.project.Status) {
          case "travaux démarrés":
            this.travaux_demarres=true
            break;
          case "travaux en cours":
            this.travaux_demarres=true
            this.travaux_en_cours=true
            break;
          case "travaux achevés":
            this.travaux_demarres=true
            this.travaux_en_cours=true
            this.travaux_acheves=true
            break;
          case "travaux livrés":
            this.travaux_demarres=true
            this.travaux_en_cours=true
            this.travaux_acheves=true
            this.travaux_livres=true
            break;
        
          default:
            break;
        }
        
        console.log("réponse de la requette get_projet",this.project);

      },
      (error) => {
        console.error('Erreur lors de la recuperation des details projet :', error);
      }
    );
    
  }
  



  paiementForm: FormGroup<{
    TypeDePaiement: FormControl<string | null>;
    Commentaire: FormControl<string | null>;
    Titre: FormControl<string | null>;
    Type: FormControl<string | null>;
    Montant: FormControl<number | null>;
    Requette: FormControl<string | null>;
    Status: FormControl<boolean | null>;
    DateCreation: FormControl<string | null>;
    ProjetID: FormControl<number | null>;
  }> = this.fb.group({
    TypeDePaiement: this.fb.control<string | null>(null, Validators.required),
    Commentaire: this.fb.control<string | null>(null, Validators.required),
    Titre: this.fb.control<string | null>(null, Validators.required),
    Type: this.fb.control<string | null>(null, Validators.required),
    Montant: this.fb.control<number | null>(null, Validators.required),
    Requette: this.fb.control<string | null>("demande", Validators.required),
    Status: this.fb.control<boolean | null>(false, Validators.required),
    DateCreation: this.fb.control<string | null>(null, Validators.required), // Date du jour
    ProjetID: this.fb.control<number | null>(null, Validators.required), // devispiece.ID sera assigné dynamiquement
  });

  
  remiseForm: FormGroup<{
    Titre: FormControl<string | null>;
    Type: FormControl<string | null>;
    Pourcentage: FormControl<number | null>;
    Valeur: FormControl<number | null>;
    Commentaire: FormControl<string | null>;
    ProjetID: FormControl<number | null>;
  }> = this.fb.group({
    Titre: this.fb.control<string | null>(null, Validators.required),
    Type: this.fb.control<string | null>(null, Validators.required),
    Pourcentage: this.fb.control<number | null>(null, ),
    Valeur: this.fb.control<number | null>(null, ),
    Commentaire: this.fb.control<string | null>(null, ),
    ProjetID: this.fb.control<number | null>(parseInt(this.projetId), Validators.required), // devispiece.ID sera assigné dynamiquement
  });
  

  submitpaiementForm(): void {
    if (this.paiementForm.valid) {
      console.log('submit', this.paiementForm.value);
      
      this.userService.add_demande_paiement(this.paiementForm.value).subscribe(
        (response) => {
          console.log('paiement ajouté avec succès :', response);
          this.message.create('success', `paiement ajouté avec succès`);
          this.get_all_projet_paiements(this.projetId);
          this.paiementForm = this.fb.group({
            TypeDePaiement: this.fb.control<string | null>(null, Validators.required),
            Commentaire: this.fb.control<string | null>(null, Validators.required),
            Titre: this.fb.control<string | null>(null, Validators.required),
            Type: this.fb.control<string | null>(null, Validators.required),
            Montant: this.fb.control<number | null>(null, Validators.required),
            Requette: this.fb.control<string | null>("demande", Validators.required),
            Status: this.fb.control<boolean | null>(false, Validators.required),
            DateCreation: this.fb.control<string | null>(null, Validators.required), // Date du jour
            ProjetID: this.fb.control<number | null>(null, Validators.required), // devispiece.ID sera assigné dynamiquement
          });
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


  
  submitremiseForm(): void {
    if (this.remiseForm.valid) {
      console.log('submit', this.remiseForm.value);
      
      this.userService.add_remise(this.remiseForm.value).subscribe(
        (response) => {
          console.log('remise ajoutée avec succès :', response);
          this.message.create('success', `remise ajoutée avec succès`);
          this.get_all_projet_remises(this.projetId);
          this.remiseForm = this.fb.group({
            Titre: this.fb.control<string | null>(null, Validators.required),
            Type: this.fb.control<string | null>(null, Validators.required),
            Pourcentage: this.fb.control<number | null>(null, ),
            Valeur: this.fb.control<number | null>(null, ),
            Commentaire: this.fb.control<string | null>(null, ),
            ProjetID: this.fb.control<number | null>(parseInt(this.projetId) , Validators.required), // devispiece.ID sera assigné dynamiquement
          });
        },
        (error) => {
          console.error('Erreur lors de l\'ajout de la remise :', error);
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

  ressendPaiement(id:number): void {
    
      
      this.userService.ressend_demande_paiement(id).subscribe(
        (response) => {
          console.log('rappel de demande de paiement envoyé avec succès :', response);
          this.message.create('success', `rappel de demande de paiement envoyé avec succès`);
        },
        (error) => {
          console.error('Erreur lors de l\'envoi du rappel :', error);
        }
      );

    
  }

  update_status_demande_paiement(id:number): void {
    
      
      this.userService.update_status_demande_paiement(id).subscribe(
        (response) => {
          console.log('changement de status effectué avec succès :', response);
          this.message.create('success', `changement de status effectué avec succès`);
          this.get_all_projet_paiements(this.projetId);
        },
        (error) => {
          console.error('Erreur lors du changement de status :', error);
        }
      );

    
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
          console.error('Erreur lors de la suppression du paiement :', error);
          this.message.error( 'Erreur lors de la suppression du paiement');
        }
      );
      
      return true
    } else {
      this.message.info( `Vous n'avez pas assez de privilèges pour faire cette opération`);
      return false;
    }
    
  }


  deleteRemise(p_Id: number) {
    if (this.authService.isAdminorSuperAdmin()) {
      this.userService.delete_remise(p_Id).subscribe(
        () => {
          //console.log('DevisPiece supprimé avec succès');
          this.message.success( 'remise supprimée avec succès');
          // Mettez ici le code pour actualiser la liste des devis_pieces si nécessaire
          this.get_all_projet_remises((this.projetId));
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


  
  date_de_programmation=null
  notifier_le_client_que_la_visite_est_finie = false;
  add_visite_date(){
  


    if (this.notifier_le_client_que_la_visite_est_finie || this.date_de_programmation) {
      const dateProg = this.date_de_programmation;
      const visiteData = {
        DateCreation: new Date().toISOString(), // Génère la date actuelle au format ISO
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
      }
      
    } 

  
  }

  notify_client_visit_ended(){
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

   isLoadingvisit_ended = false;
  loadvisit_ended(): void {
    this.isLoadingvisit_ended = true;
    this.notify_client_visit_ended()
    setTimeout(() => {
      this.isLoadingvisit_ended = false;
    }, 5000);
  }


disableBeforeToday = (current: Date): boolean => {
  const today = new Date();
  // Supprime l'heure pour ne comparer que les dates
  today.setHours(0, 0, 0, 0);
  return current < today;
};
  

}