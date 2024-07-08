import { Component } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiConceptsEtTravauxService } from '../../../../Services/api-concepts-et-travaux.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Piece } from '../../../../Models/Piece';
import { NzSelectSizeType } from 'ng-zorro-antd/select';
interface FormValues {
  Titre?: string;    
    Description?: string;
    Image?: string;
    PieceID?: number; // Le point d'interrogation indique que la propriété est facultative
}

@Component({
  selector: 'app-modifier-equipement',
  templateUrl: './modifier-equipement.component.html',
  styleUrl: './modifier-equipement.component.css'
})
export class ModifierEquipementComponent {
  validateForm: FormGroup<{
    Titre: FormControl<string>;
    Description: FormControl<string>;
    Image: FormControl<string>;
    PieceID: FormControl<number>;
  }>;
  fileSizeError = false;
  maxFileSize = 10 * 1024 * 1024; // 10 MB in bytes
  file_Image: string="";
 
  size: NzSelectSizeType = 'default';
  equipementId:string =  this.route.snapshot.paramMap.get('id')??'0';
  submitForm(): void {
    if (this.validateForm.valid) {
      const formValues: FormValues = { ...this.validateForm.value };
     
      console.log('submit', formValues);
      this.userService.updateEquipement(parseInt(this.equipementId) ,formValues).subscribe(
        (response) => {
          console.log("réponse de la requette update equipement",response);
          this.message.create('success', `pièce mise a jour avec succès`);
          this.router.navigate(['/administration/equipements']);

        },
        (error) => {
          console.error('Erreur lors de la mise a jour :', error);
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
      this.file_Image =  uniqueFileName;
    
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
    this.loadPieces();
    this.getDetails(this.equipementId)
  }
  pieces: Piece[] = [];
  loadPieces(): void {
    this.userService.getPieces().subscribe(
      (response) => {
        this.pieces = response;
        console.log("réponse de la requette get_pieces",this.pieces);
      },
      (error) => {
        console.error('Erreur lors de la recuperation des pieces :', error);
      }
    );
  }
// Méthode pour récupérer les détails de l'utilisateur à partir de l'API
getDetails(id: string): void {
  this.userService.getEquipement( parseInt(id, 10)).subscribe(
    (response) => {
      console.log("réponse de la requette get piece details",response);
      this.validateForm.patchValue(response);
      
      
      
      
    },
    (error) => {
      console.error('Erreur lors de la recuperation des details piece :', error);
    }
  );
  
}
  constructor(private route: ActivatedRoute,private fb: NonNullableFormBuilder,private router: Router,private message: NzMessageService,private userService: ApiConceptsEtTravauxService) {
    this.validateForm = this.fb.group({
      Titre: ['', [ Validators.required]],
    Description: ['', [ Validators.required]],
    Image: ['', [ ]],
    PieceID:  [0, [ ]],
    });
  }
}