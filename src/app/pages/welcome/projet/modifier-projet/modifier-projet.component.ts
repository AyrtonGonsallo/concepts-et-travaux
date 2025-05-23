import { Component } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { ApiConceptsEtTravauxService } from '../../../../Services/api-concepts-et-travaux.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSelectSizeType } from 'ng-zorro-antd/select';
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

  validateForm: FormGroup<{
    Description: FormControl<string>;
    Status: FormControl<string>;
    Valider:FormControl<boolean>;
    Date_de_debut_des_travaux: FormControl<Date>;
    Date_de_fin_des_travaux: FormControl<Date>;
  }>;

   liste_des_status = [
    'visite à faire',
    'devis en cours',
    'devis à finaliser',
    'devis à valider',
    'travaux à démarrer',
    'travaux en cours',
    'travaux achevés',
    'chantier réceptionné'
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

  constructor(private fb: NonNullableFormBuilder,private userService: ApiConceptsEtTravauxService, private route: ActivatedRoute,private message: NzMessageService, private router: Router) {
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
  }
  // Méthode pour récupérer les détails de l'utilisateur à partir de l'API
  getProjetDetails(userId: string): void {
    this.userService.get_projet( parseInt(userId, 10)).subscribe(
      (response) => {
        
        this.validateForm.patchValue(response);
        
        response.Artisans.forEach((artisan: any) => {
          // Ajouter l'ID de l'artisan à multipleValue
          this.multipleValue.push(artisan.Id);
        });
        response.Devis.forEach((d: any) => {
          // Ajouter l'ID de l'artisan à multipleValue
          this.multipleValue2.push(d.ID);
        });
        console.log("réponse de la requette get_projet",response);
      },
      (error) => {
        console.error('Erreur lors de la recuperation des details projet :', error);
      }
    );
    
  }
  
}