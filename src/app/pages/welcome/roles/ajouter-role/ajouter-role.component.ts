import { Component } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { ApiConceptsEtTravauxService } from '../../../../Services/api-concepts-et-travaux.service';
import { Autorisation } from '../../../../Models/Autorisations';
import { NzSelectSizeType } from 'ng-zorro-antd/select';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';
// Définir le type des valeurs du formulaire avec la propriété Autorisations
interface FormValues {
  Titre?: string;
  Commentaire?: string;
  Autorisations?: any[]; // Type de la liste des autorisations, ajustez selon le besoin
}

@Component({
  selector: 'app-ajouter-role',
  templateUrl: './ajouter-role.component.html',
  styleUrl: './ajouter-role.component.css'
})
export class AjouterRoleComponent {
  multipleValue : number[] = [];

  validateForm: FormGroup<{
    Titre: FormControl<string>;
    Commentaire: FormControl<string>;
    
  }>;
  autorisations: Autorisation[] = []; 
  size: NzSelectSizeType = 'default';

  submitForm(): void {
    if (this.validateForm.valid) {
      this.userService.getAutorisationsByIds(this.multipleValue).subscribe(
        (response) => {
          // Copie de validateForm.value
          const formValues: FormValues = { ...this.validateForm.value };

          // Ajout du champ 'Autorisations' avec la liste des autorisations
          formValues.Autorisations = response;

          // Affichage du formulaire modifié
          console.log('valeur soumises :', formValues);
          
          this.userService.add_role(formValues).subscribe(
            (response) => {
              console.log('role ajouté avec succès :', response);
              this.message.create('success', `role ajouté avec succès`);
              this.router.navigate(['/administration/roles']);
            },
            (error) => {
              console.error('Erreur lors de l\'ajout du role :', error);
            }
          ); 
        },
        (error) => {
          console.error('Erreur lors de la recuperation des autorisations :', error);
        }
      );
      console.log('autorisations', this.multipleValue);
      this.autorisations
      console.log('submit', this.validateForm.value);
      
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
      Commentaire: ['', [Validators.required]],
      
    });
  }

 
  ngOnInit(): void {
    this.userService.getAutorisations().subscribe(
      (response) => {
        this.autorisations = response;
        console.log("réponse de la requette get_autorisations",this.autorisations);
       
      },
      (error) => {
        console.error('Erreur lors de la recuperation des autorisations :', error);
      }
    );
  }

  
}
