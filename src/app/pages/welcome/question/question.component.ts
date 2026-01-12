import { Component } from '@angular/core';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { Question } from '../../../Models/Question';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../Services/auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ApiConceptsEtTravauxService } from '../../../Services/api-concepts-et-travaux.service';
import { presetColors } from 'ng-zorro-antd/core/color';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrl: './question.component.css'
})
export class QuestionComponent {
  size: NzButtonSize = 'large';
  listOfColumn = [
    {
      title: 'Id',
      compare: (a: Question, b: Question) => a.ID - b.ID,
      priority: 3
    },
    {
      title: 'Question',
      compare: (a: Question, b: Question) => a.Question.localeCompare(b.Question),
      priority: 1
    },
    {
      title: 'Réponse',
      compare: (a: Question, b: Question) => a.Reponse.localeCompare(b.Reponse),
      priority: 2
    },
  ];
  questions:Question[] = [];

  constructor(private titleService: Title,private http: HttpClient,private authService: AuthService,private message: NzMessageService,private userService: ApiConceptsEtTravauxService) { }

  ngOnInit(): void {
    this.titleService.setTitle('Liste des questions');
    this.loadQuestions();
  }

  loadQuestions(): void {
    this.userService.get_questions()
      .subscribe((data: Question[]) => {
        this.questions = data;
        console.log("réponse de la requette get_question",this.questions);
      });
      
      
  }
  public tagColors = presetColors;

  isAdminOrHim(id:number){

    return this.authService.isAdminOrHim(id)
  }
  isHimOrAdminAndOtherNotAdmin(id:number,rid:number| undefined){
    return this.authService.isHimOrAdminAndOtherNotAdmin(id,rid?rid:0)
  }
  cancel(): void {
    this.message.info('suppression annulée');
  }
  deletequestion(id: number) {
    if (this.authService.isAdminorSuperAdmin()) {
      this.userService.delete_question(id).subscribe(
        () => {
          //console.log('Question supprimé avec succès');
          this.message.success( 'Question supprimée avec succès');
          // Mettez ici le code pour actualiser la liste des besoins si nécessaire
          this.loadQuestions();
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