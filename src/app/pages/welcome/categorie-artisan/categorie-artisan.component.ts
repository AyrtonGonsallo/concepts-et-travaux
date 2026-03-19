import { Component } from '@angular/core';
import { CategorieArtisan } from '../../../Models/Categorie-Artisan';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { Title } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { ApiConceptsEtTravauxService } from '../../../Services/api-concepts-et-travaux.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService } from '../../../Services/auth.service';

@Component({
  selector: 'app-categorie-artisan',
  templateUrl: './categorie-artisan.component.html',
  styleUrl: './categorie-artisan.component.css'
})
export class CategorieArtisanComponent {
 size: NzButtonSize = 'large';
  listOfColumn = [
    {
      title: 'Id',
      compare: (a: CategorieArtisan, b: CategorieArtisan) => a.ID - b.ID,
      priority: 3
    },
   
    {
      title: 'Titre',
      compare: (a: CategorieArtisan, b: CategorieArtisan) => a.Titre.localeCompare(b.Titre),
      priority: 2
    }
  ];
  categories_de_artisans:CategorieArtisan[] = [];

  constructor(private titleService: Title,private http: HttpClient,private authService: AuthService,private message: NzMessageService,private userService: ApiConceptsEtTravauxService) { }

  ngOnInit(): void {
    this.titleService.setTitle('Liste des catégories de pièces');
    this.loadCategorieArtisans();
  }

  loadCategorieArtisans(): void {
    this.userService.getCategoriesArtisan()
      .subscribe((data: CategorieArtisan[]) => {
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
      this.userService.deleteCategorieArtisan(id).subscribe(
        () => {
          //console.log('CategorieArtisan supprimé avec succès');
          this.message.success( 'CategorieArtisan supprimée avec succès');
          // Mettez ici le code pour actualiser la liste des besoins si nécessaire
          this.loadCategorieArtisans();
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