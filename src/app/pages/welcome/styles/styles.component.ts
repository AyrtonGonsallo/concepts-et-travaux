import { Component } from '@angular/core';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { Style } from '../../../Models/Style';
import { HttpClient } from '@angular/common/http';
import { ApiConceptsEtTravauxService } from '../../../Services/api-concepts-et-travaux.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService } from '../../../Services/auth.service';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-styles',
  templateUrl: './styles.component.html',
  styleUrl: './styles.component.css'
})
export class StylesComponent {
size: NzButtonSize = 'large';
  listOfColumn = [
    {
      title: 'Id',
      compare: (a: Style, b: Style) => a.ID - b.ID,
      priority: 3
    },
    {
      title: 'Titre',
      compare: (a: Style, b: Style) => a.Titre.localeCompare(b.Titre),
      priority: 2
    },
  ];
  styles:Style[] = [];

  constructor(private titleService: Title,private http: HttpClient,private authService: AuthService,private message: NzMessageService,private userService: ApiConceptsEtTravauxService) { }

  ngOnInit(): void {
    this.titleService.setTitle('Liste des styles');
    this.loadStyle();
  }

  loadStyle(): void {
    this.userService.getStyles()
      .subscribe((data: Style[]) => {
        this.styles = data;
        console.log("réponse de la requette get_styles",this.styles);
      });
      console.log("envoi de la requette get_styles",this.styles);
      
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
  deleteStyle(id: number) {
    if (this.authService.isAdminorSuperAdmin()) {
      this.userService.deleteStyle(id).subscribe(
        () => {
          //console.log('Style supprimé avec succès');
          this.message.success( 'Style supprimé avec succès');
          // Mettez ici le code pour actualiser la liste des styles si nécessaire
          this.loadStyle();
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
