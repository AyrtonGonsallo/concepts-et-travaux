import { Component } from '@angular/core';
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
  selector: 'app-equipements-taches',
  templateUrl: './equipements-taches.component.html',
  styleUrl: './equipements-taches.component.css'
})
export class EquipementsTachesComponent {

size: NzButtonSize = 'large';
searchValue = '';
visible = false;
cacher_elements_fournisseurs_artisans = true

  constructor(private titleService: Title,private http: HttpClient,private authService: AuthService,private message: NzMessageService,private userService: ApiConceptsEtTravauxService) { }

  ngOnInit(): void {
    this.titleService.setTitle('Liste des équipements');
    

    Promise.all([
      this.loadGamme(),this.loadTravaux()
      
    ]).then(() => {
     

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
        order:"ascend",
        width:'70px'
      },
      {
        title: 'Sous-catégorie',
        compare: (a: Gamme, b: Gamme) => a.Type.localeCompare(b.Type),
        priority: 1,
        order:null,
        width:'70px'
      },
      {
        title: 'Étape',
        compare: (a: Gamme, b: Gamme) => (a.Etape??"").localeCompare(b.Etape??""),
        priority: 2,
        order:'ascend',
        width:'70px'
        
      },
      {
        title: 'Travail',
        compare: (a: Gamme, b: Gamme) => (this.get_travail_title(a.TravailID)??"").localeCompare(this.get_travail_title(b.TravailID)??""),
        priority: 1,
        order:null,
        width:'70px'
      },
      {
        title: 'Prix HT',
        compare: (a: Gamme, b: Gamme) => a.Prix-(b.Prix),
        priority: 1,
        order:null,
        width:'30px'
      },
      {
        title: 'Ordre',
        compare: (a: Gamme, b: Gamme) => a.Ordre-(b.Ordre),
        priority: 3,
        order:"ascend",
        width:'30px'
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
    
    { travail_id: 12 , etape_id: 3, label: 'Type de radiateur', value: 'type-de-radiateur' },
  
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
    { id: 2, travail_id:12, texte: "Étape 2 - Choix du type de radiateur" },
    //{ id: 3, travail_id:11, texte: "Étape 3 - Choix de la gamme de radiateur" },
    
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
        const matchNoFournisseursAndArtisans = !this.cacher_elements_fournisseurs_artisans || (item.FournisseurID === null && item.ArtisanID === null);

        return matchLabel && matchTravail && matchEtape  && matchType && matchNoFournisseursAndArtisans;
      });
    }
    search22(): void {
    
        this.applyFilters2();
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


  exporter() {
    this.userService.getExportGammes(this.filteredTravailID,this.filteredEtape2,this.filteredSouscategorie).subscribe((blob: Blob) => {
      // Créer une URL temporaire pour le fichier
      const url = window.URL.createObjectURL(blob);

      // Créer un lien HTML temporaire
      const a = document.createElement('a');
      a.href = url;
      a.download = 'export_fournitures.xlsx';  // Nom du fichier

      // Déclencher le téléchargement
      a.click();

      // Libérer l’URL blob après téléchargement
      window.URL.revokeObjectURL(url);

      console.log("Fichier exporté avec succès.");
    }, (error) => {
      console.error('Erreur lors de l\'export', error);
    });
  }



  
editingOrdreId: number | null = null;

editOrdre(data: any): void {
  this.editingOrdreId = data.ID;
}

saveOrdre(data: any): void {
  this.editingOrdreId = null;


   this.userService.updateGamme(parseInt(data.ID),data).subscribe(
        (response: any) => {
          console.log('gamme modifiée avec succès :', response);
          this.message.create('success', `ordre modifié avec succès`);
        },
        (error: any) => {
          console.error('Erreur lors de la modification:', error);
        }
      );

  // appel API ici
}


}
