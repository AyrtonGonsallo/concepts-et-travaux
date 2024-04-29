import { Component } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { ApiConceptsEtTravauxService } from '../../../../Services/api-concepts-et-travaux.service';
import { Autorisation } from '../../../../Models/Autorisations';
import { NzSelectSizeType } from 'ng-zorro-antd/select';

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
          this.autorisations = response;
          console.log("réponse de la requette get_autorisations",this.autorisations);
          /*
          this.userService.addUserWithRole(this.validateForm.value).subscribe(
            (response) => {
              console.log('Utilisateur ajouté avec succès :', response);
            },
            (error) => {
              console.error('Erreur lors de l\'ajout de l\'utilisateur :', error);
            }
          ); */
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





  constructor(private fb: NonNullableFormBuilder,private userService: ApiConceptsEtTravauxService) {
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
