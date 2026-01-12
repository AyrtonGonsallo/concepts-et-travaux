import { Component } from '@angular/core';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { Page } from '../../../Models/Page';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../Services/auth.service';
import { ApiConceptsEtTravauxService } from '../../../Services/api-concepts-et-travaux.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-front-page',
  templateUrl: './front-page.component.html',
  styleUrl: './front-page.component.css'
})
export class FrontPageComponent {
  size: NzButtonSize = 'large';
  listOfColumn = [
    {
      title: 'Id',
      compare: (a: Page, b: Page) => a.ID - b.ID,
      priority: 3
    },
   
    {
      title: 'Titre',
      compare: (a: Page, b: Page) => a.Titre.localeCompare(b.Titre),
      priority: 2
    },
    {
      title: 'Url',
      compare: (a: Page, b: Page) => a.Url.localeCompare(b.Url),
      priority: 1
    },
    {
      title: 'Content_balise_description',
      compare: (a: Page, b: Page) => a.Content_balise_description.localeCompare(b.Content_balise_description),
      priority: 1
    }
  ];
  front_pages:Page[] = [];

  constructor(private titleService: Title,private http: HttpClient,private authService: AuthService,private message: NzMessageService,private userService: ApiConceptsEtTravauxService) { }

  ngOnInit(): void {
    this.titleService.setTitle('Liste des pages');
    this.loadPage();
  }

  loadPage(): void {
    this.userService.getFrontPages()
      .subscribe((data: Page[]) => {
        this.front_pages = data;
        console.log("réponse de la requette get_front_page",this.front_pages);
      });
      console.log("envoi de la requette get_front_page",this.front_pages);
      
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
  deletePage(id: number) {
    if (this.authService.isAdminorSuperAdmin()) {
      this.userService.deleteFrontPage(id).subscribe(
        () => {
          //console.log('Page supprimé avec succès');
          this.message.success( 'Page supprimé avec succès');
          // Mettez ici le code pour actualiser la liste des front_page si nécessaire
          this.loadPage();
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