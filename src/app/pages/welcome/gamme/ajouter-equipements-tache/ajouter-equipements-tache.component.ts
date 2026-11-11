import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { ApiConceptsEtTravauxService } from '../../../../Services/api-concepts-et-travaux.service';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Travail } from '../../../../Models/Travail';
import { Utilisateur } from '../../../../Models/Utilisateurs';
import { Equipement } from '../../../../Models/Equipement';
import { Gamme } from '../../../../Models/Gamme';
export interface Type {
  slug: string;
  label: string;
   travail_id:number;
   etape_id:number;
}
interface TravailItem {
  id: number;
  texte: string;
}

@Component({
  selector: 'app-ajouter-equipements-tache',
  templateUrl: './ajouter-equipements-tache.component.html',
  styleUrl: './ajouter-equipements-tache.component.css'
})
export class AjouterEquipementsTacheComponent {
validateForm: FormGroup<{
    current_group: FormControl<string>;
    Type: FormControl<string>;
    Label: FormControl<string>;
    Image: FormControl<string>;
    Pdf: FormControl<string>;
    Etape: FormControl<string>;
    PrixFournisseur: FormControl<number>;
    PrixPose: FormControl<number>;
    Prix: FormControl<number>;
    Ordre: FormControl<number>;
    PrixMultiples: FormArray;
    TravailID: FormControl<number>;
    ActiverFournisseur: FormControl<boolean>;
    ActiverArtisan: FormControl<boolean>;
    ActiverPrixMultiples: FormControl<boolean>;
    FournisseurID: FormControl<number>;
    ArtisanID: FormControl<number>;
    GammeDeReferenceID: FormControl<number>;
  }>;
  current_group=""
  
  radioValue=""
types: Type[] = [
    // Divers
    { etape_id:3, travail_id:13,  slug: 'gamme-appareils', label: 'Rénovation électrique partielle (gamme d\'appareils)' },
    { etape_id:1, travail_id:2, slug: 'service-depose-cuisine', label: 'Dépose d\'element de cuisine' },
    { etape_id:1, travail_id:16, slug: 'service-depose-salle-de-bain-salle-d-eau', label: 'Dépose d\'éléments de salle de bain / eau' },
    { etape_id:1, travail_id:3,  slug: 'service-ouverture-partielle', label: 'Ouverture partielle' },
    { etape_id:1, travail_id:15,  slug: 'service-renovation-electrique-complete', label: 'Rénovation électrique complète' },
    
].sort((a, b) => {
    // Puis par label alphabétique
    return a.label.localeCompare(b.label, 'fr', { sensitivity: 'base' });
});


selectedTravail: number|undefined ;
selectedEtape: number |undefined ;
get_etape_id( etapelabel:string):number{
  const match = etapelabel.match(/\d+/);
  return match ? parseInt(match[0], 10):1;
}
filteredItems: any[] = [];

onselectTravailorEtapeChange() {
  this.selectedTravail = this.validateForm.get('TravailID')?.value;
  this.selectedEtape = this.get_etape_id(this.validateForm.get('Etape')?.value??'');

  this.filteredItems = this.types.filter(item => {
    return (
      (!this.selectedTravail || item.travail_id === this.selectedTravail) &&
      (!this.selectedEtape || item.etape_id === this.selectedEtape)
    );
  });

  this.listOfDisplayGammeDeRef =  this.equipements_gammes_de_ref.filter(item => {
    return (
      (!this.selectedTravail || item.TravailID === this.selectedTravail) 
    );
  });

  console.log(this.filteredItems);
}

  travaux:Travail[]=[]
  fournisseurs:Utilisateur[]=[]
  artisans:Utilisateur[]=[]


  submitForm(): void {
    if (this.validateForm.valid) {

      //faire la somme si prix mulkiples
      if (this.activerPrixMultiples()) {
        // 1. Lire les valeurs (rawValue pour inclure les champs disabled)
        const pm: any[] = this.validateForm.getRawValue().PrixMultiples || [];

        // 2. Calculer le total
        const total = pm.reduce((sum: number, item: any) => sum + (Number(item.prix) || 0), 0);

        console.log("pm:", pm);
        console.log("total pm:", total);

        // 3. Patcher le formulaire (pas validateForm.value !)
        const patch: any = {};

        if (this.activerFournisseur()) {
          patch.Prix = total;
          patch.PrixFournisseur = total;
        }

        if (this.activerArtisan()) {
          patch.Prix = total;
          patch.PrixPose = total;
        }

        if (Object.keys(patch).length > 0) {
          this.validateForm.patchValue(patch);
        }
      }
      const payload = this.validateForm.getRawValue(); 
      console.log('submit', payload);
      

      
      this.userService.addGamme(payload).subscribe(
        (response: any) => {
          console.log('gamme ajoutée avec succès :', response);
          this.message.create('success', `gamme ajoutée avec succès`);
          this.router.navigate(['/administration/equipements-taches']);
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

  activerArtisan(){
    return this.validateForm.value.ActiverArtisan==true
  }

  activerPrixMultiples(){
    return this.validateForm.value.ActiverPrixMultiples==true
  }

  constructor(private fb: NonNullableFormBuilder,private userService: ApiConceptsEtTravauxService,private message: NzMessageService, private router: Router) {
    this.validateForm = this.fb.group({
      current_group: ['', []],
      Type: ['', [Validators.required]],
      Label: ['', [Validators.required]],
      Image: ['', []],
      Pdf: ['', []],
      Etape: ['', [Validators.required]],
      PrixPose: [0, [Validators.required]],
      PrixFournisseur: [0, [Validators.required]],
      Prix: [0, [Validators.required]],
      Ordre: [0, []],
      TravailID: [0, [Validators.required]],
      ActiverFournisseur:  [false, []],
      ActiverArtisan:  [false, []],
      ActiverPrixMultiples:  [false, []],
      FournisseurID: [0, []],
      ArtisanID: [0, []],
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
    this.loadEquipements()
    this.loadArtisans()
    this.loadGammesDeRef()
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


  equipements:Equipement[] = [];
  loadEquipements(): void {
  this.userService.getEquipementsByType('electrique-a-remplacer')
    .subscribe((data: Equipement[]) => {
      this.equipements = data;
      console.log("réponse de la requête get_categories_equipement", this.equipements);
      this.populatePrixMultiples();
    });
}

populatePrixMultiples(): void {
  // Vider le FormArray existant
  this.appareils.clear();

  // Ajouter un formGroup pour chaque équipement
  this.equipements.forEach((equipement) => {
    const appareilForm = this.fb.group({
      nom: [{ value: equipement.Titre, disabled: true }, Validators.required], // en lecture seule
      prix: [0, Validators.required]
    });
    this.appareils.push(appareilForm);
  });
}

  
loadtravaux(){
  this.userService.getActiveTravauxAvecEquipements()
      .subscribe((data: Travail[]) => {
        this.travaux = data;
        console.log("réponse de la requette get_travaux",this.travaux);
      });
}


  loadFournisseurs(){
    this.userService.getUsersByRole(15)
        .subscribe((data: Utilisateur[]) => {
          this.fournisseurs = data;
          console.log("réponse de la requette loadFournisseurs",this.fournisseurs);
        });
  }


  loadArtisans(){
    this.userService.getUsersByRole(17)
        .subscribe((data: Utilisateur[]) => {
          this.artisans = data;
          console.log("réponse de la requette loadartisans",this.artisans);
        });
  }


  equipements_gammes_de_ref:Gamme[] = [];
  listOfDisplayGammeDeRef:Gamme[] = [];
  loadGammesDeRef(): Promise<void> {
      return new Promise((resolve, reject) => {
        this.userService.getEquipementGammesDeRef().subscribe({
          next: (data2: Gamme[]) => {
            this.equipements_gammes_de_ref = data2;
            this.listOfDisplayGammeDeRef = [...this.equipements_gammes_de_ref];
            console.log("réponse de la requête getEquipementGammesDEREF", this.equipements_gammes_de_ref);
            resolve();
          },
          error: (err) => reject(err)
        });
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
  { id: 10, texte: "Étape 3 - Nature de la porte" },
  { id: 10, texte: "Étape 3 - Gamme de la porte" },
  
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