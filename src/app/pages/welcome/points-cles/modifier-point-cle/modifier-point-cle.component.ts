import { Component } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ApiConceptsEtTravauxService } from '../../../../Services/api-concepts-et-travaux.service';

@Component({
  selector: 'app-modifier-point-cle',
  templateUrl: './modifier-point-cle.component.html',
  styleUrl: './modifier-point-cle.component.css'
})
export class ModifierPointCleComponent {

  validateForm: FormGroup<{
    Titre: FormControl<string>;
    Description: FormControl<string>;
  }>;
 
  pointId:string =  this.route.snapshot.paramMap.get('id')??'0';

  submitForm(): void {
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);
      this.userService.updatePointcle (parseInt(this.pointId) ,this.validateForm.value).subscribe(
        (response: any) => {
          console.log('point-cle  modifiée avec succès :', response);
          this.message.create('success', `point-cle  modifiée avec succès`);
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





  constructor(private fb: NonNullableFormBuilder,private route: ActivatedRoute,private userService: ApiConceptsEtTravauxService,private message: NzMessageService, private router: Router) {
    this.validateForm = this.fb.group({
      Titre: ['', [Validators.required]],
      Description: ['', []],
      
    });
  }

  pointcle:any
 
  ngOnInit(): void {
    this.getDetails(parseInt(this.pointId, 10))
  }
  getDetails(id: number): void {
    this.userService.getPointcleById(id ).subscribe(
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