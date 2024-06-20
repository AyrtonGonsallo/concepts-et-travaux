import { Component } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { ApiConceptsEtTravauxService } from '../../../../Services/api-concepts-et-travaux.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-modifier-etape',
  templateUrl: './modifier-etape.component.html',
  styleUrl: './modifier-etape.component.css'
})
export class ModifierEtapeComponent {

  validateForm: FormGroup<{
    Titre: FormControl<string>;
    Description: FormControl<string>;
  }>;
 
  etapeId:string =  this.route.snapshot.paramMap.get('id')??'0';

  submitForm(): void {
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);
      this.userService.updateEtapeProjet (parseInt(this.etapeId) ,this.validateForm.value).subscribe(
        (response: any) => {
          console.log('etapes-projet modifiée avec succès :', response);
          this.message.create('success', `etapes-projet modifiée avec succès`);
          this.router.navigate(['/administration/etapes-projet']);
        },
        (error: any) => {
          console.error('Erreur lors de l\'ajout de l\'etapes-projet :', error);
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

  etape:any
 
  ngOnInit(): void {
    this.getDetails(parseInt(this.etapeId, 10))
  }
  getDetails(id: number): void {
    this.userService.getEtapeProjetById(id ).subscribe(
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