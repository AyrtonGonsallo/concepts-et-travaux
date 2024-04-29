import { Component } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { ApiConceptsEtTravauxService } from '../../../../Services/api-concepts-et-travaux.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-modifier-autorisation',
  templateUrl: './modifier-autorisation.component.html',
  styleUrl: './modifier-autorisation.component.css'
})
export class ModifierAutorisationComponent {

  validateForm: FormGroup<{
    Titre: FormControl<string>;
    Explications: FormControl<string>;
  }>;
 

  submitForm(): void {
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);
      this.userService.updateAutorisation(parseInt(this.autorisationId??'0'),this.validateForm.value).subscribe(
        (response: any) => {
          console.log('autorisation modifiée avec succès :', response);
        },
        (error: any) => {
          console.error('Erreur lors de la modification de l\'autorisation :', error);
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





  constructor(private fb: NonNullableFormBuilder,private userService: ApiConceptsEtTravauxService, private route: ActivatedRoute) {
    this.validateForm = this.fb.group({
      Titre: ['', [Validators.required]],
      Explications: ['', [Validators.required]],
      
    });
  }

  autorisationId:string =  this.route.snapshot.paramMap.get('id')??'0';

  ngOnInit(): void {
    this.getAutorisationDetails(this.autorisationId);
  }
  // Méthode pour récupérer les détails de l'utilisateur à partir de l'API
  getAutorisationDetails(userId: string): void {
    this.userService.get_autorisation( parseInt(userId, 10)).subscribe(
      (response) => {
        
        this.validateForm.patchValue(response);
        console.log("réponse de la requette get_autorisation",response);
      },
      (error) => {
        console.error('Erreur lors de la recuperation des details autorisation :', error);
      }
    );
    
  }
  
}
