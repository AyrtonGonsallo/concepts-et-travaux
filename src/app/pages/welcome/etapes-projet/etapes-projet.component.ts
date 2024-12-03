import { Component } from '@angular/core';
import { EtapeProjet } from '../../../Models/Etape-Projet';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../Services/auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ApiConceptsEtTravauxService } from '../../../Services/api-concepts-et-travaux.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-etapes-projet',
  templateUrl: './etapes-projet.component.html',
  styleUrl: './etapes-projet.component.css'
})
export class EtapesProjetComponent {
  size: NzButtonSize = 'large';
  listOfColumn = [
    {
      title: 'Id',
      compare: (a: EtapeProjet, b: EtapeProjet) => a.ID - b.ID,
      priority: 3
    },
   
    {
      title: 'Titre',
      compare: (a: EtapeProjet, b: EtapeProjet) => a.Titre.localeCompare(b.Titre),
      priority: 2
    },
    {
      title: 'Description',
      compare: (a: EtapeProjet, b: EtapeProjet) => a.Description.localeCompare(b.Description),
      priority: 1
    }
  ];
  etapes:EtapeProjet[] = [];

  constructor(private http: HttpClient,private authService: AuthService,private message: NzMessageService,private userService: ApiConceptsEtTravauxService) { }

  ngOnInit(): void {
    this.loadEtapeProjets();
  }

  loadEtapeProjets(): void {
    this.userService.getEtapesProjet()
      .subscribe((data: EtapeProjet[]) => {
        this.etapes = data;
        console.log("réponse de la requette get_etapes_projet",this.etapes);
      });
      console.log("envoi de la requette get_etapes_projet",this.etapes);
      
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
  deleteEtape(id: number) {
    if (this.authService.isAdminorSuperAdmin()) {
      this.userService.deleteEtapeProjet(id).subscribe(
        () => {
          //console.log('EtapeProjet supprimé avec succès');
          this.message.success( 'EtapeProjet supprimé avec succès');
          // Mettez ici le code pour actualiser la liste des etapes si nécessaire
          this.loadEtapeProjets();
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