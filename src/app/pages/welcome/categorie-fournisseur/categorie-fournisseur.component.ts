import { Component } from '@angular/core';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { Title } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { ApiConceptsEtTravauxService } from '../../../Services/api-concepts-et-travaux.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService } from '../../../Services/auth.service';
import { CategorieFournisseur } from '../../../Models/Categorie-Fournisseur';


@Component({
  selector: 'app-categorie-fournisseur',
  templateUrl: './categorie-fournisseur.component.html',
  styleUrl: './categorie-fournisseur.component.css'
})
export class CategorieFournisseurComponent {
size: NzButtonSize = 'large';
  listOfColumn = [
    {
      title: 'Id',
      compare: (a: CategorieFournisseur, b: CategorieFournisseur) => a.ID - b.ID,
      priority: 3
    },
   
    {
      title: 'Titre',
      compare: (a: CategorieFournisseur, b: CategorieFournisseur) => a.Titre.localeCompare(b.Titre),
      priority: 2
    }
  ];
  categories_de_artisans:CategorieFournisseur[] = [];

  constructor(private titleService: Title,private http: HttpClient,private authService: AuthService,private message: NzMessageService,private userService: ApiConceptsEtTravauxService) { }

  ngOnInit(): void {
    this.titleService.setTitle('Liste des catégories de pièces');
    this.loadCategorieFournisseurs();
  }

  loadCategorieFournisseurs(): void {
    this.userService.getCategoriesFournisseur()
      .subscribe((data: CategorieFournisseur[]) => {
        this.categories_de_artisans = data;
        console.log("réponse de la requette get_categories_artisan",this.categories_de_artisans);
      });
      console.log("envoi de la requette get_categories_artisan",this.categories_de_artisans);
      
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
  deleteCategorie(id: number) {
    if (this.authService.isAdminorSuperAdmin()) {
      this.userService.deleteCategorieFournisseur(id).subscribe(
        () => {
          //console.log('CategorieFournisseur supprimé avec succès');
          this.message.success( 'CategorieFournisseur supprimée avec succès');
          // Mettez ici le code pour actualiser la liste des besoins si nécessaire
          this.loadCategorieFournisseurs();
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