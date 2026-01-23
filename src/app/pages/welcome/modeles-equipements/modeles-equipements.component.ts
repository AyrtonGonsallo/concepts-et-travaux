import { Component } from '@angular/core';
import { ModeleEquipement } from '../../../Models/ModeleEquipement';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../Services/auth.service';
import { ApiConceptsEtTravauxService } from '../../../Services/api-concepts-et-travaux.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Title } from '@angular/platform-browser';

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
      title: 'Tâche',
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
      this.loadModeleEquipements()
    ]).then(() => {
      const savedFilter = localStorage.getItem('filteredEtapeListeModeles');
      if (savedFilter) {
        this.filteredEtape = (savedFilter);
        console.log("Filtre récupéré: ", savedFilter);
      }
      this.search2();
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
    //  "Étape 3 - Appareillage à créer",
     // "Étape 3 - Appareillage à remplacer",
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

}