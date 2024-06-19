import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { ApiConceptsEtTravauxService } from '../../../../Services/api-concepts-et-travaux.service';
import { Galerie } from '../../../../Models/Galerie';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-modifier-galerie',
  templateUrl: './modifier-galerie.component.html',
  styleUrl: './modifier-galerie.component.css'
})
export class ModifierGalerieComponent {
  validateForm: FormGroup;
  url_images=environment.apiUrl
  file_list: NzUploadFile[] = []; // Tableau pour stocker les fichiers sélectionnés
  size: NzButtonSize = 'large';
  constructor(private fb: FormBuilder,private route: ActivatedRoute,private msg:NzMessageService, private router: Router,private userService: ApiConceptsEtTravauxService) {
    this.validateForm = this.fb.group({
      titre: ['', [Validators.required]],
      images: [null, Validators.required] // Contrôle pour les fichiers, requis
    });
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


  submitForm(): void {
    console.log(this.file_list)


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
      Images: images
    };

    console.log('JSON à envoyer au serveur :', galerieJson);
    this.userService.add_images_to_galerie(this.galerie.ID,galerieJson).subscribe(
      (response) => {
        console.log('galerie ajoutée avec succès :', response);
        this.msg.create('success', `images ajoutées avec succès`);
        this.getGalerieDetails(this.galerieId);
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

  // Méthode pour marquer tous les contrôles du formulaire comme dirty
  private markFormControlsAsDirty(): void {
    Object.values(this.validateForm.controls).forEach(control => {
      control.markAsDirty();
      control.updateValueAndValidity({ onlySelf: true });
    });
  }
  galerie:any
  galerieId:string =  this.route.snapshot.paramMap.get('id')??'0';
  ngOnInit(): void {
    this.getGalerieDetails(this.galerieId);
  }
  // Méthode pour récupérer les détails de l'utilisateur à partir de l'API
  getGalerieDetails(userId: string): void {
    this.userService.get_galerie( parseInt(userId, 10)).subscribe(
      (response) => {
        
        this.validateForm.patchValue(response);
        this.galerie=response
        console.log("réponse de la requette get_galerie",this.galerie);
      },
      (error) => {
        console.error('Erreur lors de la recuperation des details get_galerie :', error);
      }
    );
    
  }

  delete_image_from_gallery(id:number){
    this.userService.deleteImageFromGallery(id).subscribe(
      (response) => {
        this.getGalerieDetails(this.galerieId);
        console.log("réponse de la requette get_galerie",response);
      },
      (error) => {
        console.error('Erreur lors de la recuperation des details get_galerie :', error);
      }
    );
  }
}
