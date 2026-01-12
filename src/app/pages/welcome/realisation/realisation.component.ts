import { Component } from '@angular/core';
import { Realisation } from '../../../Models/Realisation';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../Services/auth.service';
import { ApiConceptsEtTravauxService } from '../../../Services/api-concepts-et-travaux.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-realisation',
  templateUrl: './realisation.component.html',
  styleUrl: './realisation.component.css'
})
export class RealisationComponent {
  size: NzButtonSize = 'large';
  listOfColumn = [
    {
      title: 'Id',
      compare: (a: Realisation, b: Realisation) => a.ID - b.ID,
      priority: 3
    },
   
    {
      title: 'Titre',
      compare: (a: Realisation, b: Realisation) => a.Titre.localeCompare(b.Titre),
      priority: 2
    },
    {
      title: 'Superficie',
      compare: (a: Realisation, b: Realisation) => a.Superficie-b.Superficie,
      priority: 1
    },
    {
      title: 'Prix',
      compare: (a: Realisation, b: Realisation) => a.Prix-b.Prix,
      priority: 1
    },
  ];
  realisations:Realisation[] = [];

  constructor(private titleService: Title,private http: HttpClient,private authService: AuthService,private message: NzMessageService,private userService: ApiConceptsEtTravauxService) { }

  ngOnInit(): void {
    this.titleService.setTitle('Liste des réalisations');
    this.loadRealisations();
  }

  loadRealisations(): void {
    this.userService.getRealisations()
      .subscribe((data: Realisation[]) => {
        this.realisations = data;
        console.log("réponse de la requette get realisations",this.realisations);
      });
      console.log("envoi de la requette get realisations",this.realisations);
      
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
  deleteRealisation(id: number) {
    if (this.authService.isAdmin( )) {
      this.userService.deleteRealisation(id).subscribe(
        () => {
          //console.log('Realisation supprimé avec succès');
          this.message.success( 'Realisation supprimée avec succès');
          // Mettez ici le code pour actualiser la liste des besoins si nécessaire
          this.loadRealisations();
        },
        (error) => {
          console.error('Erreur lors de la suppression de l\'utilisateur :', error);
          this.message.error( 'Erreur lors de la suppression de l\'utilisateur');
        }
      );
      return true
    } else {
      this.message.info( `Vous n'avez pas assez de privilèges pour acceder à cette page`);
      return false;
    }
    
  }
}