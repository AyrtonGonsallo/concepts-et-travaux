import { Component } from '@angular/core';
import { Gamme } from '../../../Models/Gamme';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../Services/auth.service';
import { ApiConceptsEtTravauxService } from '../../../Services/api-concepts-et-travaux.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-gamme',
  templateUrl: './gamme.component.html',
  styleUrl: './gamme.component.css'
})
export class GammeComponent {
  baseurl=environment.imagesUrl
  size: NzButtonSize = 'large';
  listOfColumn = [
    {
      title: 'Id',
      compare: (a: Gamme, b: Gamme) => a.ID - b.ID,
      priority: 3,
      order:'descend'
    },
   
    {
      title: 'Label',
      compare: (a: Gamme, b: Gamme) => a.Label.localeCompare(b.Label),
      priority: 2,
      order:null
    },
    {
      title: 'Type',
      compare: (a: Gamme, b: Gamme) => a.Type.localeCompare(b.Type),
      priority: 1,
      order:null
    },
    {
      title: 'Image',
      compare: (a: Gamme, b: Gamme) => (a.Image??"").localeCompare(b.Image??""),
      priority: 1,
      order:null
    },
    {
      title: 'Pdf',
      compare: (a: Gamme, b: Gamme) => (a.Pdf??"").localeCompare(b.Pdf??""),
      priority: 1,
      order:null
    },
    {
      title: 'Prix',
      compare: (a: Gamme, b: Gamme) => a.Prix-(b.Prix),
      priority: 1,
      order:null
    },
    {
      title: 'TravailID',
      compare: (a: Gamme, b: Gamme) => a.TravailID-(b.TravailID),
      priority: 1,
      order:null
    }
  ];
  gamme:Gamme[] = [];
  listOfDisplayData :any;
  constructor(private http: HttpClient,private authService: AuthService,private message: NzMessageService,private userService: ApiConceptsEtTravauxService) { }

  ngOnInit(): void {
    this.loadGamme();
    
  }

  loadGamme(): void {
    this.userService.getGammes()
      .subscribe((data: Gamme[]) => {
        this.gamme = data;
        this.listOfDisplayData = [...this.gamme];
        console.log("réponse de la requette get_gamme",this.gamme);
      });
      console.log("envoi de la requette get_gamme",this.gamme);
      
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
  deleteGamme(id: number) {
    if (this.authService.isAdminorSuperAdmin()) {
      this.userService.deleteGamme(id).subscribe(
        () => {
          //console.log('Gamme supprimé avec succès');
          this.message.success( 'Gamme supprimé avec succès');
          // Mettez ici le code pour actualiser la liste des gamme si nécessaire
          this.loadGamme();
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


  searchValue = '';
  visible = false;
  reset(): void {
    this.searchValue = '';
    this.search();
  }

  search(): void {
    this.visible = false;
    this.listOfDisplayData = this.gamme.filter((item: Gamme) => item.Label.indexOf(this.searchValue) !== -1);
  }
}