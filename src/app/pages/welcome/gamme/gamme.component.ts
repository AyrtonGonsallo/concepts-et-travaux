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
interface EtapeItem {
  id: number;
  travail_id: number;
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
      this.doubleSearch(false,false)
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
      this.userService.getActiveTravauxSansEquipements().subscribe({
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
      this.userService.getGammesSansEquipement().subscribe({
        next: (data: Gamme[]) => {
          this.gamme = data;
          this.listOfDisplayData = [...this.gamme];
          console.log("réponse de la requête getGammesSansEquipement", this.gamme);
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


listeCompleteSousCategories = [
  // travail_id: 2
  //{ travail_id: 2, etape_id: 1, label: 'Dépose d\'element de cuisine', value: 'service-depose-cuisine' },
  
  // travail_id: 3
  { travail_id: 3 , etape_id: 1, label: 'Démolition de murs', value: 'service-demolition-murs' },
  { travail_id: 3 , etape_id: 1, label: 'Ouverture partielle', value: 'service-ouverture-partielle' },
  { travail_id: 3 , etape_id: 1, label: 'Type de cloison demolition complete', value: 'cloison-demolition-complete' },
  { travail_id: 3 , etape_id: 1, label: 'Type de cloison ouverture partielle', value: 'cloison-ouverture-partielle' },
  
  // travail_id: 4
  { travail_id: 4 , etape_id: 1, label: 'Épaisseur de mur non porteur', value: 'epaisseur-creation-mur-non-porteur' },
  { travail_id: 4 , etape_id: 1, label: 'Type de cloison (mur non porteur)', value: 'type-de-cloison-murs-non-porteurs' },

  // travail_id: 5
  { travail_id: 5 , etape_id: 3, label: 'Carrelage mural', value: 'carrelage-mur' },
  { travail_id: 5 , etape_id: 1, label: 'Dépose murs', value: 'service-depose-murs' },
  { travail_id: 5 , etape_id: 3, label: 'Enduit décoratif mur', value: 'enduit-decoratif-mur' },
  { travail_id: 5 , etape_id: 2, label: 'État des surfaces (murs)', value: 'etat-des-surfaces-murs' },
  { travail_id: 5 , etape_id: 3, label: 'Papier peint mur', value: 'papier-peint-mur' },
  { travail_id: 5 , etape_id: 3, label: 'Peinture murale', value: 'peinture-mur' },
  { travail_id: 5 , etape_id: 3, label: 'Tissus muraux', value: 'tissus-mur' },
  { travail_id: 5 , etape_id: 3, label: 'Bois', value: 'bois' },
  
  // travail_id: 8
  { travail_id: 8 , etape_id: 1, label: 'Dépose revêtements plafond', value: 'service-depose-revetement-plafond' },
  { travail_id: 8 , etape_id: 2, label: 'Enduit décoratif plafond', value: 'enduit-decoratif-plafond' },
  { travail_id: 8 , etape_id: 2, label: 'État des surfaces (plafond)', value: 'etat-des-surfaces-plafond' },
  { travail_id: 8 , etape_id: 3, label: 'Papier peint plafond', value: 'papier-peint-plafond' },
  { travail_id: 8 , etape_id: 3, label: 'Peinture plafond', value: 'peinture-plafond' },
  { travail_id: 8 , etape_id: 3, label: 'Carrelage plafond', value: 'carrelage-plafond' },
  
  // travail_id: 9
  { travail_id: 9 , etape_id: 3, label: 'Carrelage (sol)', value: 'carrelage-sol' },
  { travail_id: 9 , etape_id: 1, label: 'Dépose revêtements sol', value: 'service-depose-revetement-sol' },
  { travail_id: 9 , etape_id: 2, label: 'État des surfaces (sol)', value: 'etat-des-surfaces-sol' },
  { travail_id: 9 , etape_id: 3, label: 'Moquette', value: 'moquette-de-sol' },
  { travail_id: 9 , etape_id: 3, label: 'Parquet flottant', value: 'parquet-flottant-sol' },
  { travail_id: 9 , etape_id: 3, label: 'Parquet massif', value: 'papier-massif-sol' },
  { travail_id: 9 , etape_id: 3, label: 'Peinture de sol', value: 'peinture-de-sol' },
  { travail_id: 9 , etape_id: 3, label: 'Plinthes bois', value: 'plinthes-bois-sol' },
  { travail_id: 9 , etape_id: 3, label: 'Plinthes carrelage', value: 'plinthes-carrelage-sol' },
  { travail_id: 9 , etape_id: 3, label: 'Résine décorative (sol)', value: 'resine-decorative-de-sol' },
  { travail_id: 9 , etape_id: 3, label: 'Sol souple', value: 'sol-souple' },
  
  // travail_id: 10
  { travail_id: 10 , etape_id: 3, label: 'Gamme de porte', value: 'gamme-de-porte' },
  { travail_id: 10 , etape_id: 3, label: 'Nature de la porte', value: 'nature-porte' },
  { travail_id: 10 , etape_id: 3, label: 'Type de porte coulissante', value: 'type-de-porte-coulissante' },
  { travail_id: 10 , etape_id: 3, label: 'Type de porte double', value: 'type-de-porte-double' },
  { travail_id: 10 , etape_id: 3, label: 'Type de porte simple', value: 'type-de-porte-simple' },
  

  // travail_id: 13
  //{ travail_id: 13 , etape_id: 3, label: 'Gamme d\'appareils (rénovation partielle)', value: 'gamme-appareils' },
  
  // travail_id: 15
  //{ travail_id: 15 , etape_id: 3, label: 'Rénovation électrique complète', value: 'service-renovation-electrique-complete' },
  
  // travail_id: 16
  //{ travail_id: 16 , etape_id: 1, label: 'Dépose d\'éléments de salle de bain / eau', value: 'service-depose-salle-de-bain-salle-d-eau' }
].sort((a, b) => {
  // Trier d'abord par travail_id
  if (a.travail_id !== b.travail_id) {
    return a.travail_id - b.travail_id;
  }
  // Puis par label alphabétique
  return a.label.localeCompare(b.label);
});


listeComplete: EtapeItem[] = [
  // ID 2 - Trié alphabétiquement
  //{ id: 1, travail_id:2, texte: "Étape 1 - Dépose d'anciennes installations" },
  //{ id: 2, texte: "Étape 3 - Choix des équipements de cuisine" },
  
  // ID 3 - Trié alphabétiquement
  { id: 1, travail_id:3, texte: "Étape 1 - Démolition complète de murs non porteurs" },
  { id: 1, travail_id:3, texte: "Étape 1 - Démolition partielle de murs non porteurs" },
  
  // ID 4
  { id: 1, travail_id:4, texte: "Étape 1 - Création des murs" },
  
  // ID 5 - Trié alphabétiquement
  { id: 1, travail_id:5, texte: "Étape 1 - Revêtements existants" },
  { id: 2, travail_id:5, texte: "Étape 2 - État des surfaces" },
  { id: 3, travail_id:5, texte: "Étape 3 - Choix du nouveau revêtement" },
  
  // ID 8 - Trié alphabétiquement
  { id: 1, travail_id:8, texte: "Étape 1 - Revêtements existants" },
  { id: 2, travail_id:8, texte: "Étape 2 - État des surfaces" },
  { id: 3, travail_id:8, texte: "Étape 3 - Choix du nouveau revêtement" },
  
  // ID 9 - Trié alphabétiquement
  { id: 1, travail_id:9, texte: "Étape 1 - Revêtements à retirer" },
  { id: 2, travail_id:9, texte: "Étape 2 - État des surfaces" },
  { id: 3, travail_id:9, texte: "Étape 3 - Choix du nouveau revêtement" },
  
  // ID 10 - Trié alphabétiquement
  { id: 1, travail_id:10, texte: "Étape 3 - Porte coulissante (de 70 à 90)" },
  { id: 2, travail_id:10, texte: "Étape 3 - Porte double (de 100 à 140)" },
  { id: 3, travail_id:10, texte: "Étape 3 - Porte simple (dimensions de 70 à 90)" },
  { id: 4, travail_id:10, texte: "Étape 3 - Nature de la porte" },
  { id: 5, travail_id:10, texte: "Étape 3 - Gamme de la porte" },
  
  // ID 12 - Trié alphabétiquement
  //{ id: 2, travail_id:11, texte: "Étape 2 - Choix du type de radiateur" },
 // { id: 3, travail_id:11, texte: "Étape 3 - Choix de la gamme de radiateur" },
  
  // ID 13 - Trié alphabétiquement
 // { id: 13, travail_id:2, texte: "Étape 3 - Appareillage à créer" },
 // { id: 13, travail_id:2, texte: "Étape 3 - Appareillage à remplacer" },
 // { id: 3, travail_id:13, texte: "Étape 3 - Prix des appareils" },
  
  // ID 15 - Trié alphabétiquement
 // { id: 3, travail_id:15, texte: "Étape 3 - Chauffage" },
  //{ id: 3, travail_id:15, texte: "Étape 3 - Mise aux normes" },
  //{ id: 3, travail_id:15, texte: "Étape 3 - Mise en sécurité" },
  
  // ID 16 - Trié alphabétiquement
  //{ id: 1, travail_id:16, texte: "Étape 1 - Dépose d'anciennes installations" },
 // { id: 16, travail_id:2, texte: "Étape 3 - Pose de nouveaux équipements sanitaires" }
];
filteredListEtapes: string[] = [];
filteredListSousCategories: any[] = [];
doubleSearch(effacerEtape:boolean,effacerSouscat:boolean): void {
  if(effacerEtape){
    this.filteredEtape=""
  }
  if(effacerSouscat){
    this.filteredSouscategorie=""
  }
  
  

  // Filtrer selon l'ID
  if (this.filteredTravailID === 0) {
    // ID = 1 : afficher toute la liste
    this.filteredListEtapes = this.listeComplete.map(item => item.texte);
    this.filteredListSousCategories = this.listeCompleteSousCategories;
  } else {
    if (this.filteredEtape) {
      // Filtrer par ID spécifique
      this.filteredListEtapes = this.listeComplete
        .filter(item => item.travail_id === this.filteredTravailID )
        .map(item => item.texte);
      this.filteredListSousCategories = this.listeCompleteSousCategories
        .filter(item => item.travail_id === this.filteredTravailID && item.etape_id === this.findIdByText(this.filteredEtape))
        .sort((a, b) => a.label.localeCompare(b.label));
    }else{
      // Filtrer par ID spécifique
      this.filteredListEtapes = this.listeComplete
        .filter(item => item.travail_id === this.filteredTravailID )
        .map(item => item.texte);
      this.filteredListSousCategories = this.listeCompleteSousCategories
        .filter(item => item.travail_id === this.filteredTravailID)
        .sort((a, b) => a.label.localeCompare(b.label));

    }


    
  }

  this.applyFilters();
}

findIdByText(text: string): number | null {
  const item = this.listeComplete.find(item => item.texte === text);
  return item ? item.id : null;
}


}