import { Component } from '@angular/core';
import { DevisPiece } from '../../../../Models/DevisPiece';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../../Services/auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ApiConceptsEtTravauxService } from '../../../../Services/api-concepts-et-travaux.service';
import { ActivatedRoute } from '@angular/router';
import { Utilisateur } from '../../../../Models/Utilisateurs';
import { Projet } from '../../../../Models/Projet';

@Component({
  selector: 'app-voir-devis-clients',
  templateUrl: './voir-devis-clients.component.html',
  styleUrl: './voir-devis-clients.component.css'
})
export class VoirDevisClientsComponent {
  userId:number =  parseInt(this.route.snapshot.paramMap.get('id')??'0');
  user:any
 size: NzButtonSize = 'large';
  listOfColumn = [
    {
      title: 'ID',
      compare: (a: DevisPiece, b: DevisPiece) => a.ID - b.ID,
      priority: 3,
      order:null, 
    },
    
    {
      title: 'Date de création',
      compare: (a: DevisPiece, b: DevisPiece) => {
        const dateA = new Date(a.Date).getTime();
        const dateB = new Date(b.Date).getTime();
        return dateA - dateB;
      },
      priority: 1,
      order:'descend', 
    },
    
    {
      title: 'Prix',
      compare: (a: DevisPiece, b: DevisPiece) => (a.Prix?? 0)-(b.Prix??0),
      priority: 1,
      order:null, 
    }
  ];
  devis_pieces:DevisPiece[] = [];

  constructor(private http: HttpClient,private route: ActivatedRoute,private authService: AuthService,private message: NzMessageService,private devis_pieceService: ApiConceptsEtTravauxService) { }

  ngOnInit(): void {
    this.loadDevisPieces();
    this.getUserDetails(this.userId.toString());
  }
  getUserDetails(userId: string): void {
    this.devis_pieceService.getUserById( parseInt(userId, 10)).subscribe(
      (response) => {
        this.user=response
        
        console.log("réponse de la requette get_user",response);
      },
      (error) => {
        console.error('Erreur lors de la recuperation des details utilisateur :', error);
      }
    );
    
  }
  loadDevisPieces(): void {
    this.devis_pieceService.getUserProjects(this.userId)
      .subscribe((data: Projet[]) => {
        data.forEach(projet => {
          if (projet.Devis && Array.isArray(projet.Devis)) {
            this.devis_pieces = this.devis_pieces.concat(projet.Devis);
          }
        });
        console.log("réponse de la requette get_devis_pieces",this.devis_pieces);
       
      });
      console.log("envoi de la requette get_devis_pieces",this.devis_pieces);
      
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