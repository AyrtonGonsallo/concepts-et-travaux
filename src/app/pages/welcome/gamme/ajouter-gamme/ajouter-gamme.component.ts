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
interface TravailItem {
  id: number;
  texte: string;
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
    Etape: FormControl<string>;
    PrixFournisseur: FormControl<number>;
    PrixPose: FormControl<number>;
    Prix: FormControl<number>;
    PrixMultiples: FormArray;
    TravailID: FormControl<number>;
    ActiverFournisseur: FormControl<boolean>;
    ActiverPrixMultiples: FormControl<boolean>;
    FournisseurID: FormControl<number>;
    GammeDeReferenceID: FormControl<number>;
  }>;
  
  radioValue=""
types: Type[] = [
    // Divers
    { group: 'Divers', slug: 'cloison-demolition-complete', label: 'Type de cloison demolition complete' },
    { group: 'Divers', slug: 'cloison-ouverture-partielle', label: 'Type de cloison ouverture partielle' },
    { group: 'Divers', slug: 'gamme-appareils', label: 'Gamme d\'appareils (rénovation partielle)' },
    
    // Murs
    { group: 'Murs', slug: 'bois', label: 'Bois' },
    { group: 'Murs', slug: 'carrelage-mur', label: 'Carrelage mural' },
    { group: 'Murs', slug: 'enduit-decoratif-mur', label: 'Enduit décoratif mur' },
    { group: 'Murs', slug: 'etat-des-surfaces-murs', label: 'État des surfaces (murs)' },
    { group: 'Murs', slug: 'papier-peint-mur', label: 'Papier peint mur' },
    { group: 'Murs', slug: 'peinture-mur', label: 'Peinture murale' },
    { group: 'Murs', slug: 'tissus-mur', label: 'Tissus muraux' },
    
    // Plafond
    { group: 'Plafond', slug: 'carrelage-plafond', label: 'Carrelage plafond' },
    { group: 'Plafond', slug: 'enduit-decoratif-plafond', label: 'Enduit décoratif plafond' },
    { group: 'Plafond', slug: 'etat-des-surfaces-plafond', label: 'État des surfaces (plafond)' },
    { group: 'Plafond', slug: 'papier-peint-plafond', label: 'Papier peint plafond' },
    { group: 'Plafond', slug: 'peinture-plafond', label: 'Peinture plafond' },
    
    // Porte
    { group: 'Porte', slug: 'gamme-de-porte', label: 'Gamme de porte' },
    { group: 'Porte', slug: 'nature-porte', label: 'Nature de la porte' },
    { group: 'Porte', slug: 'type-de-cloison-murs-non-porteurs', label: 'Type de cloison (mur non porteur)' },
    { group: 'Porte', slug: 'type-de-porte-coulissante', label: 'Type de porte coulissante' },
    { group: 'Porte', slug: 'type-de-porte-double', label: 'Type de porte double' },
    { group: 'Porte', slug: 'type-de-porte-creation-murs-non-porteurs_ep_10', label: 'Type de porte épaisseur 10 cm' },
    { group: 'Porte', slug: 'type-de-porte-creation-murs-non-porteurs_ep_10+', label: 'Type de porte épaisseur > 10 cm' },
    { group: 'Porte', slug: 'type-de-porte-creation-murs-non-porteurs_ep_5', label: 'Type de porte épaisseur 5 cm' },
    { group: 'Porte', slug: 'type-de-porte-creation-murs-non-porteurs_ep_7', label: 'Type de porte épaisseur 7 cm' },
    { group: 'Porte', slug: 'type-de-porte-simple', label: 'Type de porte simple' },
    
    // Radiateur
    { group: 'Radiateur', slug: 'gamme-de-radiateur', label: 'Gamme de Radiateur' },
    { group: 'Radiateur', slug: 'type-de-radiateur', label: 'Type de radiateur' },
    
  
    // Services
    { group: 'Services', slug: 'service-creation-mur-non-porteur', label: 'Service création de mur non porteur' },
    { group: 'Services', slug: 'service-demolition-murs', label: 'Service de démolition de murs' },
    { group: 'Services', slug: 'service-depose-cuisine', label: 'Service de dépose d\'element de cuisine' },
    { group: 'Services', slug: 'service-depose-murs', label: 'Service de dépose murs' },
    { group: 'Services', slug: 'service-depose-revetement-plafond', label: 'Service de dépose revêtements plafond' },
    { group: 'Services', slug: 'service-depose-revetement-sol', label: 'Service de dépose revêtements sol' },
    { group: 'Services', slug: 'service-depose-salle-de-bain-salle-d-eau', label: 'Service de dépose d\'éléments de salle de bain / eau' },
    { group: 'Services', slug: 'service-ouverture-partielle', label: 'Service ouverture partielle' },
    { group: 'Services', slug: 'service-renovation-electrique-complete', label: 'Service rénovation électrique complète' },
    
    // Sols
    { group: 'Sols', slug: 'carrelage-sol', label: 'Carrelage' },
    { group: 'Sols', slug: 'etat-des-surfaces-sol', label: 'État des surfaces' },
    { group: 'Sols', slug: 'moquette-de-sol', label: 'Moquette' },
    { group: 'Sols', slug: 'papier-massif-sol', label: 'Parquet Massif' },
    { group: 'Sols', slug: 'parquet-flottant-sol', label: 'Parquet Flottant' },
    { group: 'Sols', slug: 'peinture-de-sol', label: 'Peinture de sol' },
    { group: 'Sols', slug: 'plinthes-bois-sol', label: 'Plinthes bois' },
    { group: 'Sols', slug: 'plinthes-carrelage-sol', label: 'Plinthes carrelage' },
    { group: 'Sols', slug: 'resine-decorative-de-sol', label: 'Résine décorative' },
    { group: 'Sols', slug: 'sol-souple', label: 'Sol souple' },
].sort((a, b) => {
    // Trier d'abord par group
    const groupCompare = a.group.localeCompare(b.group, 'fr', { sensitivity: 'base' });
    if (groupCompare !== 0) {
        return groupCompare;
    }
    // Puis par label alphabétique
    return a.label.localeCompare(b.label, 'fr', { sensitivity: 'base' });
});

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
      Etape: ['', [Validators.required]],
      PrixPose: [0, [Validators.required]],
      PrixFournisseur: [0, [Validators.required]],
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
    this.validateForm.get('PrixFournisseur')!.valueChanges.subscribe(() => {
      this.updatePrixTotal();
    });
    this.validateForm.get('PrixPose')!.valueChanges.subscribe(() => {
      this.updatePrixTotal();
    });
      this.validateForm.get('TravailID')!.valueChanges.subscribe((value: number) => {
      this.doubleSearch(value);
    });
  }

  updatePrixTotal(): void {
    const fournisseur = this.validateForm.get('PrixFournisseur')!.value || 0;
    const pose = this.validateForm.get('PrixPose')!.value || 0;
    this.validateForm.get('Prix')!.setValue(fournisseur + pose, { emitEvent: false });
  }

  
loadtravaux(){
  this.userService.getActiveTravaux()
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


 filteredList: string[] = [];
 
listeComplete: TravailItem[] = [
  // ID 2 - Trié alphabétiquement
  { id: 2, texte: "Étape 1 - Dépose d'anciennes installations" },
  //{ id: 2, texte: "Étape 3 - Choix des équipements de cuisine" },
  
  // ID 3 - Trié alphabétiquement
  { id: 3, texte: "Étape 1 - Démolition complète de murs non porteurs" },
  { id: 3, texte: "Étape 1 - Démolition partielle de murs non porteurs" },
  
  // ID 4
  { id: 4, texte: "Étape 1 - Création des portes" },
  { id: 4, texte: "Étape 1 - Création des murs" },
  
  // ID 5 - Trié alphabétiquement
  { id: 5, texte: "Étape 1 - Revêtements existants" },
  { id: 5, texte: "Étape 2 - État des surfaces" },
  { id: 5, texte: "Étape 3 - Choix du nouveau revêtement" },
  
  // ID 8 - Trié alphabétiquement
  { id: 8, texte: "Étape 1 - Revêtements existants" },
  { id: 8, texte: "Étape 2 - État des surfaces" },
  { id: 8, texte: "Étape 3 - Choix du nouveau revêtement" },
  
  // ID 9 - Trié alphabétiquement
  { id: 9, texte: "Étape 1 - Revêtements à retirer" },
  { id: 9, texte: "Étape 2 - État des surfaces" },
  { id: 9, texte: "Étape 3 - Choix du nouveau revêtement" },
  
  // ID 10 - Trié alphabétiquement
  { id: 10, texte: "Étape 3 - Porte coulissante (de 70 à 90)" },
  { id: 10, texte: "Étape 3 - Porte double (de 100 à 140)" },
  { id: 10, texte: "Étape 3 - Porte simple (dimensions de 70 à 90)" },
  
  // ID 12 - Trié alphabétiquement
  { id: 12, texte: "Étape 2 - Choix du type de radiateur" },
  { id: 12, texte: "Étape 3 - Choix de la gamme de radiateur" },
  
  // ID 13 - Trié alphabétiquement
 // { id: 13, texte: "Étape 3 - Appareillage à créer" },
 // { id: 13, texte: "Étape 3 - Appareillage à remplacer" },
  { id: 13, texte: "Étape 3 - Prix des appareils" },
  
  // ID 15 - Trié alphabétiquement
  { id: 15, texte: "Étape 3 - Chauffage" },
  { id: 15, texte: "Étape 3 - Mise aux normes" },
  { id: 15, texte: "Étape 3 - Mise en sécurité" },
  
  // ID 16 - Trié alphabétiquement
  { id: 16, texte: "Étape 1 - Dépose d'anciennes installations" },
 // { id: 16, texte: "Étape 3 - Pose de nouveaux équipements sanitaires" }
];

  doubleSearch(travailId?: number): void  {

    const filteredTravailID = travailId !== undefined ? travailId : (this.validateForm.get('TravailID')?.value || 0);

    console.log("filteredTravailID",filteredTravailID)
    
    // Filtrer selon l'ID
    if (filteredTravailID === 1) {
      // ID = 1 : afficher toute la liste
      this.filteredList = this.listeComplete.map(item => item.texte);
    } else {
      // Filtrer par ID spécifique
      this.filteredList = this.listeComplete
        .filter(item => item.id === filteredTravailID)
        .map(item => item.texte);
    }

  }
  
}