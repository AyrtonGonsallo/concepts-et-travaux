import { Component } from '@angular/core';
import { Projet } from '../../../../Models/Projet';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../../Services/auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ApiConceptsEtTravauxService } from '../../../../Services/api-concepts-et-travaux.service';
import { ActivatedRoute } from '@angular/router';
import { Utilisateur } from '../../../../Models/Utilisateurs';
import { DevisPiece } from '../../../../Models/DevisPiece';

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
      compare: (a: Projet, b: Projet) => a.Id - b.Id,
      priority: 3,
      order:null, 
    },
    {
      title: 'Nom',
      compare: (a: Projet, b: Projet) => (a.Nom ).localeCompare(b.Nom),
      priority: 3,
      order:null, 
    },
    {
      title: 'Date de création',
      compare: (a: Projet, b: Projet) => {
        const dateA = new Date(a.Date_de_creation).getTime();
        const dateB = new Date(b.Date_de_creation).getTime();
        return dateA - dateB;
      },
      priority: 1,
      order:'descend', 
    },
    
    {
      title: 'Status',
      compare: (a: Projet, b: Projet) => (a.Status ).localeCompare(b.Status),
      priority: 1,
      order:null, 
    },
    {
      title: 'Prix',
      compare: (a: Projet, b: Projet) => {
        const totalA = a.Devis?.reduce((t, d) => t + Number(d.Prix), 0) ?? 0;
        const totalB = b.Devis?.reduce((t, d) => t + Number(d.Prix), 0) ?? 0;

        return totalA - totalB; // tri numérique correct
      },

      priority: 1,
      order:null, 
    }
  ];
  devis_pieces:Projet[] = [];

  constructor(private http: HttpClient,private route: ActivatedRoute,private authService: AuthService,private message: NzMessageService,private devis_pieceService: ApiConceptsEtTravauxService) { }

  ngOnInit(): void {
    this.loadProjets();
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
  loadProjets(): void {
    this.devis_pieceService.getUserProjects(this.userId)
      .subscribe((data: Projet[]) => {
        
            this.devis_pieces = data;
          
        console.log("réponse de la requette get_devis_pieces",this.devis_pieces);
       
      });
      console.log("envoi de la requette get_devis_pieces",this.devis_pieces);
      
  }

getTotalHT(devis?: DevisPiece[]): number {
  if (!devis || devis.length === 0) {
    return 0;
  }

  return devis.reduce((total, d) => {
    const prix = d.Prix ?? 0; // si undefined → 0
    return total + prix;
  }, 0);
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
      this.devis_pieceService.deleteProjet(devis_pieceId).subscribe(
        () => {
          //console.log('Projet supprimé avec succès');
          this.message.success( 'Projet supprimé avec succès');
          // Mettez ici le code pour actualiser la liste des devis_pieces si nécessaire
          this.loadProjets();
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