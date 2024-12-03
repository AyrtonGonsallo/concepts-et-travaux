import { Component } from '@angular/core';
import { DevisPiece } from '../../../Models/DevisPiece';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../Services/auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ApiConceptsEtTravauxService } from '../../../Services/api-concepts-et-travaux.service';

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
      title: 'Utilisateur',
      compare: (a: DevisPiece, b: DevisPiece) => (a.UtilisateurID  ?? 0)-(b.UtilisateurID ?? 0),
      priority: 1,
      order:null, 
    },
    {
      title: 'Prix',
      compare: (a: DevisPiece, b: DevisPiece) => (a.Prix?? 0)-(b.Prix??0),
      priority: 1,
      order:null, 
    }
  ];
  devis_pieces:DevisPiece[] = [];

  constructor(private http: HttpClient,private authService: AuthService,private message: NzMessageService,private devis_pieceService: ApiConceptsEtTravauxService) { }

  ngOnInit(): void {
    this.loadDevisPieces();
  }

  loadDevisPieces(): void {
    this.devis_pieceService.getAllDevisPieces()
      .subscribe((data: DevisPiece[]) => {
        this.devis_pieces = data;
        console.log("réponse de la requette get_devis_pieces",this.devis_pieces);
      });
      console.log("envoi de la requette get_devis_pieces",this.devis_pieces);
      
  }
  isAdmin(){

    return this.authService.isAdmin()
  }
  isAdminorSuperAdmin(){
    return this.authService.isAdminorSuperAdmin()
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