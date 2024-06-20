import { Component } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { ApiConceptsEtTravauxService } from '../../../../Services/api-concepts-et-travaux.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ajouter-besoin',
  templateUrl: './ajouter-besoin.component.html',
  styleUrl: './ajouter-besoin.component.css'
})
export class AjouterBesoinComponent {

  validateForm: FormGroup<{
    Titre: FormControl<string>;
    Description: FormControl<string>;
  }>;
 

  submitForm(): void {
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);
      this.userService.add_besoin_projet(this.validateForm.value).subscribe(
        (response: any) => {
          console.log('besoins-projet ajoutée avec succès :', response);
          this.message.create('success', `besoins-projet ajoutée avec succès`);
          this.router.navigate(['/administration/besoins-projet']);
        },
        (error: any) => {
          console.error('Erreur lors de l\'ajout de l\'besoins-projet :', error);
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
      
    });
  }

 
  ngOnInit(): void {
    
  }

  
}