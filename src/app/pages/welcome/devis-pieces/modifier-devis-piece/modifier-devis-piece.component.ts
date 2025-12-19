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
    
    Commentaire: FormControl<string>;
   
    
  }>;
 
  submitForm(): void {
    
    if (this.validateForm.valid) {

      console.log('submit', this.validateForm.value);
      this.devisService.updateCommentaireDevisPiece(parseInt(this.devisId),this.validateForm.value).subscribe(
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



  constructor(private authService: AuthService,private fb: NonNullableFormBuilder,private http: HttpClient,private devisService: ApiConceptsEtTravauxService, private route: ActivatedRoute,private message: NzMessageService, private router: Router) {
    this.validateForm = this.fb.group({
      
      Commentaire: ['', []],
     
      
    });

   
  }

  
  devisId="";
  ngOnInit(): void {
    // Obtenez l'ID de l'devis à partir de l'URL
    this.devisId = (this.route.snapshot.paramMap.get('id')??'0');
    // Utilisez l'ID pour récupérer les détails de l'devis
    this.getDetails(this.devisId);
    this.getPieces();
   
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
  

}