import { Component } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { ApiConceptsEtTravauxService } from '../../../../Services/api-concepts-et-travaux.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ajouter-avis',
  templateUrl: './ajouter-avis.component.html',
  styleUrl: './ajouter-avis.component.css'
})
export class AjouterAvisComponent {
  validateForm: FormGroup<{
    Utilisateur: FormControl<string>;
    Message: FormControl<string>;
  }>;
 

  submitForm(): void {
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);
      this.userService.addAvis(this.validateForm.value).subscribe(
        (response: any) => {
          console.log('avis ajoutée avec succès :', response);
          this.message.create('success', `avis ajouté avec succès`);
          this.router.navigate(['/administration/avis']);
        },
        (error: any) => {
          console.error('Erreur lors de l\'ajout de l\'avis :', error);
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
      Utilisateur: ['', [Validators.required]],
      Message: ['', [Validators.required]],
      
    });
  }

 
  ngOnInit(): void {
    
  }

  
}