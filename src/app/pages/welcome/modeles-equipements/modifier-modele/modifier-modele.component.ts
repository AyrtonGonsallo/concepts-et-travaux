import { Component } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { NzSelectSizeType } from 'ng-zorro-antd/select';
import { Equipement } from '../../../../Models/Equipement';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ApiConceptsEtTravauxService } from '../../../../Services/api-concepts-et-travaux.service';
import { Utilisateur } from '../../../../Models/Utilisateurs';
import { environment } from '../../../../environments/environment';
import { ModeleEquipement } from '../../../../Models/ModeleEquipement';
import { AuthService } from '../../../../Services/auth.service';
import { Subject, takeUntil } from 'rxjs';
interface FormValues {
    Titre?: string;
    Description?: string;
    Image?: string ;
    Longeur?: number ;
    Largeur?: number ;
    Hauteur?: number ;
    Epaisseur?: number ;
    Matiere?: string ;
    EquipementID?: number;
}

@Component({
  selector: 'app-modifier-modele',
  templateUrl: './modifier-modele.component.html',
  styleUrl: './modifier-modele.component.css'
})
export class ModifierModeleComponent {
  apiUrl = environment.imagesUrl;
  
  validateForm: FormGroup<{
    Titre: FormControl<string>;
    Image: FormControl<string>;
    Description: FormControl<string>;
    Longeur: FormControl<number>;
    Largeur: FormControl<number>;
    Hauteur: FormControl<number>;
    PrixFournisseur: FormControl<number>;
    PrixPose: FormControl<number>;
    Prix: FormControl<number>;
    Epaisseur: FormControl<number>;
    NombreDeVasques: FormControl<number>;
    Matiere: FormControl<string>;
    EquipementID: FormControl<number>;
    Etape: FormControl<string>;
     ActiverFournisseur: FormControl<boolean>;
    FournisseurID: FormControl<number>;
    ActiverArtisan: FormControl<boolean>;
    ArtisanID: FormControl<number>;
    ModeleDeReferenceID: FormControl<number>;
  }>;

  modeleId:string = '0';
  private destroy$ = new Subject<void>();
  
  fileSizeError = false;
  maxFileSize = 10 * 1024 * 1024; // 10 MB in bytes
  file_Image_principale: string="";
  size: NzSelectSizeType = 'default';
  multipleValue : number[] = [];
  equipements: Equipement[] = [];
  groupedTypes = this.equipements.reduce((acc, eq) => {
    if (!acc[eq.Type]) {
      acc[eq.Type] = [];
    }
    acc[eq.Type].push(eq);
    return acc;
  }, {} as { [key: string]: Equipement[] });


  groupedTypeKeys(): string[] {
    return Object.keys(this.groupedTypes);
  }





  submitForm(): void {
    if (this.validateForm.valid) {
      const formValues: FormValues = { ...this.validateForm.value };
      
      console.log('submit', formValues);
      this.userService.updateModeleEquipement(parseInt(this.modeleId),formValues).subscribe(
        (response) => {
          console.log("réponse de la requette update modele",response);
          this.message.create('success', `modele mis a jour avec succès`);
          this.router.navigate(['/administration/modeles-equipements']);

        },
        (error) => {
          console.error('Erreur lors de la mise a jour du modele :', error);
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
  slugify(text: string) {
    const lastDotIndex = text.lastIndexOf('.'); // Trouver l'index du dernier point
  
    if (lastDotIndex === -1) {
      // S'il n'y a pas de point, appliquer les transformations sur tout le texte
      return text
        .toLowerCase()
        .replace(/[^\w\s.-]/g, '') // Supprimer les caractères non alphanumériques sauf les espaces, les tirets et les points
        .replace(/[\s_-]+/g, '-') // Remplacer les espaces et les tirets par un seul tiret
        .replace(/^-+|-+$/g, ''); // Supprimer les tirets en début et fin de chaîne
    }
  
    // Séparer le nom de fichier et l'extension
    const name = text.substring(0, lastDotIndex);
    const extension = text.substring(lastDotIndex);
  
    // Appliquer les transformations sur le nom de fichier uniquement
    const slugifiedName = name
      .toLowerCase()
      .replace(/[^\w\s.-]/g, '') // Supprimer les caractères non alphanumériques sauf les espaces, les tirets et les points
      .replace(/[\s_-]+/g, '-') // Remplacer les espaces et les tirets par un seul tiret
      .replace(/^-+|-+$/g, ''); // Supprimer les tirets en début et fin de chaîne
  
    // Combiner le nom de fichier transformé avec l'extension
    return slugifiedName + extension;
  }

  handleFileInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const file: File = (inputElement.files as FileList)[0];
    if (file.size > this.maxFileSize) {
      this.fileSizeError = true;
      // Clear the input field to prevent further processing of the large file
      inputElement.value = '';
      
    }else{
      const timestamp = Date.now();
      const uniqueFileName = this.slugify(`${timestamp}_${file.name}`);
      this.file_Image_principale =  uniqueFileName;
    
      // Mettre à jour la valeur de l'input
      this.validateForm.patchValue({
        Image: uniqueFileName
      });
      const formData = new FormData();
      const renamedFile = new File([file], uniqueFileName, { type: file.type });
      formData.append('file', renamedFile);
    // Envoyer le fichier au serveur
    this.userService.upload_file(formData).subscribe(response => {
      console.log('Fichier téléchargé avec succès:', response);
      // Maintenant, vous avez le chemin d'accès au fichier sur le serveur, que vous pouvez stocker dans votre base de données.
    });
      console.log(file);
  }
  }

  


ngOnInit(): void {
  // 1. Référentiels
  this.loadEquipements();
  this.loadFournisseurs();
  this.loadArtisans();
  this.loadModelesDeRef();

  // 2. Abonnements formulaire
  this.validateForm.get('PrixFournisseur')!.valueChanges
    .pipe(takeUntil(this.destroy$))
    .subscribe(() => this.updatePrixTotal());

  this.validateForm.get('PrixPose')!.valueChanges
    .pipe(takeUntil(this.destroy$))
    .subscribe(() => this.updatePrixTotal());

  // 3. Query params : type + gamme/modèle de référence
  this.route.queryParamMap
    .pipe(takeUntil(this.destroy$))
    .subscribe(params => {
      const type = params.get('type');
      const ref = params.get('gammederef') ?? params.get('modelederef');

      if (type === 'artisan') {
        this.validateForm.patchValue({
          ActiverArtisan: true,
          ActiverFournisseur: false,
        });
      } else if (type === 'fournisseur') {
        this.validateForm.patchValue({
          ActiverFournisseur: true,
          ActiverArtisan: false,
        });
      }

      if (ref) {
        this.validateForm.patchValue({
          ModeleDeReferenceID: +ref,
        });
      }
    });

  // 4. Détails du modèle (lié à l'ID → rechargeable)
  this.route.paramMap
    .pipe(takeUntil(this.destroy$))
    .subscribe(params => {
      const newId = params.get('id') ?? '0';
      if (newId === this.modeleId) return;
      this.modeleId = newId;
      this.getModeleDetails(parseInt(this.modeleId, 10));
    });
}

ngOnDestroy(): void {
  this.destroy$.next();
  this.destroy$.complete();
}


  updatePrixTotal(): void {
    const fournisseur = this.validateForm.get('PrixFournisseur')!.value || 0;
    const pose = this.validateForm.get('PrixPose')!.value || 0;
    this.validateForm.get('Prix')!.setValue(fournisseur + pose, { emitEvent: false });
  }

  
  fournisseurs:Utilisateur[]=[]
  artisans:Utilisateur[]=[]
  
  
    loadFournisseurs(){
      this.userService.getUsersByRole(15)
          .subscribe((data: Utilisateur[]) => {
            this.fournisseurs = data;
            console.log("réponse de la requette loadFournisseurs",this.fournisseurs);
          });
    }
  
  
    loadArtisans(){
      this.userService.getUsersByRole(17)
          .subscribe((data: Utilisateur[]) => {
            this.artisans = data;
            console.log("réponse de la requette loadartisans",this.artisans);
          });
    }
  
  
      equipements_modeles_de_ref:ModeleEquipement[] = [];
      listOfDisplayModelesDeRef:ModeleEquipement[] = [];
      loadModelesDeRef(): Promise<void> {
          return new Promise((resolve, reject) => {
            this.userService.getModelesEquipementDeRef().subscribe({
              next: (data2: ModeleEquipement[]) => {
                this.equipements_modeles_de_ref = data2;
                this.listOfDisplayModelesDeRef = [...this.equipements_modeles_de_ref];
                console.log("réponse de la requête getEquipementmodelesDEREF", this.equipements_modeles_de_ref);
                resolve();
              },
              error: (err) => reject(err)
            });
          });
        }

        
  listOfRelatedEquipementsFournisseurs:ModeleEquipement[] = [];
  listOfRelatedEquipementsArtisans:ModeleEquipement[] = [];


  loadRelatedEquipementsArtisans(): Promise<void> {
      return new Promise((resolve, reject) => {
        this.userService.get_artisans_modeles_equipement_by_ref_id(parseInt(this.modeleId)).subscribe({
          next: (data2: ModeleEquipement[]) => {
            this.listOfRelatedEquipementsArtisans = data2;
            console.log("réponse de la requête listOfRelatedEquipementsArtisans", this.listOfRelatedEquipementsArtisans);
            resolve();
          },
          error: (err) => reject(err)
        });
      });
    }

    loadRelatedEquipementsFournisseurs(): Promise<void> {
      return new Promise((resolve, reject) => {
        this.userService.get_fournisseurs_modeles_equipement_by_ref_id(parseInt(this.modeleId)).subscribe({
          next: (data2: ModeleEquipement[]) => {
            this.listOfRelatedEquipementsFournisseurs = data2;
            console.log("réponse de la requête listOfRelatedEquipementsFournisseurs", this.listOfRelatedEquipementsFournisseurs);
            resolve();
          },
          error: (err) => reject(err)
        });
      });
    }
  


  loadEquipements(): void {
    this.userService.getEquipements().subscribe(
      (response) => {
        this.equipements= response;
        console.log("réponse de la requette getCategoriesPiece",this.equipements);
        this.groupedTypes = this.equipements.reduce((acc, eq) => {
        if (!acc[eq.Type]) {
          acc[eq.Type] = [];
        }
        acc[eq.Type].push(eq);
        return acc;
      }, {} as { [key: string]: Equipement[] });
      },
      (error) => {
        console.error('Erreur lors de la recuperation des CategoriesPiece :', error);
      }
    );
  }
  constructor(private fb: NonNullableFormBuilder,private authService: AuthService,private route:ActivatedRoute,private router: Router,private message: NzMessageService,private userService: ApiConceptsEtTravauxService) {
    this.validateForm = this.fb.group({
      
    Titre: ['', [ Validators.required]],
    Image: ['', [ ]],
    Description: ['', [ Validators.required]],
    Longeur: [0, [ ]],
    Largeur: [0, [ ]],
    Hauteur: [0, [ ]],
     PrixPose: [0, [Validators.required]],
      PrixFournisseur: [0, [Validators.required]],
    Prix: [0, [ ]],
    Epaisseur: [0, [ ]],
    NombreDeVasques: [0, [ ]],
    Matiere: ['', [ ]],
    EquipementID: [0, [Validators.required ]],
    Etape: ['', [Validators.required ]],
    ActiverFournisseur: [false, [ ]],
    FournisseurID:[0, [ ]],
     ActiverArtisan: [false, [ ]],
    ArtisanID:[0, [ ]],
    ModeleDeReferenceID: [0, [ ]],
    });
  }

  is_gamme_de_ref=false

  activerFournisseur(){
    return this.validateForm.value.ActiverFournisseur==true
  }
   activerArtisan(){
    return this.validateForm.value.ActiverArtisan==true
  }

  
  // Méthode pour récupérer les détails de l'utilisateur à partir de l'API
  getModeleDetails(id: number): void {
    this.userService.getModeleEquipementById( id).subscribe(
      (response) => {
        console.log("réponse de la requette get piece details",response);
        this.validateForm.patchValue(response);

         this.is_gamme_de_ref = ! (response.ActiverArtisan || response.ActiverFournisseur)

        if(this.is_gamme_de_ref){

          console.log('chargement des Equipements artisans et fournisseur')
          this.loadRelatedEquipementsArtisans()
          this.loadRelatedEquipementsFournisseurs()
        }else{
          console.log('remise a 0 des Equipements artisans et fournisseur')
          this.listOfRelatedEquipementsArtisans = []
          this.listOfRelatedEquipementsFournisseurs = []
        }
        
        
        
        
      },
      (error) => {
        console.error('Erreur lors de la recuperation des details piece :', error);
      }
    );
    
  }


 liste = [
     "Radiateur (étape 3)",
      "Équipement de cuisine (étape 3)",
      "Équipement sanitaires (étape 3)",
  ];


  deleteModeleEquipement(id: number) {
    if (this.authService.isAdminorSuperAdmin()) {
      this.userService.deleteModeleEquipement(id).subscribe(
        () => {
          //console.log('ModeleEquipement supprimé avec succès');
          this.message.success( 'ModeleEquipement supprimée avec succès');
          this.loadRelatedEquipementsArtisans()
          this.loadRelatedEquipementsFournisseurs()
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