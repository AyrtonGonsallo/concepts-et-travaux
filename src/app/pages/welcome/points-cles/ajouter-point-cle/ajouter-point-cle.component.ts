import { Component } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { ApiConceptsEtTravauxService } from '../../../../Services/api-concepts-et-travaux.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ajouter-point-cle',
  templateUrl: './ajouter-point-cle.component.html',
  styleUrl: './ajouter-point-cle.component.css'
})
export class AjouterPointCleComponent {
  validateForm: FormGroup<{
    Titre: FormControl<string>;
    Description: FormControl<string>;
  }>;
 

  submitForm(): void {
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);
      this.userService.addPointcle (this.validateForm.value).subscribe(
        (response: any) => {
          console.log('point-cle ajoutée avec succès :', response);
          this.message.create('success', `point-cle ajoutée avec succès`);
          this.router.navigate(['/administration/points-cles']);
        },
        (error: any) => {
          console.error('Erreur lors de l\'ajout de l\'point-cle :', error);
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
      Description: ['', []],
      
    });
  }

 
  ngOnInit(): void {
    
  }

  
}
