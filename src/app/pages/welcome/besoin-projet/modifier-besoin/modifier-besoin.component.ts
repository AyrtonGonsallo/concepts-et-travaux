import { Component } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ApiConceptsEtTravauxService } from '../../../../Services/api-concepts-et-travaux.service';

@Component({
  selector: 'app-modifier-besoin',
  templateUrl: './modifier-besoin.component.html',
  styleUrl: './modifier-besoin.component.css'
})
export class ModifierBesoinComponent {

  validateForm: FormGroup<{
    Titre: FormControl<string>;
    Description: FormControl<string>;
  }>;
 
  besoinId:string =  this.route.snapshot.paramMap.get('id')??'0';

  submitForm(): void {
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);
      this.userService.updateBesoinProjet (parseInt(this.besoinId) ,this.validateForm.value).subscribe(
        (response: any) => {
          console.log('besoin-projet  modifiée avec succès :', response);
          this.message.create('success', `besoin-projet  modifiée avec succès`);
          this.router.navigate(['/administration/besoins-projet']);
        },
        (error: any) => {
          console.error('Erreur lors de l\'ajout de l\'besoin-projet :', error);
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
      Description: ['', [Validators.required]],
      
    });
  }

  besoin:any
 
  ngOnInit(): void {
    this.getDetails(parseInt(this.besoinId, 10))
  }
  getDetails(id: number): void {
    this.userService.getBesoinProjetById(id ).subscribe(
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