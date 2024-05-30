import { Component } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { ApiConceptsEtTravauxService } from '../../../../Services/api-concepts-et-travaux.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';
import { AuthService } from '../../../../Services/auth.service';

@Component({
  selector: 'app-ajouter-projet',
  templateUrl: './ajouter-projet.component.html',
  styleUrl: './ajouter-projet.component.css'
})
export class AjouterProjetComponent {

  validateForm: FormGroup<{
    Nom: FormControl<string>;
    Description: FormControl<string>;
    User_id: FormControl<number>;
  }>;
 

  submitForm(): void {
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);
      this.userService.add_projet(this.validateForm.value).subscribe(
        (response: any) => {
          console.log('projet ajoutée avec succès :', response);
          this.message.create('success', `projet ajoutée avec succès`);
          this.router.navigate(['/administration/projets']);
        },
        (error: any) => {
          console.error('Erreur lors de l\'ajout de l\'projet :', error);
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


private padZero(num: number): string {
      return num < 10 ? `0${num}` : `${num}`;
    }


  constructor(private fb: NonNullableFormBuilder,private auth:AuthService,private userService: ApiConceptsEtTravauxService,private message: NzMessageService, private router: Router) {
    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}-${this.padZero(currentDate.getMonth() + 1)}-${this.padZero(currentDate.getDate())}`;
    const formattedTime = `${this.padZero(currentDate.getHours())}:${this.padZero(currentDate.getMinutes())}:${this.padZero(currentDate.getSeconds())}`;
    const defaultNom = `${formattedDate} ${formattedTime}`;
    
    
    this.validateForm = this.fb.group({
      Nom: [defaultNom, [Validators.required]],
      Description: ['', [Validators.required]],
      User_id: [this.auth.getDataFromLocal("utilisateur").Id , []],
    });
  }

 
  ngOnInit(): void {
    
  }

  
}
