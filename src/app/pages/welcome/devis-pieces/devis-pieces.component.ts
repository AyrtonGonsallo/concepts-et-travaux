import { Component } from '@angular/core';
import { DevisPiece } from '../../../Models/DevisPiece';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../Services/auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ApiConceptsEtTravauxService } from '../../../Services/api-concepts-et-travaux.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-devis-pieces',
  templateUrl: './devis-pieces.component.html',
  styleUrl: './devis-pieces.component.css'
})
export class DevisPiecesComponent {
  size: NzButtonSize = 'large';
  listOfColumn = [
    {
      title: 'ID',
      compare: (a: DevisPiece, b: DevisPiece) => a.ID - b.ID,
      priority: 3,
      order:null, 
    },
    
    {
      title: 'Date',
      compare: (a: DevisPiece, b: DevisPiece) => {
        const dateA = new Date(a.Date).getTime();
        const dateB = new Date(b.Date).getTime();
        return dateA - dateB;
      },
      priority: 1,
      order:'descend', 
    },
    {
      title: 'Client',
      compare: (a: DevisPiece, b: DevisPiece) => (a.UtilisateurID  ?? 0)-(b.UtilisateurID ?? 0),
      priority: 1,
      order:null, 
    },
    {
      title: 'Projet',
      compare: (a: DevisPiece, b: DevisPiece) => (a.Projets[0].Id  ?? 0)-(b.Projets[0].Id ?? 0),
      priority: 1,
      order:null, 
    },
    {
      title: 'Prix TTC',
      compare: (a: DevisPiece, b: DevisPiece) => (a.Prix?? 0)-(b.Prix??0),
      priority: 1,
      order:null, 
    }
  ];
  devis_pieces:DevisPiece[] = [];

  constructor(private titleService: Title,private http: HttpClient,private authService: AuthService,private message: NzMessageService,private devis_pieceService: ApiConceptsEtTravauxService) { }

  ngOnInit(): void {
    this.titleService.setTitle('Liste des devis');
    this.loadDevisPieces();
    this.authService.getUser().subscribe(
      (user) => {
        console.log('Utilisateur récupéré:', user);
        this.uid=user.Id
      },
      (error) => {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      }
    );
  }
uid=0;
  loadDevisPieces(): void {
    this.devis_pieceService.getAllDevisPieceswithProjects()
      .subscribe((data: DevisPiece[]) => {
        if(!this.isTechAdminorSuperAdmin()){
          this.devis_pieces = data.filter(devis => devis.UtilisateurID === this.uid);

          console.log("réponse de la requette getAllDevisPieceswithProjects",this.uid,this.devis_pieces)
        }else{
        this.devis_pieces = data;
        console.log("réponse de la requette getAllDevisPieceswithProjects",this.devis_pieces);
        }
      });
      console.log("envoi de la requette getAllDevisPieceswithProjects",this.devis_pieces);
      
  }
  isAdmin(){

    return this.authService.isAdmin()
  }
  isTechAdminorSuperAdmin(){
    return this.authService.isTechAdminorSuperAdmin()
  }
  isHimOrSuperAdmin(id:number){
    return this.authService.isHimOrSuperAdmin(id)
  }
  isHimOrAdminAndOtherNotAdmin(id:number,rid:number| undefined){
    return this.authService.isHimOrAdminAndOtherNotAdmin(id,rid?rid:0)
  }
  cancel(): void {
    this.message.info('suppression annulée');
  }
  deleteDevis(devis_pieceId: number) {
    if (this.authService.isAdminorSuperAdmin()) {
      this.devis_pieceService.deleteDevisPiece(devis_pieceId).subscribe(
        () => {
          //console.log('DevisPiece supprimé avec succès');
          this.message.success( 'DevisPiece supprimé avec succès');
          // Mettez ici le code pour actualiser la liste des devis_pieces si nécessaire
          this.loadDevisPieces();
        },
        (error) => {
          console.error('Erreur lors de la suppression de l\'utilisateur :', error);
          this.message.error( 'Erreur lors de la suppression de l\'utilisateur');
        }
      );
      return true
    } else {
      this.message.info( `Vous n'avez pas assez de privilèges pour faire cette opération`);
      return false;
    }
    
  }
}