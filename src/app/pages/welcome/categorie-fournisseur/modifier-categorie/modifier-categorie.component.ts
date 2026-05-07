import { Component } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ApiConceptsEtTravauxService } from '../../../../Services/api-concepts-et-travaux.service';


@Component({
  selector: 'app-modifier-categorie-fournisseur',
  templateUrl: './modifier-categorie.component.html',
  styleUrl: './modifier-categorie.component.css'
})
export class ModifierCategorieFournisseurComponent {

  
  
    validateForm: FormGroup<{
      Titre: FormControl<string>;
    }>;
   
    categorieId:string =  this.route.snapshot.paramMap.get('id')??'0';
  
    submitForm(): void {
      if (this.validateForm.valid) {
        console.log('submit', this.validateForm.value);
        this.userService.updateCategorieFournisseur (parseInt(this.categorieId) ,this.validateForm.value).subscribe(
          (response: any) => {
            console.log('categorie-fournisseur  modifiée avec succès :', response);
            this.message.create('success', `categorie-fournisseur  modifiée avec succès`);
            this.router.navigate(['/administration/categories-fournisseur']);
          },
          (error: any) => {
            console.error('Erreur lors de l\'ajout de l\'categorie-fournisseur :', error);
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
  
    categorie:any
   
    ngOnInit(): void {
      this.getDetails(parseInt(this.categorieId, 10))
    }
    getDetails(id: number): void {
      this.userService.getCategorieFournisseurById(id ).subscribe(
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