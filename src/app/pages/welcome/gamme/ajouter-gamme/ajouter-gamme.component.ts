import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { ApiConceptsEtTravauxService } from '../../../../Services/api-concepts-et-travaux.service';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Travail } from '../../../../Models/Travail';
import { Utilisateur } from '../../../../Models/Utilisateurs';
export interface Type {
  slug: string;
  label: string;
   group: string;
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
    PrixMultiples: FormArray;
    TravailID: FormControl<number>;
    ActiverFournisseur: FormControl<boolean>;
    ActiverPrixMultiples: FormControl<boolean>;
    FournisseurID: FormControl<number>;
    GammeDeReferenceID: FormControl<number>;
  }>;
  
  
types: Type[] = [
    { group: 'Murs', slug: 'bois', label: 'Bois' },
    { group: 'Murs',slug: 'carrelage', label: 'Carrelage mural' },
    { group: 'Murs',slug: 'enduit-decoratif', label: 'Enduit decoratif' },
    { group: 'Murs',slug: 'etat-des-surfaces-murs', label: 'État des surfaces' },
    { group: 'Murs',slug: 'papier-peint', label: 'Papier peint' },
    { group: 'Murs',slug: 'peinture', label: 'Peinture murale' },
    { group: 'Murs',slug: 'tissus', label: 'Tissus muraux' },
    
    { group: 'Sols',slug: 'carrelage-sol', label: 'Carrelage' },
    { group: 'Sols',slug: 'etat-des-surfaces-sol', label: 'État des surfaces' },
    { group: 'Sols',slug: 'moquette-de-sol', label: 'Moquette' },
    { group: 'Sols',slug: 'parquet-flottant-sol', label: 'Parquet Flottant' },
    { group: 'Sols',slug: 'papier-massif-sol', label: 'Parquet Massif' },
    { group: 'Sols',slug: 'peinture-de-sol', label: 'Peinture de sol' },
    { group: 'Sols',slug: 'plinthes-carrelage-sol', label: 'Plinthes carrelage' },
    { group: 'Sols',slug: 'plinthes-bois-sol', label: 'Plinthes bois' },
    { group: 'Sols',slug: 'resine-decorative-de-sol', label: 'Résine décorative' },
    { group: 'Sols',slug: 'sol-souple', label: 'Sol souple' },
    
    { group: 'Porte',slug: 'gamme-de-porte', label: 'Gamme de porte' },
    { group: 'Porte',slug: 'nature-porte', label: 'Nature de la porte' },
    { group: 'Porte',slug: 'type-de-porte-coulissante', label: 'Type de porte coulissante' },
    { group: 'Porte',slug: 'type-de-porte-double', label: 'Type de porte double' },
    { group: 'Porte',slug: 'type-de-porte-simple', label: 'Type de porte simple' },
    
    { group: 'Porte',slug: 'type-de-porte-creation-murs-non-porteurs_ep_5', label: 'Type de porte pour épaisseur = 5 (cmnp)' },
    { group: 'Porte',slug: 'type-de-porte-creation-murs-non-porteurs_ep_7', label: 'Type de porte pour épaisseur = 7 (cmnp)' },
    { group: 'Porte',slug: 'type-de-porte-creation-murs-non-porteurs_ep_10', label: 'Type de porte pour épaisseur = 10 (cmnp)' },
    { group: 'Porte',slug: 'type-de-porte-creation-murs-non-porteurs_ep_10+', label: 'Type de porte pour épaisseur > 10 (cmnp)' },
    { group: 'Porte',slug: 'type-de-cloison-murs-non-porteurs', label: 'Type de cloison (cmnp)' },
    
    
    { group: 'Divers',slug: 'cloison', label: 'Cloison' },
    { group: 'Divers',slug: 'depose', label: 'Dépose' },
    { group: 'Divers',slug: 'materiaux', label: 'Matériau' },
    { group: 'Divers',slug: 'depose-murs', label: 'Dépose de murs' },
    { group: 'Divers',slug: 'depose-salle-de-bain-salle-d-eau', label: 'Dépose d\'élements de salle de bain/salle d\'eau' },
    { group: 'Divers',slug: 'depose-cuisine', label: 'Dépose d\'élements de cuisine' },
    { group: 'Divers',slug: 'depose-revetement-plafond', label: 'Dépose de revetements pour plafond' },
    { group: 'Divers',slug: 'depose-revetement-sol', label: 'Dépose de revetements pour sol' },
  
    { group: 'Renovation electrique partielle',slug: 'renovation-electrique-partielle', label: 'Rénovation électrique partielle (Appareillage)' },
    { group: 'Renovation electrique complete',slug: 'renovation-electrique-complete', label: 'Rénovation électrique complete' },
   

    { group: 'Radiateur',slug: 'radiateur', label: 'Radiateur' },
    { group: 'Radiateur',slug: 'type-de-radiateur', label: 'Type de radiateur' },

    { group: 'Plafond',slug: 'etat-des-surfaces-plafond', label: 'État des surfaces (plafond)' },

    
  ];

  groupedTypes = this.types.reduce((acc, type) => {
    if (!acc[type.group]) {
      acc[type.group] = [];
    }
    acc[type.group].push(type);
    return acc;
  }, {} as { [key: string]: Type[] });

groupedTypeKeys(): string[] {
  return Object.keys(this.groupedTypes);
}

  travaux:Travail[]=[]
  fournisseurs:Utilisateur[]=[]
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
  activerFournisseur(){
    return this.validateForm.value.ActiverFournisseur==true
  }

  activerPrixMultiples(){
    return this.validateForm.value.ActiverPrixMultiples==true
  }

  constructor(private fb: NonNullableFormBuilder,private userService: ApiConceptsEtTravauxService,private message: NzMessageService, private router: Router) {
    this.validateForm = this.fb.group({
      Type: ['', [Validators.required]],
      Label: ['', [Validators.required]],
      Image: ['', []],
      Pdf: ['', []],
      Prix: [0, [Validators.required]],
      TravailID: [0, [Validators.required]],
      ActiverFournisseur:  [false, []],
      ActiverPrixMultiples:  [false, []],
      FournisseurID: [0, []],
      GammeDeReferenceID: [0, []],
      PrixMultiples:  this.fb.array([])
      
    });
  }

  // Accès facile au FormArray PrixMultiples
  get appareils(): FormArray {
    return this.validateForm.get('PrixMultiples') as FormArray;
  }

  // Ajouter un nouvel appareil avec prix
  addAppareil(): void {
    const appareilForm = this.fb.group({
      nom: ['', Validators.required],  // Nom de l'appareil
      prix: [0, Validators.required]   // Prix de l'appareil
    });
    this.appareils.push(appareilForm);
  }

  // Supprimer un appareil
  removeAppareil(index: number): void {
    this.appareils.removeAt(index);
  }
  ngOnInit(): void {
    this.loadtravaux()
    this.loadFournisseurs()
  }
loadtravaux(){
  this.userService.getTravaux()
      .subscribe((data: Travail[]) => {
        this.travaux = data;
        console.log("réponse de la requette get_travaux",this.travaux);
      });
}
loadFournisseurs(){
    this.userService.getUsersByRole(14)
        .subscribe((data: Utilisateur[]) => {
          this.fournisseurs = data;
          console.log("réponse de la requette loadFournisseurs",this.fournisseurs);
        });
  }

 
  
}