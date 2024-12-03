import { Component } from '@angular/core';
import { BesoinProjet } from '../../../Models/Besoin-Projet';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { AuthService } from '../../../Services/auth.service';
import { HttpClient } from '@angular/common/http';
import { ApiConceptsEtTravauxService } from '../../../Services/api-concepts-et-travaux.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-besoin-projet',
  templateUrl: './besoin-projet.component.html',
  styleUrl: './besoin-projet.component.css'
})
export class BesoinProjetComponent {
  size: NzButtonSize = 'large';
  listOfColumn = [
    {
      title: 'Id',
      compare: (a: BesoinProjet, b: BesoinProjet) => a.ID - b.ID,
      priority: 3
    },
   
    {
      title: 'Titre',
      compare: (a: BesoinProjet, b: BesoinProjet) => a.Titre.localeCompare(b.Titre),
      priority: 2
    },
    {
      title: 'Description',
      compare: (a: BesoinProjet, b: BesoinProjet) => a.Description.localeCompare(b.Description),
      priority: 1
    }
  ];
  besoins:BesoinProjet[] = [];

  constructor(private http: HttpClient,private authService: AuthService,private message: NzMessageService,private userService: ApiConceptsEtTravauxService) { }

  ngOnInit(): void {
    this.loadBesoinProjets();
  }

  loadBesoinProjets(): void {
    this.userService.getBesoinsProjet()
      .subscribe((data: BesoinProjet[]) => {
        this.besoins = data;
        console.log("réponse de la requette get_besoins_projet",this.besoins);
      });
      console.log("envoi de la requette get_besoins_projet",this.besoins);
      
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
  deleteBesoin(id: number) {
    if (this.authService.isAdminorSuperAdmin()) {
      this.userService.deleteBesoinProjet(id).subscribe(
        () => {
          //console.log('BesoinProjet supprimé avec succès');
          this.message.success( 'BesoinProjet supprimé avec succès');
          // Mettez ici le code pour actualiser la liste des besoins si nécessaire
          this.loadBesoinProjets();
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