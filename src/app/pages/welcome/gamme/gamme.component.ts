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
import { Title } from '@angular/platform-browser';
interface TravailItem {
  id: number;
  texte: string;
}
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
      title: 'Titre',
      compare: (a: Gamme, b: Gamme) => a.Label.localeCompare(b.Label),
      priority: 2,
      order:"ascend"
    },
    {
      title: 'Sous-catégorie',
      compare: (a: Gamme, b: Gamme) => a.Type.localeCompare(b.Type),
      priority: 1,
      order:null
    },
    {
      title: 'Travail',
      compare: (a: Gamme, b: Gamme) => (this.get_travail_title(a.TravailID)??"").localeCompare(this.get_travail_title(b.TravailID)??""),
      priority: 1,
      order:null
    },
    
    
    
    {
      title: 'Prix',
      compare: (a: Gamme, b: Gamme) => a.Prix-(b.Prix),
      priority: 1,
      order:null
    },
    
  ];
  gamme:Gamme[] = [];
  listOfDisplayData :any;
  constructor(private titleService: Title,private http: HttpClient,private authService: AuthService,private message: NzMessageService,private userService: ApiConceptsEtTravauxService) { }

  ngOnInit(): void {
    this.titleService.setTitle('Liste des fournitures et produits');
    Promise.all([
      this.loadGamme(),
      this.loadTravaux()
    ]).then(() => {
      const savedfilteredTravailIDListeGammes = localStorage.getItem('filteredTravailIDListeGammes');
      if (savedfilteredTravailIDListeGammes) {
        this.filteredTravailID = parseInt(savedfilteredTravailIDListeGammes);
        console.log("Filtre récupéré travail: ", savedfilteredTravailIDListeGammes);
      }
      const savedfilteredEtapeListeGammes = localStorage.getItem('filteredEtapeListeGammes');
      if (savedfilteredEtapeListeGammes) {
        this.filteredEtape = (savedfilteredEtapeListeGammes);
        console.log("Filtre récupéré étape: ", savedfilteredEtapeListeGammes);
      }
      const savedfilteredSouscategorieListeGammes = localStorage.getItem('filteredSouscategorieListeGammes');
      if (savedfilteredSouscategorieListeGammes) {
        this.filteredSouscategorie = (savedfilteredSouscategorieListeGammes);
        console.log("Filtre récupéré : ", savedfilteredSouscategorieListeGammes);
      }
      this.doubleSearch()
    });
  }
 getLabel(booleen:boolean){
    return booleen?"Oui":"Non"
  }
 
  filteredTravailID=0
  filteredEtape=""
  filteredSouscategorie=""
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
          Promise.all([
            this.loadGamme(),
            this.loadTravaux()
          ]).then(() => {
            const savedfilteredTravailIDListeGammes = localStorage.getItem('filteredTravailIDListeGammes');
            if (savedfilteredTravailIDListeGammes) {
              this.filteredTravailID = parseInt(savedfilteredTravailIDListeGammes);
              console.log("Filtre récupéré travail: ", savedfilteredTravailIDListeGammes);
            }
            const savedfilteredEtapeListeGammes = localStorage.getItem('filteredEtapeListeGammes');
            if (savedfilteredEtapeListeGammes) {
              this.filteredEtape = (savedfilteredEtapeListeGammes);
              console.log("Filtre récupéré étape: ", savedfilteredEtapeListeGammes);
            }
            const savedfilteredSouscategorieListeGammes = localStorage.getItem('filteredSouscategorieListeGammes');
            if (savedfilteredSouscategorieListeGammes) {
              this.filteredSouscategorie = (savedfilteredSouscategorieListeGammes);
              console.log("Filtre récupéré : ", savedfilteredSouscategorieListeGammes);
            }
            this.search2();
          });
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
  localStorage.setItem('filteredTravailIDListeGammes', this.filteredTravailID.toString());
  localStorage.setItem('filteredEtapeListeGammes', this.filteredEtape);
  localStorage.setItem('filteredSouscategorieListeGammes', this.filteredSouscategorie);
    this.listOfDisplayData = this.gamme.filter((item: Gamme) => {
      const matchLabel = !this.searchValue || item.Label.toLowerCase().includes(this.searchValue.toLowerCase());
      const matchTravail = !this.filteredTravailID || (item.TravailID) === this.filteredTravailID;
      const matchEtape = !this.filteredEtape || item.Etape === this.filteredEtape;
      const matchType = !this.filteredSouscategorie || item.Type === this.filteredSouscategorie;
      return matchLabel && matchTravail && matchEtape  && matchType;
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

  /*
liste = [
    "Création de murs non porteurs - Création des portes",
    "Démolition de cloisons ou ouverture partielle sur des murs non porteurs - Démolition complète de murs non porteurs",
    "Démolition de cloisons ou ouverture partielle sur des murs non porteurs - Démolition partielle de murs non porteurs",
    "Installation de nouveaux équipements sanitaires - Dépose d'anciennes installations",
    "Installation de nouveaux équipements sanitaires - Pose de nouveaux équipements sanitaires",
    "Pose de nouveaux équipements de cuisine - Dépose d'anciennes installations",
    "Pose de nouveaux équipements de cuisine - Choix des équipements de cuisine",
    "Pose de revêtement de sol - Choix du nouveau revêtement",
    "Pose de revêtement de sol - État des surfaces",
    "Pose de revêtement de sol - Revêtements à retirer",
    "Pose de revêtement sur plafond - Choix du nouveau revêtement",
    "Pose de revêtement sur plafond - État des surfaces",
    "Pose de revêtement sur plafond - Revêtements existants",
    "Pose de revêtements muraux - Choix du nouveau revêtement",
    "Pose de revêtements muraux - État des surfaces",
    "Pose de revêtements muraux - Revêtements existants",
    "Remplacement de portes - Porte coulissante (de 70 à 90)",
    "Remplacement de portes - Porte double (de 100 à 140)",
    "Remplacement de portes - Porte simple (dimensions de 70 à 90)",
    "Remplacement de radiateurs - Radiateur électrique",
    "Remplacement de radiateurs - Radiateur à eau (sur chaudière)",
    "Rénovation électrique complète - Mise aux normes",
    "Rénovation électrique complète - Mise en sécurité",
    "Rénovation électrique partielle - Appareillage à créer",
    "Rénovation électrique partielle - Appareillage à remplacer"
];
*/


listeComplete: TravailItem[] = [
  // ID 2 - Trié alphabétiquement
  { id: 2, texte: "Étape 1 - Dépose d'anciennes installations" },
  { id: 2, texte: "Étape 3 - Choix des équipements de cuisine" },
  
  // ID 3 - Trié alphabétiquement
  { id: 3, texte: "Étape 1 - Démolition complète de murs non porteurs" },
  { id: 3, texte: "Étape 1 - Démolition partielle de murs non porteurs" },
  
  // ID 4
  { id: 4, texte: "Étape 1 - Création des portes" },
  
  // ID 5 - Trié alphabétiquement
  { id: 5, texte: "Étape 1 - Revêtements existants" },
  { id: 5, texte: "Étape 2 - État des surfaces" },
  { id: 5, texte: "Étape 3 - Choix du nouveau revêtement" },
  
  // ID 8 - Trié alphabétiquement
  { id: 8, texte: "Étape 1 - Revêtements existants" },
  { id: 8, texte: "Étape 2 - État des surfaces" },
  { id: 8, texte: "Étape 3 - Choix du nouveau revêtement" },
  
  // ID 9 - Trié alphabétiquement
  { id: 9, texte: "Étape 1 - Revêtements à retirer" },
  { id: 9, texte: "Étape 2 - État des surfaces" },
  { id: 9, texte: "Étape 3 - Choix du nouveau revêtement" },
  
  // ID 10 - Trié alphabétiquement
  { id: 10, texte: "Étape 3 - Porte coulissante (de 70 à 90)" },
  { id: 10, texte: "Étape 3 - Porte double (de 100 à 140)" },
  { id: 10, texte: "Étape 3 - Porte simple (dimensions de 70 à 90)" },
  
  // ID 12 - Trié alphabétiquement
  { id: 12, texte: "Étape 2 - Choix du type de radiateur" },
  { id: 12, texte: "Étape 3 - Choix de la gamme de radiateur" },
  
  // ID 13 - Trié alphabétiquement
  { id: 13, texte: "Étape 3 - Appareillage à créer" },
  { id: 13, texte: "Étape 3 - Appareillage à remplacer" },
  { id: 13, texte: "Étape 3 - Prix des appareils" },
  
  // ID 15 - Trié alphabétiquement
  { id: 15, texte: "Étape 3 - Chauffage" },
  { id: 15, texte: "Étape 3 - Mise aux normes" },
  { id: 15, texte: "Étape 3 - Mise en sécurité" },
  
  // ID 16 - Trié alphabétiquement
  { id: 16, texte: "Étape 1 - Dépose d'anciennes installations" },
  { id: 16, texte: "Étape 3 - Pose de nouveaux équipements sanitaires" }
];
filteredList: string[] = [];
doubleSearch(): void {
  

  // Filtrer selon l'ID
  if (this.filteredTravailID === 1) {
    // ID = 1 : afficher toute la liste
    this.filteredList = this.listeComplete.map(item => item.texte);
  } else {
    // Filtrer par ID spécifique
    this.filteredList = this.listeComplete
      .filter(item => item.id === this.filteredTravailID)
      .map(item => item.texte);
  }

  this.applyFilters();
}

}