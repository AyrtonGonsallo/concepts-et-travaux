import { Component } from '@angular/core';
import { ModeleEquipement } from '../../../Models/ModeleEquipement';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../Services/auth.service';
import { ApiConceptsEtTravauxService } from '../../../Services/api-concepts-et-travaux.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Title } from '@angular/platform-browser';
import { Gamme } from '../../../Models/Gamme';
import { Travail } from '../../../Models/Travail';
interface EtapeItem {
  id: number;
  travail_id: number;
  texte: string;
}
@Component({
  selector: 'app-modeles-equipements',
  templateUrl: './modeles-equipements.component.html',
  styleUrl: './modeles-equipements.component.css'
})
export class ModelesEquipementsComponent {
  size: NzButtonSize = 'large';
  listOfColumn = [
  
   
    {
      title: 'Titre',
      compare: (a: ModeleEquipement, b: ModeleEquipement) => a.Titre.localeCompare(b.Titre),
      priority: 2,
      order:'ascend'
    },
    {
      title: 'Catégorie',
      compare: (a: ModeleEquipement, b: ModeleEquipement) => a.Equipement.Titre.localeCompare(b.Equipement.Titre),
      priority: 2,
      order:'ascend'
    },
    {
      title: 'Étape',
      compare: (a: ModeleEquipement, b: ModeleEquipement) => (a.Etape??"").localeCompare(b.Etape??""),
      priority: 2,
      order:'ascend'
    },
    {
      title: 'Prix',
      compare: (a: ModeleEquipement, b: ModeleEquipement) => (a.Prix?? 0)-(b.Prix??0),
      priority: 1,
      order:null
    },
   
  ];
  modeles:ModeleEquipement[] = [];

  constructor(private titleService: Title,private http: HttpClient,private authService: AuthService,private message: NzMessageService,private userService: ApiConceptsEtTravauxService) { }

  ngOnInit(): void {
    this.titleService.setTitle('Liste des équipements');
    

    Promise.all([
      this.loadModeleEquipements(),this.loadGamme(),this.loadTravaux()
      
    ]).then(() => {
      const savedFilter = localStorage.getItem('filteredEtapeListeModeles');
      if (savedFilter) {
        this.filteredEtape = (savedFilter);
        console.log("Filtre récupéré: ", savedFilter);
      }
      this.search2();

      const savedfilteredTravailIDListeGammes = localStorage.getItem('filteredTravailIDListeGammes2');
      if (savedfilteredTravailIDListeGammes) {
        this.filteredTravailID = parseInt(savedfilteredTravailIDListeGammes);
        console.log("Filtre récupéré travail: ", savedfilteredTravailIDListeGammes);
      }
      const savedfilteredEtapeListeGammes = localStorage.getItem('filteredEtapeListeGammes2');
      if (savedfilteredEtapeListeGammes) {
        this.filteredEtape2 = (savedfilteredEtapeListeGammes);
        console.log("Filtre récupéré étape: ", savedfilteredEtapeListeGammes);
      }
      const savedfilteredSouscategorieListeGammes = localStorage.getItem('filteredSouscategorieListeGammes2');
      if (savedfilteredSouscategorieListeGammes) {
        this.filteredSouscategorie = (savedfilteredSouscategorieListeGammes);
        console.log("Filtre récupéré : ", savedfilteredSouscategorieListeGammes);
      }
      this.doubleSearch(false,false)
    });
  }

 

  loadModeleEquipements(): Promise<void> {
      return new Promise((resolve, reject) => {
        this.userService.getModelesEquipement().subscribe({
          next: (data: ModeleEquipement[]) => {
            this.modele = data;
            this.listOfDisplayData = [...this.modele];
            console.log("réponse de la requête getModelesEquipement", this.modele);
            resolve();
          },
          error: (err) => reject(err)
        });
      });
    }

  getLabel(booleen:boolean){
    return booleen?"Oui":"Non"
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
  deleteModeleEquipement(id: number) {
    if (this.authService.isAdminorSuperAdmin()) {
      this.userService.deleteModeleEquipement(id).subscribe(
        () => {
          //console.log('ModeleEquipement supprimé avec succès');
          this.message.success( 'ModeleEquipement supprimée avec succès');
          // Mettez ici le code pour actualiser la liste des besoins si nécessaire
          Promise.all([
            this.loadModeleEquipements()
          ]).then(() => {
            const savedFilter = localStorage.getItem('filteredEtapeListeModeles');
            if (savedFilter) {
              this.filteredEtape = (savedFilter);
              console.log("Filtre récupéré: ", savedFilter);
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

  

   exporter() {
    this.userService.getExportModelesEquipements().subscribe((blob: Blob) => {
      // Créer une URL temporaire pour le fichier
      const url = window.URL.createObjectURL(blob);

      // Créer un lien HTML temporaire
      const a = document.createElement('a');
      a.href = url;
      a.download = 'modeles_export.csv';  // Nom du fichier

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

    this.userService.upload_import_equipements(formData).subscribe({
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

  filteredEtape=""

      
    liste = [
     // "Étape 3 - Appareillage à créer",
     // "Étape 3 - Appareillage à remplacer",
      "Étape 2 - type de radiateur",
      "Étape 3 - Choix des équipements de cuisine",
      "Étape 3 - Pose de nouveaux équipements sanitaires",
      "Étape 3 - Remplacement de radiateur",
  ];

listOfDisplayData :any;
modele:ModeleEquipement[] = [];
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
    localStorage.setItem('filteredEtapeListeModeles', this.filteredEtape);
      this.listOfDisplayData = this.modele.filter((item: ModeleEquipement) => {
        const matchLabel = !this.searchValue || item.Titre.toLowerCase().includes(this.searchValue.toLowerCase());
        const matchEtape = !this.filteredEtape || item.Etape === this.filteredEtape;
        return matchLabel  && matchEtape;
      });
    }




 travaux:Travail[] = [];
  loadTravaux(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.userService.getActiveTravauxAvecEquipements().subscribe({
        next: (data: Travail[]) => {
          this.travaux = data;
          console.log("réponse de la requête getTravaux", this.travaux);
          resolve();
        },
        error: (err) => reject(err)
      });
    });
  }

get_travail_title(id: number): string {
    const travail = this.travaux.find(travail => travail.ID === id);
    return travail ? travail.Titre : '';
  }
    listOfColumn22 = [
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
      title: 'Étape',
      compare: (a: Gamme, b: Gamme) => (a.Etape??"").localeCompare(b.Etape??""),
      priority: 2,
      order:'ascend'
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
  filteredTravailID=0
  filteredSouscategorie=""
  filteredEtape2 = ""
    listOfDisplayData22 :any;
    equipements_gammes:Gamme[] = [];
    loadGamme(): Promise<void> {
        return new Promise((resolve, reject) => {
          this.userService.getEquipementGammes().subscribe({
            next: (data2: Gamme[]) => {
              this.equipements_gammes = data2;
              this.listOfDisplayData22 = [...this.equipements_gammes];
              console.log("réponse de la requête getEquipementGammes", this.equipements_gammes);
              resolve();
            },
            error: (err) => reject(err)
          });
        });
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
              this.filteredEtape2 = (savedfilteredEtapeListeGammes);
              console.log("Filtre récupéré étape: ", savedfilteredEtapeListeGammes);
            }
            const savedfilteredSouscategorieListeGammes = localStorage.getItem('filteredSouscategorieListeGammes');
            if (savedfilteredSouscategorieListeGammes) {
              this.filteredSouscategorie = (savedfilteredSouscategorieListeGammes);
              console.log("Filtre récupéré : ", savedfilteredSouscategorieListeGammes);
            }
            this.search22();
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
  
listeCompleteSousCategories = [
  // travail_id: 2
  { travail_id: 2, etape_id: 1, label: 'Dépose d\'element de cuisine', value: 'service-depose-cuisine' },
  
  

  // travail_id: 13
  { travail_id: 13 , etape_id: 3, label: 'Gamme d\'appareils (rénovation partielle)', value: 'gamme-appareils' },
  
  // travail_id: 15
  { travail_id: 15 , etape_id: 3, label: 'Rénovation électrique complète', value: 'service-renovation-electrique-complete' },
  
  // travail_id: 16
  { travail_id: 16 , etape_id: 1, label: 'Dépose d\'éléments de salle de bain / eau', value: 'service-depose-salle-de-bain-salle-d-eau' }
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
  { id: 1, travail_id:2, texte: "Étape 1 - Dépose d'anciennes installations" },
  //{ id: 2, texte: "Étape 3 - Choix des équipements de cuisine" },
  
  // ID 3 - Trié alphabétiquement
  //{ id: 1, travail_id:3, texte: "Étape 1 - Démolition complète de murs non porteurs" },
  //{ id: 1, travail_id:3, texte: "Étape 1 - Démolition partielle de murs non porteurs" },
  
  // ID 4
  //{ id: 1, travail_id:4, texte: "Étape 1 - Création des murs" },
  
  // ID 5 - Trié alphabétiquement
  //{ id: 1, travail_id:5, texte: "Étape 1 - Revêtements existants" },
  //{ id: 2, travail_id:5, texte: "Étape 2 - État des surfaces" },
  //{ id: 3, travail_id:5, texte: "Étape 3 - Choix du nouveau revêtement" },
  
  // ID 8 - Trié alphabétiquement
  //{ id: 1, travail_id:8, texte: "Étape 1 - Revêtements existants" },
  //{ id: 2, travail_id:8, texte: "Étape 2 - État des surfaces" },
  //{ id: 3, travail_id:8, texte: "Étape 3 - Choix du nouveau revêtement" },
  
  // ID 9 - Trié alphabétiquement
  //{ id: 1, travail_id:9, texte: "Étape 1 - Revêtements à retirer" },
  //{ id: 2, travail_id:9, texte: "Étape 2 - État des surfaces" },
  //{ id: 3, travail_id:9, texte: "Étape 3 - Choix du nouveau revêtement" },
  
  // ID 10 - Trié alphabétiquement
  /*{ id: 1, travail_id:10, texte: "Étape 3 - Porte coulissante (de 70 à 90)" },
  { id: 2, travail_id:10, texte: "Étape 3 - Porte double (de 100 à 140)" },
  { id: 3, travail_id:10, texte: "Étape 3 - Porte simple (dimensions de 70 à 90)" },
  { id: 4, travail_id:10, texte: "Étape 3 - Nature de la porte" },
  { id: 5, travail_id:10, texte: "Étape 3 - Gamme de la porte" },
  */

  // ID 12 - Trié alphabétiquement
  { id: 2, travail_id:11, texte: "Étape 2 - Choix du type de radiateur" },
  { id: 3, travail_id:11, texte: "Étape 3 - Choix de la gamme de radiateur" },
  
  // ID 13 - Trié alphabétiquement
 // { id: 13, travail_id:2, texte: "Étape 3 - Appareillage à créer" },
 // { id: 13, travail_id:2, texte: "Étape 3 - Appareillage à remplacer" },
  { id: 3, travail_id:13, texte: "Étape 3 - Prix des appareils" },
  
  // ID 15 - Trié alphabétiquement
  { id: 3, travail_id:15, texte: "Étape 3 - Chauffage" },
  { id: 3, travail_id:15, texte: "Étape 3 - Mise aux normes" },
  { id: 3, travail_id:15, texte: "Étape 3 - Mise en sécurité" },
  
  // ID 16 - Trié alphabétiquement
  { id: 1, travail_id:16, texte: "Étape 1 - Dépose d'anciennes installations" },
 // { id: 16, travail_id:2, texte: "Étape 3 - Pose de nouveaux équipements sanitaires" }
];
filteredListEtapes: string[] = [];
filteredListSousCategories: any[] = [];
doubleSearch(effacerEtape:boolean,effacerSouscat:boolean): void {
  if(effacerEtape){
    this.filteredEtape2=""
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
    if (this.filteredEtape2) {
      console.log("this.filteredEtape2",this.filteredEtape2)
      // Filtrer par ID spécifique
      this.filteredListEtapes = this.listeComplete
        .filter(item => item.travail_id === this.filteredTravailID )
        .map(item => item.texte);
      this.filteredListSousCategories = this.listeCompleteSousCategories
        .filter(item => item.travail_id === this.filteredTravailID && item.etape_id === this.findIdByText(this.filteredEtape2))
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

  this.applyFilters2();
}

findIdByText(text: string): number | null {
  const item = this.listeComplete.find(item => item.texte === text);
  return item ? item.id : null;
}

applyFilters2(): void {
  
  localStorage.setItem('filteredTravailIDListeGammes2', this.filteredTravailID.toString());
  localStorage.setItem('filteredEtapeListeGammes2', this.filteredEtape2);
  localStorage.setItem('filteredSouscategorieListeGammes2', this.filteredSouscategorie);
  console.log('filteredTravailIDListeGammes2', this.filteredTravailID.toString())
  console.log('filteredEtapeListeGammes2', this.filteredEtape2)
  console.log('filteredSouscategorieListeGammes2', this.filteredSouscategorie)
    this.listOfDisplayData22 = this.equipements_gammes.filter((item: Gamme) => {
      const matchLabel = !this.searchValue || item.Label.toLowerCase().includes(this.searchValue.toLowerCase());
      const matchTravail = !this.filteredTravailID || (item.TravailID) === this.filteredTravailID;
      const matchEtape = !this.filteredEtape2 || item.Etape === this.filteredEtape2;
      const matchType = !this.filteredSouscategorie || item.Type === this.filteredSouscategorie;
      return matchLabel && matchTravail && matchEtape  && matchType;
    });
  }
  search22(): void {
  
      this.applyFilters2();
    }



}