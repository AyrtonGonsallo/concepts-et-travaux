import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, NonNullableFormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { ApiConceptsEtTravauxService } from '../../../../Services/api-concepts-et-travaux.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../../Services/auth.service';
import { Gamme } from '../../../../Models/Gamme';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { Travail } from '../../../../Models/Travail';

@Component({
  selector: 'app-artisan-details',
  templateUrl: './artisan-details.component.html',
  styleUrl: './artisan-details.component.css'
})
export class ArtisanDetailsComponent {

  baseurl=environment.imagesUrl
  validateForm: FormGroup<{
    RaisonSociale: FormControl<string>;
    NumeroSIRET: FormControl<string>;
    Nom: FormControl<string>;
    Prenom: FormControl<string>;
    Email: FormControl<string>;
    Password: FormControl<string>;
    Telephone: FormControl<string>;
    AdressePostale: FormControl<string>;
    CodePostal: FormControl<string>;
    CommunePostale: FormControl<string>;
    Activite:  FormControl<string>;
    CA: FormControl<number>;
    checkPassword: FormControl<string>;
    Effectif: FormControl<number>;
    References: FormControl<string>;
    Adresse: FormControl<string>;
    NomDirigeant: FormControl<string>;
    ZoneGeographiqueDactivite: FormControl<string>;
    Qualifications: FormControl<string>;
  }>;
 
  submitForm(): void {
    
    if (this.validateForm.valid) {

      console.log('submit', this.validateForm.value);
      this.userService.updateFournisseur(this.userId,this.validateForm.value).subscribe(
        (response) => {
          console.log('Utilisateur modifié avec succès :', response);
          this.message.create('success', `Utilisateur modifié avec succès`);
          this.router.navigate(['/administration/artisans']);
        },
        (error) => {
          console.error('Erreur lors de la modification de l\'utilisateur :', error);
        }
      );
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  updateConfirmValidator(): void {
    /** wait for refresh value */
    Promise.resolve().then(() => this.validateForm.controls.checkPassword.updateValueAndValidity());
  }

  confirmationValidator: ValidatorFn = (control: AbstractControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateForm.controls.Password.value) {
      return { confirm: true, error: true };
    }
    return {};
  };

 

  constructor(private authService: AuthService,private fb: NonNullableFormBuilder,private http: HttpClient,private userService: ApiConceptsEtTravauxService, private route: ActivatedRoute,private message: NzMessageService, private router: Router) {
    this.validateForm = this.fb.group({
      Email: ['', [Validators.email, Validators.required]],
      Password: ['000', []],
      checkPassword: ['', [ this.confirmationValidator]],
      Nom: ['', [Validators.required]],
      Prenom: ['', [Validators.required]],
      Telephone: ['', [Validators.required]],
      RaisonSociale: ['', []],
      NumeroSIRET: ['', [Validators.pattern(/^[0-9]{4,15}$/)]],
      CodePostal:  ['', [Validators.pattern(/^[0-9]{4,6}$/)]],
      CommunePostale:  ['', []],
      AdressePostale: ['', []],
      Activite:  ['', []],
      CA: [0, []],
      Effectif: [0, []],
      References: ['', []],
      Adresse: ['', []],
      NomDirigeant: ['', []],
      ZoneGeographiqueDactivite: ['', []],
      Qualifications: ['', []],
     
    });

  
  }

  
  userId:number =  parseInt(this.route.snapshot.paramMap.get('id')??'0');
  ngOnInit(): void {
    // Obtenez l'ID de l'utilisateur à partir de l'URL
    const userId = this.route.snapshot.paramMap.get('id')??'0';
    // Utilisez l'ID pour récupérer les détails de l'utilisateur
    this.getUserDetails(userId);
    this.loadTravaux()
    this.loadGamme()
  }

  userData:any
 
  // Méthode pour récupérer les détails de l'utilisateur à partir de l'API
  getUserDetails(userId: string): void {
    this.userService.getUserById( parseInt(userId, 10)).subscribe(
      (response) => {
        this.userData = response
        response.checkPassword="000"
        response.Password="000"
        this.validateForm.patchValue(response);
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

   deleteGamme(id: number) {
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
  size: NzButtonSize = 'large';
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
  listOfDisplayData :any;
 loadGamme(): Promise<void> {
     return new Promise((resolve, reject) => {
       this.userService.getArtisanGammesSansEquipement(this.userId).subscribe({
         next: (data: Gamme[]) => {
           this.gamme = data;
           this.listOfDisplayData = [...this.gamme];
           console.log("réponse de la requête getArtisanGammesSansEquipement", this.gamme);
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

  exporter() {
    this.userService.getExportArtisanGammes(this.userId).subscribe((blob: Blob) => {
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
    this.userService.downloadModeleGammesArtisan(this.userId).subscribe((blob: Blob) => {
      // Créer une URL temporaire pour le fichier
      const url = window.URL.createObjectURL(blob);

      // Créer un lien HTML temporaire
      const a = document.createElement('a');
      a.href = url;
      a.download = `modele_import_de_l_artisan_${this.userId}.xlsx`;  // Nom du fichier

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
        this.message.success(res.message)
        this.loadGamme()
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