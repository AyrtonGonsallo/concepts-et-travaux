import { Component } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { NzSelectSizeType } from 'ng-zorro-antd/select';
import { Equipement } from '../../../../Models/Equipement';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ApiConceptsEtTravauxService } from '../../../../Services/api-concepts-et-travaux.service';
import { Utilisateur } from '../../../../Models/Utilisateurs';
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
  selector: 'app-ajouter-modele',
  templateUrl: './ajouter-modele.component.html',
  styleUrl: './ajouter-modele.component.css'
})
export class AjouterModeleComponent {
  validateForm: FormGroup<{
    Titre: FormControl<string>;
    Image: FormControl<string>;
    Description: FormControl<string>;
    Longeur: FormControl<number>;
    Largeur: FormControl<number>;
    PrixFournisseur: FormControl<number>;
    PrixPose: FormControl<number>;
    Prix: FormControl<number>;
    Hauteur: FormControl<number>;
    Epaisseur: FormControl<number>;
    NombreDeVasques: FormControl<number>;
    Matiere: FormControl<string>;
    EquipementID: FormControl<number>;
    Etape: FormControl<string>;
     ActiverFournisseur: FormControl<boolean>;
    FournisseurID: FormControl<number>;
    ModeleDeReferenceID: FormControl<number>;
  }>;
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
      this.userService.addModeleEquipement(formValues).subscribe(
        (response) => {
          console.log("réponse de la requette ajouter modele",response);
          this.message.create('success', `modele ajouté avec succès`);
          this.router.navigate(['/administration/modeles-equipements']);

        },
        (error) => {
          console.error('Erreur lors de l\'ajout des modeles :', error);
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
fournisseurs:Utilisateur[]=[]
loadFournisseurs(){
    this.userService.getUsersByRole(14)
        .subscribe((data: Utilisateur[]) => {
          this.fournisseurs = data;
          console.log("réponse de la requette loadFournisseurs",this.fournisseurs);
        });
  }
  ngOnInit(): void {
    this.loadEquipements();
    this.loadFournisseurs()
    this.validateForm.get('PrixFournisseur')!.valueChanges.subscribe(() => {
      this.updatePrixTotal();
    });
    this.validateForm.get('PrixPose')!.valueChanges.subscribe(() => {
      this.updatePrixTotal();
    });
  }

  updatePrixTotal(): void {
    const fournisseur = this.validateForm.get('PrixFournisseur')!.value || 0;
    const pose = this.validateForm.get('PrixPose')!.value || 0;
    this.validateForm.get('Prix')!.setValue(fournisseur + pose, { emitEvent: false });
  }



  activerFournisseur(){
    return this.validateForm.value.ActiverFournisseur==true
  }
  loadEquipements(): void {
    this.userService.getEquipements().subscribe(
      (response) => {
        this.equipements= response;
        console.log("réponse de la requette getEquipements",this.equipements);

         this.groupedTypes = this.equipements.reduce((acc, eq) => {
      if (!acc[eq.Type]) {
        acc[eq.Type] = [];
      }
      acc[eq.Type].push(eq);
      return acc;
    }, {} as { [key: string]: Equipement[] });
      },
      (error) => {
        console.error('Erreur lors de la recuperation des getEquipements :', error);
      }
    );
  }
  constructor(private fb: NonNullableFormBuilder,private router: Router,private message: NzMessageService,private userService: ApiConceptsEtTravauxService) {
    this.validateForm = this.fb.group({
      
    Titre: ['', [ Validators.required]],
    Image: ['', [ ]],
    Description: ['', [ Validators.required]],
    Longeur: [0, [ ]],
    Largeur: [0, [ ]],
     PrixPose: [0, [Validators.required]],
      PrixFournisseur: [0, [Validators.required]],
    Prix: [0, [ ]],
    Hauteur: [0, [ ]],
    Epaisseur: [0, [ ]],
    NombreDeVasques: [0, [ ]],
    Matiere: ['', [ ]],
    Etape: ['', [Validators.required ]],
    EquipementID: [0, [Validators.required ]],
     ActiverFournisseur: [false, [ ]],
    FournisseurID:[0, [ ]],
    ModeleDeReferenceID: [0, [ ]],
    });
  }


   liste = [
      //"Étape 3 - Appareillage à créer",
     // "Étape 3 - Appareillage à remplacer",
      "Étape 3 - Choix des équipements de cuisine",
      "Étape 3 - Pose de nouveaux équipements sanitaires",
  ];
}