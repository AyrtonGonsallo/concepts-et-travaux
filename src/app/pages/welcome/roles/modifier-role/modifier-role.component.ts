import { Component } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { ApiConceptsEtTravauxService } from '../../../../Services/api-concepts-et-travaux.service';
import { Autorisation } from '../../../../Models/Autorisations';
import { NzSelectSizeType } from 'ng-zorro-antd/select';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
// Définir le type des valeurs du formulaire avec la propriété Autorisations
interface FormValues {
  Titre?: string;
  Commentaire?: string;
  Autorisations?: any[]; // Type de la liste des autorisations, ajustez selon le besoin
}

@Component({
  selector: 'app-modifier-role',
  templateUrl: './modifier-role.component.html',
  styleUrl: './modifier-role.component.css'
})
export class ModifierRoleComponent {
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
          
          this.userService.updateRole(parseInt(this.roleId??'0'),formValues).subscribe(
            (response) => {
              console.log('role modifié avec succès :', response);
              this.message.create('success', `role modifié avec succès`);
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





  constructor(private fb: NonNullableFormBuilder,private userService: ApiConceptsEtTravauxService, private route: ActivatedRoute,private message: NzMessageService, private router: Router) {
    this.validateForm = this.fb.group({
      Titre: ['', [Validators.required]],
      Commentaire: ['', [Validators.required]],
      
    });
  }

  roleId:string =  this.route.snapshot.paramMap.get('id')??'0';
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

    this.getRoleDetails(this.roleId);
  }
// Méthode pour récupérer les détails du role à partir de l'API
getRoleDetails(userId: string): void {
  this.userService.get_role( parseInt(userId, 10)).subscribe(
    (response) => {
      
      this.validateForm.patchValue(response);
      
      // Parcourir les autorisations dans la réponse
      response.Autorisations.forEach((autorisation: any) => {
        // Ajouter l'ID de l'autorisation à multipleValue
        this.multipleValue.push(autorisation.Id);
      });
      //console.log("réponse de la requette get_role",this.multipleValue);
    },
    (error) => {
      console.error('Erreur lors de la recuperation des details role :', error);
    }
  );
  
}
  
}
