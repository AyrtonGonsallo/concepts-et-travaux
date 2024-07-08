import { Component } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ApiConceptsEtTravauxService } from '../../../../Services/api-concepts-et-travaux.service';
import { Galerie } from '../../../../Models/Galerie';
import { NzSelectSizeType } from 'ng-zorro-antd/select';
import { CategoriePiece } from '../../../../Models/Categorie-Piece';
interface FormValues {
  Titre?: string;    
  Présentation?: string;
    Description?: string;
    Image_principale?: string;
    Categories?: any [];
    GalerieID?: number; // Le point d'interrogation indique que la propriété est facultative
}

@Component({
  selector: 'app-modifier-piece',
  templateUrl: './modifier-piece.component.html',
  styleUrl: './modifier-piece.component.css'
})
export class ModifierPieceComponent {
  validateForm: FormGroup<{
    Titre: FormControl<string>;
    Présentation: FormControl<string>;
    Description: FormControl<string>;
    Image_principale: FormControl<string>;
    Image_presentation: FormControl<string>;
    GalerieID: FormControl<number>;
  }>;
  fileSizeError = false;
  maxFileSize = 10 * 1024 * 1024; // 10 MB in bytes
  file_Image_principale: string="";
  file_Image_presentation: string="";
  size: NzSelectSizeType = 'default';
  multipleValue : number[] = [];
  categories: CategoriePiece[] = [];
  submitForm(): void {
    if (this.validateForm.valid) {
      const formValues: FormValues = { ...this.validateForm.value };
      formValues.Categories = this.multipleValue;
      console.log('submit', formValues);
      this.userService.update_piece(parseInt(this.pieceId),formValues).subscribe(
        (response) => {
          console.log("réponse de la requette modifier piece",response);
          this.message.create('success', `pièce modifiee avec succès`);
          this.router.navigate(['/administration/pieces']);

        },
        (error) => {
          console.error('Erreur lors de l\'ajout des pieces :', error);
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
        Image_principale: uniqueFileName
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

  handleFileInput2(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const file: File = (inputElement.files as FileList)[0];
    if (file.size > this.maxFileSize) {
      this.fileSizeError = true;
      // Clear the input field to prevent further processing of the large file
      inputElement.value = '';
      
    }else{
      const timestamp = Date.now();
      const uniqueFileName = this.slugify(`${timestamp}_${file.name}`);
      this.file_Image_presentation =  uniqueFileName;
    
      // Mettre à jour la valeur de l'input
      this.validateForm.patchValue({
        Image_presentation: uniqueFileName
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
  pieceId:string =  this.route.snapshot.paramMap.get('id')??'0';

  ngOnInit(): void {
    this.loadGaleries();
    this.loadCategories();
    this.getPieceDetails(this.pieceId)
  }
  galeries: Galerie[] = [];
  loadGaleries(): void {
    this.userService.get_galeries().subscribe(
      (response) => {
        this.galeries = response;
        console.log("réponse de la requette get_galeries",this.galeries);
      },
      (error) => {
        console.error('Erreur lors de la recuperation des galeries :', error);
      }
    );
  }

  loadCategories(): void {
    this.userService.getCategoriesPiece().subscribe(
      (response) => {
        this.categories= response;
        console.log("réponse de la requette getCategoriesPiece",this.galeries);
      },
      (error) => {
        console.error('Erreur lors de la recuperation des CategoriesPiece :', error);
      }
    );
  }
  constructor(private fb: NonNullableFormBuilder,private route: ActivatedRoute,private router: Router,private message: NzMessageService,private userService: ApiConceptsEtTravauxService) {
    this.validateForm = this.fb.group({
      Titre: ['', [ Validators.required]],
      Présentation: ['', [ Validators.required]],
    Description: ['', [ Validators.required]],
    Image_principale: ['', [ ]],
    Image_presentation: ['', [ ]],
    GalerieID:  [0, [ ]],
    });
  }

  
  // Méthode pour récupérer les détails de l'utilisateur à partir de l'API
  getPieceDetails(id: string): void {
    this.userService.getPiece( parseInt(id, 10)).subscribe(
      (response) => {
        console.log("réponse de la requette get piece details",response);
        this.validateForm.patchValue(response);
        
        response.CategoriePieces.forEach((besoin: any) => {
          // Ajouter l'ID de l'besoin à multipleValue
          this.multipleValue.push(besoin.ID);
        });
        
        
      },
      (error) => {
        console.error('Erreur lors de la recuperation des details piece :', error);
      }
    );
    
  }
}