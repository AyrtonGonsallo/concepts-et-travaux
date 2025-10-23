import { Component } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { ApiConceptsEtTravauxService } from '../../../../Services/api-concepts-et-travaux.service';
import {  Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-ajouter-parametre',
  templateUrl: './ajouter-parametre.component.html',
  styleUrl: './ajouter-parametre.component.css'
})
export class AjouterParametreComponent {
 
validateForm: FormGroup<{
  Nom: FormControl<string>;
  Valeur: FormControl<number>;
  Type: FormControl<string>;
}>;


submitForm(): void {
  if (this.validateForm.valid) {
    console.log('submit', this.validateForm.value);
    this.userService.addParametre(this.validateForm.value).subscribe(
      (response: any) => {
        console.log('parametre ajouté avec succès :', response);
        this.message.create('success', `parametre ajouté avec succès`);
        this.router.navigate(['/administration/parametres']);
      },
      (error: any) => {
        console.error('Erreur lors de l\'ajout du parametre :', error);
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
   
    Nom: ['', [Validators.required]],
    Valeur: [0, [Validators.required]],
    Type: ['', [Validators.required]],
    
  });
}


ngOnInit(): void {

}


}
