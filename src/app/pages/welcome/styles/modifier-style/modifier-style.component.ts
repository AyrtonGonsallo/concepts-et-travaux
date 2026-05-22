import { Component } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiConceptsEtTravauxService } from '../../../../Services/api-concepts-et-travaux.service';
import { NzMessageService } from 'ng-zorro-antd/message';


@Component({
  selector: 'app-modifier-style',
  templateUrl: './modifier-style.component.html',
  styleUrl: './modifier-style.component.css'
})
export class ModifierStyleComponent {

  validateForm: FormGroup<{
    Titre: FormControl<string>;
  }>;
 
  styleId:string =  this.route.snapshot.paramMap.get('id')??'0';

  submitForm(): void {
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);
      this.userService.updateStyle (parseInt(this.styleId) ,this.validateForm.value).subscribe(
        (response: any) => {
          console.log('style modifié avec succès :', response);
          this.message.create('success', `style modifié avec succès`);
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





  constructor(private fb: NonNullableFormBuilder,private route: ActivatedRoute,private userService: ApiConceptsEtTravauxService,private message: NzMessageService, private router: Router) {
    this.validateForm = this.fb.group({
      Titre: ['', [Validators.required]],
    });
  }

  avis:any
 
  ngOnInit(): void {
    this.getDetails(parseInt(this.styleId, 10))
  }
  getDetails(id: number): void {
    this.userService.getStyleById(id ).subscribe(
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