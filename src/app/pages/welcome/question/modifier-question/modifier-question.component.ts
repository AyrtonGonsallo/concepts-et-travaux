import { Component } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { CategorieQuestion } from '../../../../Models/Categorie-Question';
import { NzSelectSizeType } from 'ng-zorro-antd/select';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ApiConceptsEtTravauxService } from '../../../../Services/api-concepts-et-travaux.service';


interface FormValues {
  Titre?: string;
  Question?: string;
  Reponse?: string;
  CategorieQuestionFaqs?: any[]
}

@Component({
  selector: 'app-modifier-question',
  templateUrl: './modifier-question.component.html',
  styleUrl: './modifier-question.component.css'
})
export class ModifierQuestionComponent {
  multipleValue : number[] = [];

  validateForm: FormGroup<{
    Titre: FormControl<string>;
    Question: FormControl<string>;
    Reponse: FormControl<string>;
    
  }>;
  categories: CategorieQuestion[] = []; 
  size: NzSelectSizeType = 'default';
  questionId:string =  this.route.snapshot.paramMap.get('id')??'0';
  submitForm(): void {
    if (this.validateForm.valid) {
      
          const formValues: FormValues = { ...this.validateForm.value };
          formValues.CategorieQuestionFaqs = this.multipleValue;

          // Affichage du formulaire modifié
          console.log('valeur soumises :', formValues);
          
          this.userService.update_question (parseInt(this.questionId) ,formValues).subscribe(
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





  constructor(private fb: NonNullableFormBuilder,private route:ActivatedRoute,private userService: ApiConceptsEtTravauxService,private message: NzMessageService, private router: Router) {
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
    this.getQuestionDetails(this.questionId)
  }

  
  // Méthode pour récupérer les détails de l'utilisateur à partir de l'API
  getQuestionDetails(id: string): void {
    this.userService.get_question( parseInt(id, 10)).subscribe(
      (response) => {
        console.log("réponse de la requette get question details",response);
        this.validateForm.patchValue(response);
        
        response.CategorieQuestionFaqs.forEach((categorie: any) => {
          // Ajouter l'ID de l'categorie à multipleValue
          this.multipleValue.push(categorie.ID);
        });
        
        
      },
      (error) => {
        console.error('Erreur lors de la recuperation des details question :', error);
      }
    );
    
  }
}



