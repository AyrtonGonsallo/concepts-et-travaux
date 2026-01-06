import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { NzSelectSizeType } from 'ng-zorro-antd/select';
import { Fichier } from '../../../Models/Fichier';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../Services/auth.service';
import { ApiConceptsEtTravauxService } from '../../../Services/api-concepts-et-travaux.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-fichiers',
  templateUrl: './fichiers.component.html',
  styleUrl: './fichiers.component.css'
})
export class FichiersComponent {
  apiUrl = environment.imagesUrl.replace(/\/files\/?$/, '');

  size: NzButtonSize = 'large';
  sel_size: NzSelectSizeType = 'default';
  listOfColumn = [
    {
      title: 'Id',
      compare: (a: Fichier, b: Fichier) => a.ID - b.ID,
      priority: 3,
      order:null,
      width:"70px",
    },
    {
      title: 'Nom du fichier',
      compare: (a: Fichier, b: Fichier) => (a.Nom).localeCompare(b.Nom),
      priority: 1,
      order:null,
      width:"300px",
    },
    {
      title: 'Type de fichier',
      compare: (a: Fichier, b: Fichier) => a.Type.localeCompare(b.Type),
      priority: 1,
      order:null,
      width:"200px",
    },
    {
      title: 'Date de création',
      compare: (a: Fichier, b: Fichier) => {
        const dateA = new Date(a.DateDeCreation).getTime();
        const dateB = new Date(b.DateDeCreation).getTime();
        return dateA - dateB;
      },
      priority: 1,
      order:'descend',
      width:"200px",
    },
    {
      title: 'Utilisateur',
      compare: (a: Fichier, b: Fichier) => {
        const nomA = a.Projet?.Utilisateur?.Nom ?? ''; // si undefined → ''
        const nomB = b.Projet?.Utilisateur?.Nom ?? '';

        return nomA.localeCompare(nomB);
      },

      priority: 1,
      order:null,
      width:"150px",
    }
    
  ];
  Fichier:Fichier[] = [];
  listOfDisplayData :any;
  constructor(private http: HttpClient,private authService: AuthService,private message: NzMessageService,private userService: ApiConceptsEtTravauxService) { }

  ngOnInit(): void {
    Promise.all([
      this.loadFichiers()
    ]).then(() => {
      
    });
  }

  
  loadFichiers(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.userService.getFichiers().subscribe({
        next: (data: Fichier[]) => {
          this.Fichier = data;
          this.listOfDisplayData = [...this.Fichier];
          console.log("réponse de la requête getFichiers", this.Fichier);
          resolve();
        },
        error: (err) => reject(err)
      });
    });
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
  deleteFichier(id: number) {
    if (this.authService.isAdminorSuperAdmin()) {
      this.userService.deleteFichier(id).subscribe(
        () => {
          //console.log('Fichier supprimé avec succès');
          this.message.success( 'Fichier supprimé avec succès');
          // Mettez ici le code pour actualiser la liste des Fichier si nécessaire
          this.loadFichiers();
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

  searchValue = '';
  visible = false;
  reset(): void {
    this.searchValue = '';
    this.applyFilters();
  }

  applyFilters(): void {
    
      this.listOfDisplayData = this.Fichier.filter((item: Fichier) => {
        const matchLabel = !this.searchValue || item.Nom.toLowerCase().includes(this.searchValue.toLowerCase());
        return matchLabel;
      });
    }
    search(): void {
      this.visible = false;
      this.applyFilters();
    }

}