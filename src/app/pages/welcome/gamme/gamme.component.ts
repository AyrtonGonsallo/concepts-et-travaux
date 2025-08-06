import { Component } from '@angular/core';
import { Gamme } from '../../../Models/Gamme';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../Services/auth.service';
import { ApiConceptsEtTravauxService } from '../../../Services/api-concepts-et-travaux.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { environment } from '../../../environments/environment';
import { Travail } from '../../../Models/Travail';
import { NzSelectSizeType } from 'ng-zorro-antd/select';

@Component({
  selector: 'app-gamme',
  templateUrl: './gamme.component.html',
  styleUrl: './gamme.component.css'
})
export class GammeComponent {
  baseurl=environment.imagesUrl
  size: NzButtonSize = 'large';
  sel_size: NzSelectSizeType = 'default';
  listOfColumn = [
    {
      title: 'Id',
      compare: (a: Gamme, b: Gamme) => a.ID - b.ID,
      priority: 3,
      order:'descend'
    },
    {
      title: 'Travail',
      compare: (a: Gamme, b: Gamme) => (this.get_travail_title(a.TravailID)??"").localeCompare(this.get_travail_title(b.TravailID)??""),
      priority: 1,
      order:null
    },
    {
      title: 'Type',
      compare: (a: Gamme, b: Gamme) => a.Type.localeCompare(b.Type),
      priority: 1,
      order:null
    },
    {
      title: 'Label',
      compare: (a: Gamme, b: Gamme) => a.Label.localeCompare(b.Label),
      priority: 2,
      order:null
    },
    
    {
      title: 'Prix',
      compare: (a: Gamme, b: Gamme) => a.Prix-(b.Prix),
      priority: 1,
      order:null
    },
    {
      title: 'Fournisseur',
      compare: (a: Gamme, b: Gamme) => (a.ActiverFournisseur ? '1' : '0').localeCompare(b.ActiverFournisseur ? '1' : '0'),
      priority: 4,
      order:null
    },
    {
      title: 'Pdf',
      compare: (a: Gamme, b: Gamme) => (a.Pdf??"").localeCompare(b.Pdf??""),
      priority: 1,
      order:null
    },
    
  ];
  gamme:Gamme[] = [];
  listOfDisplayData :any;
  constructor(private http: HttpClient,private authService: AuthService,private message: NzMessageService,private userService: ApiConceptsEtTravauxService) { }

  ngOnInit(): void {
    Promise.all([
      this.loadGamme(),
      this.loadTravaux()
    ]).then(() => {
      const savedFilter = localStorage.getItem('filteredTravailListeGammes');
      if (savedFilter) {
        this.filteredTravail = savedFilter;
        console.log("Filtre récupéré: ", savedFilter);
      }
      this.search2();
    });
  }
 getLabel(booleen:boolean){
    return booleen?"Oui":"Non"
  }
  filteredTravail=""
  travaux:Travail[] = [];
  loadTravaux(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.userService.getTravaux().subscribe({
        next: (data: Travail[]) => {
          this.travaux = data;
          console.log("réponse de la requête getTravaux", this.travaux);
          resolve();
        },
        error: (err) => reject(err)
      });
    });
  }
  
  loadGamme(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.userService.getGammes().subscribe({
        next: (data: Gamme[]) => {
          this.gamme = data;
          this.listOfDisplayData = [...this.gamme];
          console.log("réponse de la requête getGammes", this.gamme);
          resolve();
        },
        error: (err) => reject(err)
      });
    });
  }
  get_travail(id: number): Travail | undefined {
    return this.travaux.find(travail => travail.ID === id);
  }
  get_travail_title(id: number): string {
    const travail = this.travaux.find(travail => travail.ID === id);
    return travail ? travail.Titre : '';
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
  deleteGamme(id: number) {
    if (this.authService.isAdminorSuperAdmin()) {
      this.userService.deleteGamme(id).subscribe(
        () => {
          //console.log('Gamme supprimé avec succès');
          this.message.success( 'Gamme supprimé avec succès');
          // Mettez ici le code pour actualiser la liste des gamme si nécessaire
          this.loadGamme();
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

  search(): void {
    this.visible = false;
    this.applyFilters();
  }
  search2(): void {

    this.applyFilters();
  }
  applyFilters(): void {
  localStorage.setItem('filteredTravailListeGammes', this.filteredTravail);
    this.listOfDisplayData = this.gamme.filter((item: Gamme) => {
      const matchLabel = !this.searchValue || item.Label.toLowerCase().includes(this.searchValue.toLowerCase());
      const matchTravail = !this.filteredTravail || this.get_travail_title(item.TravailID) === this.filteredTravail;
      return matchLabel && matchTravail;
    });
  }

  exporter() {
    this.userService.getExportGammes().subscribe((blob: Blob) => {
      // Créer une URL temporaire pour le fichier
      const url = window.URL.createObjectURL(blob);

      // Créer un lien HTML temporaire
      const a = document.createElement('a');
      a.href = url;
      a.download = 'gammes_export.csv';  // Nom du fichier

      // Déclencher le téléchargement
      a.click();

      // Libérer l’URL blob après téléchargement
      window.URL.revokeObjectURL(url);

      console.log("Fichier exporté avec succès.");
    }, (error) => {
      console.error('Erreur lors de l\'export', error);
    });
  }


selectedFile: File | null = null;

onFileSelected(event: any) {
  this.selectedFile = event.target.files[0];
}


  importer() {
  if (this.selectedFile) {
    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.userService.upload_import_gammes_file(formData).subscribe({
      next: (res) => {
        console.log('Fichier uploadé avec succès', res);
        this.message.success("Fichier uploadé avec succès. Import fini")
      },
      error: (err) => {
        console.error('Erreur lors de l\'upload', err);
        this.message.error("Erreur lors de l\'upload/import")
      }
    });
  } else {
    alert('Veuillez sélectionner un fichier.');
  }
}


cancel_supression(): void {
    this.message.info('Supression annulée !');
  }

  confirm_supression(): void {
    this.message.success('Supression réussie !');
  }

  beforeConfirm_supression(): Promise<boolean> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(true);
      }, 3000);
    });
  }

}