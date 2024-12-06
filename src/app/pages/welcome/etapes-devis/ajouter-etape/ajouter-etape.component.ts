import { Component } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { ApiConceptsEtTravauxService } from '../../../../Services/api-concepts-et-travaux.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';
@Component({
  selector: 'app-ajouter-etape',
  templateUrl: './ajouter-etape.component.html',
  styleUrl: './ajouter-etape.component.css'
})
export class AjouterEtapeDevisComponent {

  validateForm: FormGroup<{
    Titre: FormControl<string>;
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
    'Dimensions',
    'Etat de surfaces',
    'Gamme de produits',
    'Recapitulatif',
    'Finalisation'
  ] as const;

  submitForm(): void {
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);
      this.userService.add_etape_devis(this.validateForm.value).subscribe(
        (response: any) => {
          console.log('Nota Bene ajouté avec succès :', response);
          this.message.create('success', `Nota Bene ajouté avec succès`);
          this.router.navigate(['/administration/nota-bene']);
        },
        (error: any) => {
          console.error('Erreur lors de l\'ajout du Nota Bene :', error);
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





  constructor(private fb: NonNullableFormBuilder,private userService: ApiConceptsEtTravauxService,private message: NzMessageService, private router: Router) {
    this.validateForm = this.fb.group({
      Titre: ['', [Validators.required]],
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

 
  ngOnInit(): void {
    this.getTravaux()
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


