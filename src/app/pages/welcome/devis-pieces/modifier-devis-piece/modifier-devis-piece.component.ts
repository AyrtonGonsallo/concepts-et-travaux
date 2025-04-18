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
      this.devisService.updateDevisPiece(this.devisId,this.validateForm.value).subscribe(
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

  
  devisId:number =  parseInt(this.route.snapshot.paramMap.get('id')??'0');
  ngOnInit(): void {
    // Obtenez l'ID de l'devis à partir de l'URL
    const devisId = this.route.snapshot.paramMap.get('id')??'0';
    // Utilisez l'ID pour récupérer les détails de l'devis
    this.getDetails(devisId);
    this.getPieces();
    this.get_all_devis_paiements(devisId);
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
  expandSet = new Set<number>();
  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }
  detailsCalcul:any
  
  calculer_prix(tid:number,index:number){
   

    this.calculDevisService.calculer_prix(this.devispiece, index).then((result) => {
      this.detailsCalcul = result
      console.log("Prix reçu :", this.detailsCalcul);
    }).catch((error) => {
      console.error("Erreur lors du calcul :", error);
    });
  }
  new_json:any
  editjson(id:number,json:any){
    
    this.want_to_edit=true
    setTimeout(() => {
      this.is_editing=!this.is_editing
    }, 2000);
    if(this.is_editing){
      this.new_json=json
    }
    else{
      this.devisService.edit_devis_tache(id,JSON.parse(this.new_json) ).subscribe(
        (response) => {
          console.log('Tâche modifiée avec succès :', response);
          this.edited = true;
          setTimeout(() => {
            this.edited = false;
            this.want_to_edit=false
          }, 2000); // Cache le message après 2 secondes
          //this.message.create('success', `Devis modifié avec succès`);
          //this.router.navigate(['/administration/devis-pieces']);
        },
        (error) => {
          console.error('Erreur lors de la modification de la tâche :', error);
        }
      );
      
    }
  }

  copied: boolean = false;
  want_to_edit: boolean = false;
  is_editing: boolean = true;
  edited: boolean = false;
  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(
      () => {
        this.copied = true;
        setTimeout(() => {
          this.copied = false;
        }, 2000); // Cache le message après 2 secondes
      },
      (err) => {
        console.error('Erreur lors de la copie :', err);
      }
    );
  }
  

  add_visite(){
    const visiteData = {
      Date: new Date().toISOString(), // Génère la date actuelle au format ISO
      Paye: 0
    };
    this.devisService.add_visite( visiteData).subscribe(
      (response) => {
        console.log('Visite ajoutee avec succès :', response);
        this.validateForm.patchValue({ VisiteID: response.ID });
        this.devisService.updateDevisPiece(this.devisId,this.validateForm.value).subscribe(
          (response) => {
            console.log('Devis modifié avec succès :', response);
            this.message.create('success', `Visite ajoutée et devis modifié avec succès`);
            //this.router.navigate(['/administration/devis-pieces']);
          },
          (error) => {
            console.error('Erreur lors de la modification de l\'devis :', error);
          }
        );
       
      },
      (error) => {
        console.error('Erreur lors de l\'ajout de la visite :', error);
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
    Date: this.fb.control<string | null>(new Date().toISOString(), Validators.required), // Date du jour
    DevisID: this.fb.control<number | null>(this.devisId, Validators.required), // devispiece.ID sera assigné dynamiquement
  });
  

  submitpaiementForm(): void {
    if (this.paiementForm.valid) {
      console.log('submit', this.paiementForm.value);
      this.devisService.add_paiement(this.paiementForm.value).subscribe(
        (response) => {
          console.log('paiement ajouté avec succès :', response);
          this.message.create('success', `paiement ajouté avec succès`);
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
  add_paiement(){

  }
}