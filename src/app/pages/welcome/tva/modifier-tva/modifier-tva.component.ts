import { Component } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { ApiConceptsEtTravauxService } from '../../../../Services/api-concepts-et-travaux.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ActivatedRoute,Router } from '@angular/router';
import { Tva } from '../../../../Models/Tva';

@Component({
  selector: 'app-modifier-tva',
  templateUrl: './modifier-tva.component.html',
  styleUrl: './modifier-tva.component.css'
})
export class ModifierTvaComponent {

   validateForm: FormGroup<{
    Valeur: FormControl<number>;
    Commentaire: FormControl<string>;
    Defaut: FormControl<boolean>;
  }>;
 
  paramId:string =  this.route.snapshot.paramMap.get('id')??'0';

  submitForm(): void {
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);
      this.userService.updateTva(parseInt(this.paramId) ,this.validateForm.value).subscribe(
        (response: any) => {
          console.log('tva modifiée avec succès :', response);
          this.message.create('success', `tva modifiée avec succès`);
          this.router.navigate(['/administration/parametres']);
        },
        (error: any) => {
          console.error('Erreur lors de la modif de la tva :', error);
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
      Commentaire: ['', []],
      Valeur: [0, [Validators.required]],
      Defaut: [false, [Validators.required]],
    });
  }

  parametre:any
 
  ngOnInit(): void {
    this.getDetails(parseInt(this.paramId, 10))
  }
  getDetails(id: number): void {
    this.userService.getTva(id ).subscribe(
      (response:Tva) => {
        
        this.validateForm.patchValue({
          ...response,
          Defaut: response.Defaut === 1
        });
        console.log("réponse de la requette getTva",response);
      },
      (error) => {
        console.error('Erreur lors de la recuperation des getTva  :', error);
      }
    );
    
  }
  
}
