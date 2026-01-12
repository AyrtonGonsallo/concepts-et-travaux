import { Component } from '@angular/core';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { Avis } from '../../../Models/Avis';
import { HttpClient } from '@angular/common/http';
import { ApiConceptsEtTravauxService } from '../../../Services/api-concepts-et-travaux.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService } from '../../../Services/auth.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-avis',
  templateUrl: './avis.component.html',
  styleUrl: './avis.component.css'
})
export class AvisComponent {
  size: NzButtonSize = 'large';
  listOfColumn = [
    {
      title: 'Id',
      compare: (a: Avis, b: Avis) => a.ID - b.ID,
      priority: 3
    },
   
    {
      title: 'Utilisateur',
      compare: (a: Avis, b: Avis) => a.Utilisateur.localeCompare(b.Utilisateur),
      priority: 2
    },
    {
      title: 'Message',
      compare: (a: Avis, b: Avis) => a.Message.localeCompare(b.Message),
      priority: 1
    }
  ];
  avis:Avis[] = [];

  constructor(private titleService: Title,private http: HttpClient,private authService: AuthService,private message: NzMessageService,private userService: ApiConceptsEtTravauxService) { }

  ngOnInit(): void {
    this.titleService.setTitle('Liste des avis');
    this.loadAvis();
  }

  loadAvis(): void {
    this.userService.getAvis()
      .subscribe((data: Avis[]) => {
        this.avis = data;
        console.log("réponse de la requette get_avis",this.avis);
      });
      console.log("envoi de la requette get_avis",this.avis);
      
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
  deleteAvis(id: number) {
    if (this.authService.isAdminorSuperAdmin()) {
      this.userService.deleteAvis(id).subscribe(
        () => {
          //console.log('Avis supprimé avec succès');
          this.message.success( 'Avis supprimé avec succès');
          // Mettez ici le code pour actualiser la liste des avis si nécessaire
          this.loadAvis();
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