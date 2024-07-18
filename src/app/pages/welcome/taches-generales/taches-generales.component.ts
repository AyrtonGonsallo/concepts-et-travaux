import { Component } from '@angular/core';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { TacheGenerale } from '../../../Models/TacheGenerale';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../Services/auth.service';
import { ApiConceptsEtTravauxService } from '../../../Services/api-concepts-et-travaux.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-taches-generales',
  templateUrl: './taches-generales.component.html',
  styleUrl: './taches-generales.component.css'
})
export class TachesGeneralesComponent {
  size: NzButtonSize = 'large';
  listOfColumn = [
    {
      title: 'Id',
      compare: (a: TacheGenerale, b: TacheGenerale) => a.ID - b.ID,
      priority: 3
    },
   
    {
      title: 'Label',
      compare: (a: TacheGenerale, b: TacheGenerale) => a.Label.localeCompare(b.Label),
      priority: 2
    },
    {
      title: 'Prix',
      compare: (a: TacheGenerale, b: TacheGenerale) => a.Prix-(b.Prix),
      priority: 1
    },
    {
      title: 'TravailID',
      compare: (a: TacheGenerale, b: TacheGenerale) => a.TravailID-(b.TravailID),
      priority: 1
    }
  ];
  tache_generale:TacheGenerale[] = [];

  constructor(private http: HttpClient,private authService: AuthService,private message: NzMessageService,private userService: ApiConceptsEtTravauxService) { }

  ngOnInit(): void {
    this.loadTacheGenerale();
  }

  loadTacheGenerale(): void {
    this.userService.getTacheGenerales()
      .subscribe((data: TacheGenerale[]) => {
        this.tache_generale = data;
        console.log("réponse de la requette get_tache_generale",this.tache_generale);
      });
      console.log("envoi de la requette get_tache_generale",this.tache_generale);
      
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
  deleteTacheGenerale(id: number) {
    if (this.authService.isAdmin()) {
      this.userService.deleteTacheGenerale(id).subscribe(
        () => {
          //console.log('TacheGenerale supprimé avec succès');
          this.message.success( 'TacheGenerale supprimé avec succès');
          // Mettez ici le code pour actualiser la liste des tache_generale si nécessaire
          this.loadTacheGenerale();
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
