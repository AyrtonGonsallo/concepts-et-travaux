import { Component } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { ApiConceptsEtTravauxService } from '../../../../Services/api-concepts-et-travaux.service';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Travail } from '../../../../Models/Travail';
export interface Type {
  slug: string;
  label: string;
}

@Component({
  selector: 'app-ajouter-gamme',
  templateUrl: './ajouter-gamme.component.html',
  styleUrl: './ajouter-gamme.component.css'
})
export class AjouterGammeComponent {
  validateForm: FormGroup<{
    Type: FormControl<string>;
    Label: FormControl<string>;
    Image: FormControl<string>;
    Pdf: FormControl<string>;
    Prix: FormControl<number>;
    TravailID: FormControl<number>;
  }>;
  types: Type[] = [
    { slug: 'peinture', label: 'Peinture (murs)' },
    { slug: 'enduit-decoratif', label: 'Enduit decoratif (murs)' },
    { slug: 'papier-peint', label: 'Papier peint (murs)' },
    { slug: 'bois', label: 'Bois (murs)' },
    { slug: 'tissus', label: 'Tissus (murs)' },
    { slug: 'carrelage', label: 'Carrelage (murs)' },
    { slug: 'papier-massif', label: 'Parquet Massif (sol)' },
    { slug: 'parquet-flottant-finition-bois', label: 'Parquet Flottant Finition Bois (sol)' },
    { slug: 'parquet-flottant-finition-stratifiee', label: 'Parquet Flottant Finition Stratifiée (sol)' },
    { slug: 'sol-pvc', label: 'Sol PVC (sol)' },
    { slug: 'moquette', label: 'Moquette (sol)' },
    { slug: 'plinthes-carrelage', label: 'Plinthes carrelage' },
    { slug: 'plinthes-bois', label: 'Plinthes bois' },
    { slug: 'depose', label: 'Dépose' },
    { slug: 'cloison', label: 'Cloison' },
    { slug: 'materiaux', label: 'Matériau' },
    { slug: 'type-de-porte', label: 'Type de porte' },
    { slug: 'gamme-de-porte', label: 'Gamme de porte' },
    { slug: 'nature-porte', label: 'Nature de la porte' },
    { slug: 'renovation-electrique-complete', label: 'Rénovation électrique complete' },
    { slug: 'radiateur', label: 'Radiateur' },
    { slug: 'type-de-porte-creation-murs-non-porteurs', label: 'Type de porte (cmnp)' },
    { slug: 'type-de-cloison-murs-non-porteurs', label: 'Type de cloison (cmnp)' },
    { slug: 'depose-murs', label: 'Dépose de murs' },
    { slug: 'depose-salle-de-bain-salle-d-eau', label: 'Dépose d\'élements de salle de bain/salle d\'eau' },
    { slug: 'depose-cuisine', label: 'Dépose d\'élements de cuisine' },
    { slug: 'depose-revetement-plafond', label: 'Dépose de revetements pour plafond' },
    { slug: 'depose-revetement-sol', label: 'Dépose de revetements pour sol' },
    { slug: 'type-de-radiateur', label: 'Type de radiateur' },
  ];
  travaux:Travail[]=[]
  submitForm(): void {
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);
      this.userService.addGamme(this.validateForm.value).subscribe(
        (response: any) => {
          console.log('gamme ajoutée avec succès :', response);
          this.message.create('success', `gamme ajoutée avec succès`);
          this.router.navigate(['/administration/gammes']);
        },
        (error: any) => {
          console.error('Erreur lors de l\'ajout de la gamme :', error);
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

  file_Image: string="";
  maxFileSize = 10 * 1024 * 1024; // 10 MB in bytes
  fileSizeError = false;
  handleFileInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const file: File = (inputElement.files as FileList)[0];
    if (file.size > this.maxFileSize) {
      this.fileSizeError = true;
      // Clear the input field to prevent further processing of the large file
      inputElement.value = '';
      
    }else{
      const timestamp = Date.now();
      const uniqueFileName = this.slugify( `${timestamp}_${file.name}`);
      this.file_Image = uniqueFileName;
    
      // Mettre à jour la valeur de l'input
      // Mettre à jour la valeur du champ 'QuestionnaireTarif' dans le formulaire
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

  handleFileInput2(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const file: File = (inputElement.files as FileList)[0];
    if (file.size > this.maxFileSize) {
      this.fileSizeError = true;
      // Clear the input field to prevent further processing of the large file
      inputElement.value = '';
      
    }else{
      const timestamp = Date.now();
      const uniqueFileName = this.slugify( `${timestamp}_${file.name}`);
      this.file_Image = uniqueFileName;
    
      // Mettre à jour la valeur de l'input
      // Mettre à jour la valeur du champ 'QuestionnaireTarif' dans le formulaire
      this.validateForm.patchValue({
        Pdf: uniqueFileName
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


  constructor(private fb: NonNullableFormBuilder,private userService: ApiConceptsEtTravauxService,private message: NzMessageService, private router: Router) {
    this.validateForm = this.fb.group({
      Type: ['', [Validators.required]],
      Label: ['', [Validators.required]],
      Image: ['', []],
      Pdf: ['', []],
      Prix: [0, [Validators.required]],
      TravailID: [0, [Validators.required]],
      
    });
  }

 
  ngOnInit(): void {
    this.loadtravaux()
  }
loadtravaux(){
  this.userService.getTravaux()
      .subscribe((data: Travail[]) => {
        this.travaux = data;
        console.log("réponse de la requette get_travaux",this.travaux);
      });
}
  
}