import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { ApiConceptsEtTravauxService } from '../../../../Services/api-concepts-et-travaux.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ajouter-galerie',
  templateUrl: './ajouter-galerie.component.html',
  styleUrls: ['./ajouter-galerie.component.css']
})
export class AjouterGalerieComponent {
  validateForm: FormGroup;
  file_list: NzUploadFile[] = []; // Tableau pour stocker les fichiers sélectionnés

  constructor(private fb: FormBuilder,private msg:NzMessageService, private router: Router,private userService: ApiConceptsEtTravauxService) {
    this.validateForm = this.fb.group({
      titre: ['', [Validators.required]],
      images: [null, Validators.required] // Contrôle pour les fichiers, requis
    });
  }

  submitForm(): void {
    console.log(this.file_list)

    const titre = this.validateForm.controls['titre'].value;

    const images = this.file_list.map(file => {
        const timestamp = Date.now();
        const uniqueFileName = `${timestamp}_${file.name}`;
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
}
