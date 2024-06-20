import { Component } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiConceptsEtTravauxService } from '../../../../Services/api-concepts-et-travaux.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-modifier-categorie',
  templateUrl: './modifier-categorie.component.html',
  styleUrl: './modifier-categorie.component.css'
})
export class ModifierCategorieComponent {

  validateForm: FormGroup<{
    Titre: FormControl<string>;
    Description: FormControl<string>;
  }>;
 
  categorieId:string =  this.route.snapshot.paramMap.get('id')??'0';

  submitForm(): void {
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);
      this.userService.updateCategoriePiece (parseInt(this.categorieId) ,this.validateForm.value).subscribe(
        (response: any) => {
          console.log('categorie-piece  modifiée avec succès :', response);
          this.message.create('success', `categorie-piece  modifiée avec succès`);
          this.router.navigate(['/administration/categories-piece']);
        },
        (error: any) => {
          console.error('Erreur lors de l\'ajout de l\'categorie-piece :', error);
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

  categorie:any
 
  ngOnInit(): void {
    this.getDetails(parseInt(this.categorieId, 10))
  }
  getDetails(id: number): void {
    this.userService.getCategoriePieceById(id ).subscribe(
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