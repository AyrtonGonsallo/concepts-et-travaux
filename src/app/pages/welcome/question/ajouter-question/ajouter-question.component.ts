import { Component } from '@angular/core';
import { CategorieQuestion } from '../../../../Models/Categorie-Question';
import { NzSelectSizeType } from 'ng-zorro-antd/select';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { ApiConceptsEtTravauxService } from '../../../../Services/api-concepts-et-travaux.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';
interface FormValues {
  Titre?: string;
  Question?: string;
  Reponse?: string;
  CategorieQuestionFaqs?: any[]
}

@Component({
  selector: 'app-ajouter-question',
  templateUrl: './ajouter-question.component.html',
  styleUrl: './ajouter-question.component.css'
})
export class AjouterQuestionComponent {
  multipleValue : number[] = [];

  validateForm: FormGroup<{
    Titre: FormControl<string>;
    Question: FormControl<string>;
    Reponse: FormControl<string>;
    
  }>;
  categories: CategorieQuestion[] = []; 
  size: NzSelectSizeType = 'default';

  submitForm(): void {
    if (this.validateForm.valid) {
      
          const formValues: FormValues = { ...this.validateForm.value };
          formValues.CategorieQuestionFaqs = this.multipleValue;

          // Affichage du formulaire modifié
          console.log('valeur soumises :', formValues);
          
          this.userService.add_question (formValues).subscribe(
            (response) => {
              console.log('question ajouté avec succès :', response);
              this.message.create('success', `question ajouté avec succès`);
              this.router.navigate(['/administration/questions']);
            },
            (error) => {
              console.error('Erreur lors de l\'ajout du question :', error);
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





  constructor(private fb: NonNullableFormBuilder,private userService: ApiConceptsEtTravauxService,private message: NzMessageService, private router: Router) {
    this.validateForm = this.fb.group({
      Titre: ['', [Validators.required]],
      Question: ['', [Validators.required]],
      Reponse: ['', [Validators.required]],
    });
  }

 
  ngOnInit(): void {
    this.userService.get_categories_question().subscribe(
      (response) => {
        this.categories = response;
        console.log("réponse de la requette get_categories",this.categories);
       
      },
      (error) => {
        console.error('Erreur lors de la recuperation des categories :', error);
      }
    );
  }

  
}
