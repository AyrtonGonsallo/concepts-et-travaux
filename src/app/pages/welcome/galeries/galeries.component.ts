import { Component } from '@angular/core';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { Galerie } from '../../../Models/Galerie';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../Services/auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ApiConceptsEtTravauxService } from '../../../Services/api-concepts-et-travaux.service';

@Component({
  selector: 'app-galeries',
  templateUrl: './galeries.component.html',
  styleUrl: './galeries.component.css'
})
export class GaleriesComponent {
  size: NzButtonSize = 'large';
  listOfColumn = [
    {
      title: 'Id',
      compare: (a: Galerie, b: Galerie) => a.ID - b.ID,
      priority: 3
    },
   
    {
      title: 'Titre',
      compare: (a: Galerie, b: Galerie) => a.Titre.localeCompare(b.Titre),
      priority: 2
    },
    {
      title: 'Total d\'images',
      compare: (a: Galerie, b: Galerie) => a.images.length -b.images.length,
      priority: 1
    }
  ];
  galeries:Galerie[] = [];

  constructor(private http: HttpClient,private authService: AuthService,private message: NzMessageService,private userService: ApiConceptsEtTravauxService) { }

  ngOnInit(): void {
    this.loadGaleries();
  }

  loadGaleries(): void {
    this.userService.get_galeries()
      .subscribe((data: Galerie[]) => {
        this.galeries = data;
        console.log("réponse de la requette get_categories_piece",this.galeries);
      });
      console.log("envoi de la requette get_categories_piece",this.galeries);
      
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
  deleteGalerie(galerieId: number) {
    if (this.authService.isAdmin( )) {
      this.userService.deleteGalerie(galerieId).subscribe(
        () => {
          //console.log('Galerie supprimé avec succès');
          this.message.success( 'Galerie supprimée avec succès');
          // Mettez ici le code pour actualiser la liste des besoins si nécessaire
          this.loadGaleries();
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