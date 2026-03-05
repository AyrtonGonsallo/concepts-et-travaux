import { Component } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { ApiConceptsEtTravauxService } from '../../../../Services/api-concepts-et-travaux.service';
import {  Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';


@Component({
  selector: 'app-ajouter-tva',
  templateUrl: './ajouter-tva.component.html',
  styleUrl: './ajouter-tva.component.css'
})
export class AjouterTvaComponent {


  
  validateForm: FormGroup<{
    Valeur: FormControl<number>;
    Commentaire: FormControl<string>;
    Defaut: FormControl<boolean>;
  }>;
  
  
  submitForm(): void {
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);
      this.userService.ajouterTva(this.validateForm.value).subscribe(
        (response: any) => {
          console.log('tva ajoutée avec succès :', response);
          this.message.create('success', `tva ajoutée avec succès`);
          this.router.navigate(['/administration/parametres']);
        },
        (error: any) => {
          console.error('Erreur lors de l\'ajout de la tva :', error);
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
     
      Commentaire: ['', []],
      Valeur: [0, [Validators.required]],
      Defaut: [false, [Validators.required]],
      
    });
  }
  
  
  ngOnInit(): void {
  
  }
  
}
