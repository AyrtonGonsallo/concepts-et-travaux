import { Component } from '@angular/core';
import { CategorieQuestion } from '../../../Models/Categorie-Question';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../Services/auth.service';
import { ApiConceptsEtTravauxService } from '../../../Services/api-concepts-et-travaux.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-categorie-question',
  templateUrl: './categorie-question.component.html',
  styleUrl: './categorie-question.component.css'
})
export class CategorieQuestionComponent {
  size: NzButtonSize = 'large';
  listOfColumn = [
    {
      title: 'Id',
      compare: (a: CategorieQuestion, b: CategorieQuestion) => a.ID - b.ID,
      priority: 3
    },
   
    {
      title: 'Titre',
      compare: (a: CategorieQuestion, b: CategorieQuestion) => a.Titre.localeCompare(b.Titre),
      priority: 2
    },
    {
      title: 'Description',
      compare: (a: CategorieQuestion, b: CategorieQuestion) => a.Description.localeCompare(b.Description),
      priority: 1
    }
  ];
  categories_de_questions:CategorieQuestion[] = [];

  constructor(private http: HttpClient,private authService: AuthService,private message: NzMessageService,private userService: ApiConceptsEtTravauxService) { }

  ngOnInit(): void {
    this.loadCategorieQuestions();
  }

  loadCategorieQuestions(): void {
    this.userService.get_categories_question()
      .subscribe((data: CategorieQuestion[]) => {
        this.categories_de_questions = data;
        console.log("réponse de la requette get_categories_question",this.categories_de_questions);
      });
      console.log("envoi de la requette get_categories_question",this.categories_de_questions);
      
  }
  isAdminOrHim(id:number){

    return this.authService.isAdminOrHim(id)
  }
  isHimOrAdminAndOtherNotAdmin(id:number,rid:number| undefined){
    return this.authService.isHimOrAdminAndOtherNotAdmin(id,rid?rid:0)
  }
  cancel(): void {
    this.message.info('suppression annulée');
  }
  deleteCategorie(id: number) {
    if (this.authService.isAdmin()) {
      this.userService.delete_categorie_question(id).subscribe(
        () => {
          //console.log('CategorieQuestion supprimé avec succès');
          this.message.success( 'CategorieQuestion supprimée avec succès');
          // Mettez ici le code pour actualiser la liste des besoins si nécessaire
          this.loadCategorieQuestions();
        },
        (error) => {
          console.error('Erreur lors de la suppression de l\'utilisateur :', error);
          this.message.error( 'Erreur lors de la suppression de l\'utilisateur');
        }
      );
      return true
    } else {
      this.message.info( `Vous n'avez pas assez de privilèges pour acceder à cette page et/ou ce n'est pas votre compte`);
      return false;
    }
    
  }
}