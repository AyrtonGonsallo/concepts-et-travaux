import { Component } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { NzSelectSizeType } from 'ng-zorro-antd/select';
import { Equipement } from '../../../../Models/Equipement';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ApiConceptsEtTravauxService } from '../../../../Services/api-concepts-et-travaux.service';
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
    Prix: FormControl<number>;
    Hauteur: FormControl<number>;
    Epaisseur: FormControl<number>;
    Matiere: FormControl<string>;
    EquipementID: FormControl<number>;
  }>;
  fileSizeError = false;
  maxFileSize = 10 * 1024 * 1024; // 10 MB in bytes
  file_Image_principale: string="";
  size: NzSelectSizeType = 'default';
  multipleValue : number[] = [];
  equipements: Equipement[] = [];
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

  ngOnInit(): void {
    this.loadEquipements();
  }

  loadEquipements(): void {
    this.userService.getEquipements().subscribe(
      (response) => {
        this.equipements= response;
        console.log("réponse de la requette getCategoriesPiece",this.equipements);
      },
      (error) => {
        console.error('Erreur lors de la recuperation des CategoriesPiece :', error);
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
    Prix: [0, [ ]],
    Hauteur: [0, [ ]],
    Epaisseur: [0, [ ]],
    Matiere: ['', [ ]],
    EquipementID: [0, [Validators.required ]],
    });
  }
}