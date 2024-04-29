import { Component } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { ApiConceptsEtTravauxService } from '../../../../Services/api-concepts-et-travaux.service';

@Component({
  selector: 'app-ajouter-autorisation',
  templateUrl: './ajouter-autorisation.component.html',
  styleUrl: './ajouter-autorisation.component.css'
})
export class AjouterAutorisationComponent {

  validateForm: FormGroup<{
    Titre: FormControl<string>;
    Explications: FormControl<string>;
  }>;
 

  submitForm(): void {
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);
      this.userService.add_autorisation(this.validateForm.value).subscribe(
        (response: any) => {
          console.log('autorisation ajouté avec succès :', response);
        },
        (error: any) => {
          console.error('Erreur lors de l\'ajout de l\'autorisation :', error);
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





  constructor(private fb: NonNullableFormBuilder,private userService: ApiConceptsEtTravauxService) {
    this.validateForm = this.fb.group({
      Titre: ['', [Validators.required]],
      Explications: ['', [Validators.required]],
      
    });
  }

 
  ngOnInit(): void {
    
  }

  
}
