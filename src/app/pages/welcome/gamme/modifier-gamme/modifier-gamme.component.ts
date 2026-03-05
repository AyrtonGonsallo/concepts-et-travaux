import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { Travail } from '../../../../Models/Travail';
import { ApiConceptsEtTravauxService } from '../../../../Services/api-concepts-et-travaux.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Utilisateur } from '../../../../Models/Utilisateurs';
import { environment } from '../../../../environments/environment';
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
  selector: 'app-modifier-gamme',
  templateUrl: './modifier-gamme.component.html',
  styleUrl: './modifier-gamme.component.css'
})
export class ModifierGammeComponent {
   apiUrl = environment.imagesUrl;
  gammeId:string =  this.route.snapshot.paramMap.get('id')??'0';
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
    PrixMultiples: FormArray;
    TravailID: FormControl<number>;
    ActiverFournisseur: FormControl<boolean>;
    ActiverPrixMultiples: FormControl<boolean>;
    FournisseurID: FormControl<number>;
    GammeDeReferenceID: FormControl<number>;
  }>;
  
  types: Type[] = [
      // Divers
      { etape_id:1, travail_id:3, slug: 'cloison-demolition-complete', label: 'Type de cloison demolition complete' },
      { etape_id:1, travail_id:3,  slug: 'cloison-ouverture-partielle', label: 'Type de cloison ouverture partielle' },
      //{ etape_id:3, travail_id:13,  slug: 'gamme-appareils', label: 'Rénovation électrique partielle (gamme d\'appareils)' },
      
      // Murs
      { etape_id:3, travail_id:5, slug: 'bois', label: 'Bois' },
      { etape_id:3, travail_id:5, slug: 'carrelage-mur', label: 'Carrelage mural' },
      { etape_id:3, travail_id:5, slug: 'enduit-decoratif-mur', label: 'Enduit décoratif mur' },
      { etape_id:2, travail_id:5, slug: 'etat-des-surfaces-murs', label: 'État des surfaces (murs)' },
      { etape_id:3, travail_id:5, slug: 'papier-peint-mur', label: 'Papier peint mur' },
      { etape_id:3, travail_id:5, slug: 'peinture-mur', label: 'Peinture murale' },
      { etape_id:3, travail_id:5, slug: 'tissus-mur', label: 'Tissus muraux' },
      
      // Plafond
      { etape_id:3, travail_id:8, slug: 'carrelage-plafond', label: 'Carrelage plafond' },
      { etape_id:3, travail_id:8, slug: 'enduit-decoratif-plafond', label: 'Enduit décoratif plafond' },
      { etape_id:2, travail_id:8, slug: 'etat-des-surfaces-plafond', label: 'État des surfaces (plafond)' },
      { etape_id:3, travail_id:8, slug: 'papier-peint-plafond', label: 'Papier peint plafond' },
      { etape_id:3, travail_id:8, slug: 'peinture-plafond', label: 'Peinture plafond' },
      
      // Porte
      { etape_id:3, travail_id:10,  slug: 'gamme-de-porte', label: 'Gamme de porte' },
      { etape_id:3, travail_id:10,  slug: 'nature-porte', label: 'Nature de la porte' },
      //{ etape_id:1, travail_id:4,  slug: 'type-de-cloison-murs-non-porteurs', label: 'Type de cloison (mur non porteur)' },
      { etape_id:3, travail_id:10,  slug: 'type-de-porte-coulissante', label: 'Type de porte coulissante' },
      { etape_id:3, travail_id:10,  slug: 'type-de-porte-double', label: 'Type de porte double' },
      { etape_id:3, travail_id:10,  slug: 'type-de-porte-simple', label: 'Type de porte simple' },
      
     
      // Services
      { etape_id:1, travail_id:4,  slug: 'epaisseur-creation-mur-non-porteur', label: 'Épaisseur de mur non porteur' },
     // { etape_id:1, travail_id:4,  slug: 'service-demolition-murs', label: 'Démolition de murs non porteurs' },
      //{ etape_id:1, travail_id:2, slug: 'service-depose-cuisine', label: 'Dépose d\'element de cuisine' },
      { etape_id:1, travail_id:5,  slug: 'service-depose-murs', label: 'Dépose de revêtements muraux' },
      { etape_id:1, travail_id:8, slug: 'service-depose-revetement-plafond', label: 'Dépose revêtements plafond' },
      { etape_id:1, travail_id:9, slug: 'service-depose-revetement-sol', label: 'Dépose revêtements sol' },
      //{ etape_id:1, travail_id:16, slug: 'service-depose-salle-de-bain-salle-d-eau', label: 'Dépose d\'éléments de salle de bain / eau' },
      //{ etape_id:1, travail_id:3,  slug: 'service-ouverture-partielle', label: 'Ouverture partielle' },
      //{ etape_id:1, travail_id:15,  slug: 'service-renovation-electrique-complete', label: 'Rénovation électrique complète' },
      
      // Sols
      { etape_id:3, travail_id:9, slug: 'carrelage-sol', label: 'Carrelage' },
      { etape_id:2, travail_id:9, slug: 'etat-des-surfaces-sol', label: 'État des surfaces' },
      { etape_id:3, travail_id:9, slug: 'moquette-de-sol', label: 'Moquette' },
      { etape_id:3, travail_id:9, slug: 'papier-massif-sol', label: 'Parquet Massif' },
      { etape_id:3, travail_id:9, slug: 'parquet-flottant-sol', label: 'Parquet Flottant' },
      { etape_id:3, travail_id:9, slug: 'peinture-de-sol', label: 'Peinture de sol' },
      { etape_id:3, travail_id:9, slug: 'plinthes-bois-sol', label: 'Plinthes bois' },
      { etape_id:3, travail_id:9, slug: 'plinthes-carrelage-sol', label: 'Plinthes carrelage' },
      { etape_id:3, travail_id:9, slug: 'resine-decorative-de-sol', label: 'Résine décorative' },
      { etape_id:3, travail_id:9, slug: 'sol-souple', label: 'Sol souple' },
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
  
    console.log(this.filteredItems);
  }


  travaux:Travail[]=[]
  fournisseurs:Utilisateur[]=[]
  submitForm(): void {
    if (this.validateForm.valid) {
      
      console.log('submit', this.validateForm.value);
      this.userService.updateGamme(parseInt(this.gammeId),this.validateForm.value).subscribe(
        (response: any) => {
          console.log('gamme modifiée avec succès :', response);
          this.message.create('success', `gamme modifiée avec succès`);
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
  activerFournisseur(){
    return this.validateForm.value.ActiverFournisseur==true
  }

  activerPrixMultiples(){
    return this.validateForm.value.ActiverPrixMultiples==true
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


  constructor(private route:ActivatedRoute,private fb: NonNullableFormBuilder,private userService: ApiConceptsEtTravauxService,private message: NzMessageService, private router: Router) {
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
      PrixMultiples:  this.fb.array([]),
      TravailID: [0, [Validators.required]],
      ActiverFournisseur:  [false, []],
      ActiverPrixMultiples:  [false, []],
      FournisseurID: [0, []],
      GammeDeReferenceID: [0, []],
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
    this.getDetails(parseInt(this.gammeId) )

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
    this.userService.getActiveTravauxSansEquipements()
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
  getDetails(id: number): void {
    this.userService.getGammeById(id).subscribe(
      (response) => {
        console.log(response)
        let pm=JSON.parse(response.PrixMultiples)
        console.log("pm: ",pm)
        response.PrixMultiples=null
        this.validateForm.patchValue(response);
        const typeSlug = response.Type; // supposé contenir le slug du type
        const typeObj = this.types.find(t => t.slug === typeSlug);

      this.onselectTravailorEtapeChange()

        // Filtrer par ID spécifique
        this.filteredList = this.listeComplete
          .filter(item => item.id === response.TravailID)
          .map(item => item.texte);

        if (pm && Array.isArray(pm)) {
          
          const appareilsArray = this.validateForm.get('PrixMultiples') as FormArray;
          pm.forEach((appareil: any) => {
            const appareilForm = this.fb.group({
              nom: [appareil.nom || '', Validators.required],  // Nom de l'appareil
              prix: [appareil.prix || 0, Validators.required]   // Prix de l'appareil
            });
            appareilsArray.push(appareilForm);
          });
        }
        

        console.log("réponse de la requette getdetails",response);
      },
      (error) => {
        console.error('Erreur lors de la recuperation des details  :', error);
      }
    );
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

  doubleSearch(travailId?: number): void {
  // Utiliser la valeur passée en paramètre ou lire depuis le formulaire
  const filteredTravailID = travailId !== undefined ? travailId : (this.validateForm.get('TravailID')?.value || 0);
    
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