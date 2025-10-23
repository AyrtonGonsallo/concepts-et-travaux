import { Component } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { ApiConceptsEtTravauxService } from '../../../../Services/api-concepts-et-travaux.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ActivatedRoute,Router } from '@angular/router';

@Component({
  selector: 'app-modifier-parametre',
  templateUrl: './modifier-parametre.component.html',
  styleUrl: './modifier-parametre.component.css'
})
export class ModifierParametreComponent {

  
  validateForm: FormGroup<{
    Nom: FormControl<string>;
  Valeur: FormControl<number>;
  Type: FormControl<string>;
  }>;
 
  paramId:string =  this.route.snapshot.paramMap.get('id')??'0';

  submitForm(): void {
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);
      this.userService.updateParametre(parseInt(this.paramId) ,this.validateForm.value).subscribe(
        (response: any) => {
          console.log('parametre modifiée avec succès :', response);
          this.message.create('success', `parametre modifiée avec succès`);
          this.router.navigate(['/administration/parametres']);
        },
        (error: any) => {
          console.error('Erreur lors de la modif du parametre :', error);
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





  constructor(private fb: NonNullableFormBuilder,private route: ActivatedRoute,private userService: ApiConceptsEtTravauxService,private message: NzMessageService, private router: Router) {
    this.validateForm = this.fb.group({
      Nom: ['', [Validators.required]],
      Valeur: [0, [Validators.required]],
       Type: ['', [Validators.required]],
    });
  }

  parametre:any
 
  ngOnInit(): void {
    this.getDetails(parseInt(this.paramId, 10))
  }
  getDetails(id: number): void {
    this.userService.getParametreById(id ).subscribe(
      (response) => {
        
        this.validateForm.patchValue(response);
        console.log("réponse de la requette getdetails",response);
      },
      (error) => {
        console.error('Erreur lors de la recuperation des details  :', error);
      }
    );
    
  }
  
}