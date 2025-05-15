import { Component } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { ApiConceptsEtTravauxService } from '../../../../Services/api-concepts-et-travaux.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';
import { AuthService } from '../../../../Services/auth.service';
import { NzSelectSizeType } from 'ng-zorro-antd/select';


// Définir le type des valeurs du formulaire avec la propriété Autorisations
interface FormValues {
  Nom?: string;
  Status?: string;
  Description?: string;
  User_id?: number;
  Client_id?: number;
  Artisans?: any[]; // Type de la liste des arttisans, ajustez selon le besoin
  Devis?: any[]; // Type de la liste des devis, ajustez selon le besoin
}
@Component({
  selector: 'app-ajouter-projet',
  templateUrl: './ajouter-projet.component.html',
  styleUrl: './ajouter-projet.component.css'
})
export class AjouterProjetComponent {

  validateForm: FormGroup<{
    Nom: FormControl<string>;
    Description: FormControl<string>;
    Date_de_debut_des_travaux: FormControl<Date>;
    Date_de_fin_des_travaux: FormControl<Date>;
    User_id: FormControl<number>;
    Client_id: FormControl<number>;
  }>;
  particuliers: any;
  particulier:any
  artisans: any;
  devis:any
  size: NzSelectSizeType = 'default';
  multipleValue : number[] = [];
  multipleValue2 : number[] = [];
  submitForm(): void {
    this.userService.getUserById(this.validateForm.controls["Client_id"].value).subscribe(
      (response: any) => {
        console.log('particulier récupéré :', response);
        this.particulier=response
        const currentDate = new Date();
        const formattedDate = `${currentDate.getFullYear()}-${this.padZero(currentDate.getMonth() + 1)}-${this.padZero(currentDate.getDate())}`;
        const formattedTime = `${this.padZero(currentDate.getHours())}:${this.padZero(currentDate.getMinutes())}:${this.padZero(currentDate.getSeconds())}`;
        const horodatage = `${formattedDate} ${formattedTime}`;
        this.validateForm.patchValue({
          Nom: horodatage+" "+this.particulier.Nom+" "+this.particulier.Prenom
        });
        if (this.validateForm.valid) {
          const formValues: FormValues = { ...this.validateForm.value };
          // Ajout du champ 'Autorisations' avec la liste des autorisations
          formValues.Artisans = this.multipleValue;
          formValues.Devis = this.multipleValue2;
          // Affichage du formulaire modifié
          console.log('valeur soumises :', formValues)
          this.userService.add_projet(formValues).subscribe(
            (response: any) => {
              console.log('projet ajoutée avec succès :', response);
              this.message.create('success', `projet ajoutée avec succès`);
              this.router.navigate(['/administration/projets']);
            },
            (error: any) => {
              console.error('Erreur lors de l\'ajout de l\'projet :', error);
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
      },
      (error: any) => {
        console.error('Erreur lors de la recuperation du particulier :', error);
      }
    );

    ;
      /*this.userService.add_projet(this.validateForm.value).subscribe(
        (response: any) => {
          console.log('projet ajoutée avec succès :', response);
          this.message.create('success', `projet ajoutée avec succès`);
          this.router.navigate(['/administration/projets']);
        },
        (error: any) => {
          console.error('Erreur lors de l\'ajout de l\'projet :', error);
        }
      );
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });*/
    
  }


private padZero(num: number): string {
      return num < 10 ? `0${num}` : `${num}`;
    }


  constructor(private fb: NonNullableFormBuilder,private auth:AuthService,private userService: ApiConceptsEtTravauxService,private message: NzMessageService, private router: Router) {
   
    
    
    this.validateForm = this.fb.group({
      Nom: ["", [Validators.required]],
      Description: ['', [Validators.required]],
      Date_de_debut_des_travaux: [new Date(), []],
      Date_de_fin_des_travaux: [new Date(), []],
      User_id: [this.auth.getDataFromLocal("utilisateur").Id , []],
      Client_id: [0, []],
    });
  }

 
  ngOnInit(): void {
    this.userService.getUsersByRole(3).subscribe(
      (response: any) => {
        console.log('liste des particuliers récupérée :', response);
        this.particuliers=response
        //this.message.create('success', `liste des particuliers récupérée`);
      },
      (error: any) => {
        console.error('Erreur lors de la recuperation des particuliers :', error);
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
  }

  
}
