import { Component } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { ApiConceptsEtTravauxService } from '../../../../Services/api-concepts-et-travaux.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-modifier-etape',
  templateUrl: './modifier-etape.component.html',
  styleUrl: './modifier-etape.component.css'
})
export class ModifierEtapeDevisComponent {

  validateForm: FormGroup<{
    Titre: FormControl<string>;
    Sous_titre: FormControl<string>;
    Description: FormControl<string>;
    Description_chambre: FormControl<string>;
    Description_sdb: FormControl<string>;
    Description_salle_manger: FormControl<string>;
    Description_wc: FormControl<string>;
    Description_cuisine: FormControl<string>;
    Description_salon: FormControl<string>;
    TravailID: FormControl<number>;
    Etape: FormControl<string>;
  }>;

  liste_des_etapes = [
    'Choix de la pièce',
    'Travaux',
    'Étape 1 (Dimensions)',
    'Étape 2 (Etat de surfaces)',
    'Étape 3 (Gamme de produits)',
    'Recapitulatif',
    'Finalisation'
  ] as const;
 //Description_chambre,Description_sdb,Description_salle_manger,Description_wc,Description_cuisine,Description_salon
  etapeId:string =  this.route.snapshot.paramMap.get('id')??'0';

  submitForm(): void {
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);
      this.userService.updateEtapeDevis (parseInt(this.etapeId) ,this.validateForm.value).subscribe(
        (response: any) => {
          console.log('Nota Bene modifié avec succès :', response);
          this.message.create('success', `Nota Bene modifié avec succès`);
          this.router.navigate(['/administration/nota-bene']);
        },
        (error: any) => {
          console.error('Erreur lors de la modification du Nota Bene :', error);
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





  constructor(private fb: NonNullableFormBuilder,private route: ActivatedRoute,private userService: ApiConceptsEtTravauxService,private message: NzMessageService, private router: Router) {
    this.validateForm = this.fb.group({
      Titre: ['', [Validators.required]],
      Sous_titre: ['', []],
      Description: ['', [Validators.required]],
      Description_chambre: ['', []],
      Description_sdb: ['', []],
      Description_salle_manger: ['', []],
      Description_wc: ['', []],
      Description_cuisine: ['', []],
      Description_salon: ['', []],
      TravailID: [0, []],
      Etape: ['', [Validators.required]],
    });
  }
 //Description_chambre,Description_sdb,Description_salle_manger,Description_wc,Description_cuisine,Description_salon

  etape:any
 
  ngOnInit(): void {
    this.getDetails(parseInt(this.etapeId, 10))
    this.getTravaux()
  }
  getDetails(id: number): void {
    this.userService.getEtapeDevisById(id ).subscribe(
      (response) => {
        
        this.validateForm.patchValue(response);
        console.log("réponse de la requette getdetails",response);
      },
      (error) => {
        console.error('Erreur lors de la recuperation des details  :', error);
      }
    );
    
  }
  
  travaux:any[]=[];
  getTravaux(): void {
    this.userService.getTravaux().subscribe(
      (response) => {
       
        this.travaux=response;
        console.log("réponse de la requette get travaux",this.travaux);
      },
      (error) => {
        console.error('Erreur lors de la recuperation des travaux :', error);
      }
    );
  }
}