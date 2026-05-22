import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { ApiConceptsEtTravauxService } from '../../../../Services/api-concepts-et-travaux.service';
import { Router } from '@angular/router';
import { Style } from '../../../../Models/Style';
import { Piece } from '../../../../Models/Piece';

@Component({
  selector: 'app-ajouter-galerie',
  templateUrl: './ajouter-galerie.component.html',
  styleUrls: ['./ajouter-galerie.component.css']
})
export class AjouterGalerieComponent implements OnInit {
  validateForm: FormGroup;
  file_list: NzUploadFile[] = []; // Tableau pour stocker les fichiers sélectionnés

  constructor(private fb: FormBuilder,private msg:NzMessageService, private router: Router,private userService: ApiConceptsEtTravauxService) {
    this.validateForm = this.fb.group({
      titre: ['', [Validators.required]],
      type: [null, [Validators.required]],
      description: ['', []],
      cover_image: ['', [Validators.required]],
      pieces: [[], []],
      styles: [[], []],
      images: [null, Validators.required] // Contrôle pour les fichiers, requis
    });
  }
  ngOnInit(): void {
    this.loadStyle()
    this.loadPieces()
  }

selectedPieces: number[] = [];
selectedStyles: number[] = [];
  add_piece(values: number[]) {
    this.selectedPieces = values;
    this.validateForm.get('pieces')?.setValue(values);
    this.validateForm.get('pieces')?.markAsDirty();
    this.validateForm.get('pieces')?.updateValueAndValidity();
  }

  add_style(values: number[]) {
    this.selectedStyles = values;
    this.validateForm.get('styles')?.setValue(values);
    this.validateForm.get('styles')?.markAsDirty();
    this.validateForm.get('styles')?.updateValueAndValidity();
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


  fileSizeError = false;
  maxFileSize = 10 * 1024 * 1024; // 10 MB in bytes
   file_cover_image: string="";
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
      this.file_cover_image =  uniqueFileName;
    
      // Mettre à jour la valeur de l'input
      this.validateForm.patchValue({
        cover_image: uniqueFileName
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

  submitForm(): void {
    console.log(this.file_list)

    const titre = this.validateForm.controls['titre'].value;
    const type = this.validateForm.controls['type'].value;
    const description = this.validateForm.controls['description'].value;
    const cover_image = this.validateForm.controls['cover_image'].value;
    const pieces = this.validateForm.controls['pieces'].value;
    const styles = this.validateForm.controls['styles'].value;

    const images = this.file_list.map(file => {
        const timestamp = Date.now();
        const uniqueFileName = this.slugify(`${timestamp}_${file.name}`) ;
        // Vérifier si originFileObj est défini
      if (file.originFileObj) {
        // Convertir NzUploadFile en Blob
        const blob = file.originFileObj as Blob;
        // Créer un File avec le blob
        const renamedFile = new File([blob], uniqueFileName, { type: blob.type });

        // Envoyer le fichier au serveur
        const formData = new FormData();
        formData.append('file', renamedFile);

        this.userService.upload_file(formData).subscribe(response => {
          console.log('Fichier téléchargé avec succès:', response);
          // Maintenant, vous avez le chemin d'accès au fichier sur le serveur, que vous pouvez stocker dans votre base de données.
        });
      } else {
        console.error('originFileObj est undefined pour le fichier :', file);
        // Gérer le cas où originFileObj est undefined selon vos besoins
      }
      const imageTitre = file.name.replace(/\.[^/.]+$/, ""); // Extrait le titre sans extension

      return { Titre: imageTitre, Url: uniqueFileName };
    });

    // Construction de l'objet JSON final
    const galerieJson = {
      Titre: titre,
      Type: type,
      Description: description,
      cover_image: cover_image,
      pieces,
      styles,
      Images: images
    };

    console.log('JSON à envoyer au serveur :', galerieJson);

    
    this.userService.add_galerie_with_images(galerieJson).subscribe(
      (response) => {
        console.log('galerie ajoutée avec succès :', response);
        this.msg.create('success', `galerie ajoutée avec succès`);
            this.router.navigate(['/administration/galeries']);
      },
      (error) => {
        console.error('Erreur lors de l\'ajout de la galerie :', error);
      }
    );
    
  }
    
  beforeUpload = (file: NzUploadFile): boolean => {
    let size =file.size?file.size:0
    const isLt2M = size / 1024 / 1024 < 10;
    if (!isLt2M) {
      this.msg.error('File must be smaller than 2MB!');
    }
    return isLt2M;
  }
  
  handleChange({ file, fileList }: NzUploadChangeParam): void {
    const status = file.status;
    
    if (status == 'removed') {
      this.msg.success(`${file.name} file deleted successfully.`);
      
      this.file_list = this.file_list.filter(item => item.uid !== file.uid);

    } 
    else if (status !== 'uploading') {
      this.msg.success(`${file.name} file uploaded successfully.`);
      this.file_list.push(file)

    } 
   
  }



  styles:Style[] = [];
  loadStyle(): void {
    this.userService.getStyles()
      .subscribe((data: Style[]) => {
        this.styles = data;
        console.log("réponse de la requette get_styles",this.styles);
      });
  }


  pieces:Piece[] = [];
  loadPieces(): void {
    this.userService.getPieces()
      .subscribe((data: Piece[]) => {
        this.pieces = data;
        console.log("réponse de la requette get_categories_piece",this.pieces);
      });
      
  }

  
}
