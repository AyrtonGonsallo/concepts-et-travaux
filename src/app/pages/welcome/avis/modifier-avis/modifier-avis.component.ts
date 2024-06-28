import { Component } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiConceptsEtTravauxService } from '../../../../Services/api-concepts-et-travaux.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-modifier-avis',
  templateUrl: './modifier-avis.component.html',
  styleUrl: './modifier-avis.component.css'
})
export class ModifierAvisComponent {

  validateForm: FormGroup<{
    Utilisateur: FormControl<string>;
    Message: FormControl<string>;
  }>;
 
  avisId:string =  this.route.snapshot.paramMap.get('id')??'0';

  submitForm(): void {
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);
      this.userService.updateAvis (parseInt(this.avisId) ,this.validateForm.value).subscribe(
        (response: any) => {
          console.log('avis  modifiée avec succès :', response);
          this.message.create('success', `avis  modifiée avec succès`);
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





  constructor(private fb: NonNullableFormBuilder,private route: ActivatedRoute,private userService: ApiConceptsEtTravauxService,private message: NzMessageService, private router: Router) {
    this.validateForm = this.fb.group({
      Utilisateur: ['', [Validators.required]],
      Message: ['', [Validators.required]],
      
    });
  }

  avis:any
 
  ngOnInit(): void {
    this.getDetails(parseInt(this.avisId, 10))
  }
  getDetails(id: number): void {
    this.userService.getAvisById(id ).subscribe(
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