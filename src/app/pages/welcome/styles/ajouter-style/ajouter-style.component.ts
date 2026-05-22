import { Component } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { ApiConceptsEtTravauxService } from '../../../../Services/api-concepts-et-travaux.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';


@Component({
  selector: 'app-ajouter-style',
  templateUrl: './ajouter-style.component.html',
  styleUrl: './ajouter-style.component.css'
})
export class AjouterStyleComponent {
validateForm: FormGroup<{
    Titre: FormControl<string>;
  }>;
 

  submitForm(): void {
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);
      this.userService.addStyle(this.validateForm.value).subscribe(
        (response: any) => {
          console.log('style ajouté avec succès :', response);
          this.message.create('success', `style ajouté avec succès`);
          this.router.navigate(['/administration/styles']);
        },
        (error: any) => {
          console.error('Erreur lors de l\'ajout du style :', error);
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
      
    });
  }

 
  ngOnInit(): void {
    
  }

  
}