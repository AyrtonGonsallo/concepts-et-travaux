import { Component, ElementRef, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, NonNullableFormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { ApiConceptsEtTravauxService } from '../../../../Services/api-concepts-et-travaux.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../../Services/auth.service';
import { ModeleEquipement } from '../../../../Models/ModeleEquipement';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { Gamme } from '../../../../Models/Gamme';
import { Travail } from '../../../../Models/Travail';

@Component({
  selector: 'app-fournisseur-details',
  templateUrl: './fournisseur-details.component.html',
  styleUrl: './fournisseur-details.component.css'
})
export class FournisseurDetailsComponent {

  baseurl=environment.imagesUrl
  
 

  constructor(private authService: AuthService,private fb: NonNullableFormBuilder,private http: HttpClient,private userService: ApiConceptsEtTravauxService, private route: ActivatedRoute,private message: NzMessageService, private router: Router) {
   

  
  }

  
  userId:number =  parseInt(this.route.snapshot.paramMap.get('id')??'0');
  ngOnInit(): void {
    // Obtenez l'ID de l'utilisateur à partir de l'URL
    const userId = this.route.snapshot.paramMap.get('id')??'0';
    // Utilisez l'ID pour récupérer les détails de l'utilisateur
    this.getUserDetails(userId);
    this.loadModeleEquipements()
    this.loadTravaux()
    this.loadGamme()
  }

  userData:any
 
  // Méthode pour récupérer les détails de l'utilisateur à partir de l'API
  getUserDetails(userId: string): void {
    this.userService.getUserById( parseInt(userId, 10)).subscribe(
      (response) => {
        this.userData = response
      
        console.log("réponse de la requette get_user",response);
      },
      (error) => {
        console.error('Erreur lors de la recuperation des details utilisateur :', error);
      }
    );
    
  }
  
  isnotAdmin(){
    return !this.authService.isAdmin()
  }
  isnotAdminorSuperadmin(){
    return !this.authService.isAdminorSuperAdmin()
  }

  deleteModeleEquipement(id: number) {
    if (this.authService.isAdminorSuperAdmin()) {
      this.userService.deleteModeleEquipement(id).subscribe(
        () => {
          //console.log('ModeleEquipement supprimé avec succès');
          this.message.success( 'Fourniture supprimée avec succès');
          // Mettez ici le code pour actualiser la liste des besoins si nécessaire
          this.loadModeleEquipements()
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

  cancel(): void {
    this.message.info('suppression annulée');
  }
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
      title: 'Prix HT',
      compare: (a: ModeleEquipement, b: ModeleEquipement) => (a.Prix?? 0)-(b.Prix??0),
      priority: 1,
      order:null
    },
   
  ];

  modele:ModeleEquipement[] = [];
  listOfDisplayData :any;
  loadModeleEquipements(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.userService.getFournisseurModelesEquipement(this.userId).subscribe({
        next: (data: ModeleEquipement[]) => {
          this.modele = data;
          this.listOfDisplayData = [...this.modele];
          console.log("réponse de la requête getFournisseurGammesSansEquipement", this.modele);
          resolve();
        },
        error: (err) => reject(err)
      });
    });
  }
   

 
  exporter() {
    this.userService.getExportModeleEquipementsFournisseur(this.userId).subscribe((blob: Blob) => {
      // Créer une URL temporaire pour le fichier
      const url = window.URL.createObjectURL(blob);

      // Créer un lien HTML temporaire
      const a = document.createElement('a');
      a.href = url;
      a.download = 'gammes_export.xlsx';  // Nom du fichier

      // Déclencher le téléchargement
      a.click();

      // Libérer l’URL blob après téléchargement
      window.URL.revokeObjectURL(url);

      console.log("Fichier exporté avec succès.");
    }, (error) => {
      console.error('Erreur lors de l\'export', error);
    });
  }

  telecharger_modele() {
    this.userService.downloadModelesFournisseurEquipements(this.userId).subscribe((blob: Blob) => {
      // Créer une URL temporaire pour le fichier
      const url = window.URL.createObjectURL(blob);

      // Créer un lien HTML temporaire
      const a = document.createElement('a');
      a.href = url;
      a.download = `modele_import_equipements_fournisseur_${this.userId}.xlsx`;  // Nom du fichier

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
@ViewChild('fileInput') fileInput!: ElementRef;
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
        this.message.success(res.message)
        this.loadModeleEquipements()
        this.selectedFile = null;
        this.fileInput.nativeElement.value = '';
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
















deleteTache(id: number) {
    if (this.authService.isAdminorSuperAdmin()) {
      this.userService.deleteGamme(id).subscribe(
        () => {
          //console.log('Gamme supprimé avec succès');
          this.message.success( 'Gamme supprimé avec succès');
          this.loadGamme()
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
  sizeTaches: NzButtonSize = 'large';
  listOfColumnTaches = [
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
      title: 'Prix HT',
      compare: (a: Gamme, b: Gamme) => a.Prix-(b.Prix),
      priority: 1,
      order:null
    },
    {
      title: 'Ordre',
      compare: (a: Gamme, b: Gamme) => a.Ordre-(b.Ordre),
      priority: 3,
      order:"ascend"
    },
    
  ];

  gamme:Gamme[] = [];
  listOfDisplayDataTaches :any;
 loadGamme(): Promise<void> {
     return new Promise((resolve, reject) => {
       this.userService.getFournisseurGammesSansEquipement(this.userId).subscribe({
         next: (data: Gamme[]) => {
           this.gamme = data;
           this.listOfDisplayDataTaches = [...this.gamme];
           console.log("réponse de la requête getFournisseurGammesSansEquipement", this.gamme);
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

  exporterTaches() {
    this.userService.getExportFournisseurGammes(this.userId).subscribe((blob: Blob) => {
      // Créer une URL temporaire pour le fichier
      const url = window.URL.createObjectURL(blob);

      // Créer un lien HTML temporaire
      const a = document.createElement('a');
      a.href = url;
      a.download = 'gammes_export.xlsx';  // Nom du fichier

      // Déclencher le téléchargement
      a.click();

      // Libérer l’URL blob après téléchargement
      window.URL.revokeObjectURL(url);

      console.log("Fichier exporté avec succès.");
    }, (error) => {
      console.error('Erreur lors de l\'export', error);
    });
  }

  telecharger_modeleTaches() {
    this.userService.downloadModeleGammesFournisseur(this.userId).subscribe((blob: Blob) => {
      // Créer une URL temporaire pour le fichier
      const url = window.URL.createObjectURL(blob);

      // Créer un lien HTML temporaire
      const a = document.createElement('a');
      a.href = url;
      a.download = `modele_import_taches_fournisseur_${this.userId}.xlsx`;  // Nom du fichier

      // Déclencher le téléchargement
      a.click();

      // Libérer l’URL blob après téléchargement
      window.URL.revokeObjectURL(url);

      console.log("Fichier exporté avec succès.");
    }, (error) => {
      console.error('Erreur lors de l\'export', error);
    });
  }


selectedFileTaches: File | null = null;
@ViewChild('fileInputTaches') fileInputTaches!: ElementRef;
onFileSelectedTaches(event: any) {
  this.selectedFileTaches = event.target.files[0];
}


  importerTaches() {
  if (this.selectedFileTaches) {
    const formData = new FormData();
    formData.append('file', this.selectedFileTaches);

    this.userService.upload_import_gammes_file(formData).subscribe({
      next: (res) => {
        console.log('Fichier uploadé avec succès', res);
        this.message.success(res.message)
        this.loadGamme()
        this.selectedFile = null;
        this.fileInputTaches.nativeElement.value = '';
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
  
}