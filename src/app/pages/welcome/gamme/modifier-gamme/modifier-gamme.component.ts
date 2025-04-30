import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { Travail } from '../../../../Models/Travail';
import { ApiConceptsEtTravauxService } from '../../../../Services/api-concepts-et-travaux.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
export interface Type {
  slug: string;
  label: string;
}

@Component({
  selector: 'app-modifier-gamme',
  templateUrl: './modifier-gamme.component.html',
  styleUrl: './modifier-gamme.component.css'
})
export class ModifierGammeComponent {
  gammeId:string =  this.route.snapshot.paramMap.get('id')??'0';
  validateForm: FormGroup<{
    Type: FormControl<string>;
    Label: FormControl<string>;
    Image: FormControl<string>;
    Pdf: FormControl<string>;
    Prix: FormControl<number>;
     PrixMultiples: FormArray;
    TravailID: FormControl<number>;
  }>;
  types: Type[] = [
    { slug: 'peinture', label: 'Peinture (murs)' },
    { slug: 'enduit-decoratif', label: 'Enduit decoratif (murs)' },
    { slug: 'papier-peint', label: 'Papier peint (murs)' },
    { slug: 'bois', label: 'Bois (murs)' },
    { slug: 'tissus', label: 'Tissus (murs)' },
    { slug: 'carrelage', label: 'Carrelage (murs)' },
    { slug: 'peinture-de-sol', label: 'Peinture de sol' },
    { slug: 'moquette-de-sol', label: 'Moquette (sol)' },
    { slug: 'sol-souple', label: 'Sol souple (sol)' },
    { slug: 'resine-decorative-de-sol', label: 'Résine décorative (sol)' },
    { slug: 'carrelage-sol', label: 'Carrelage (sol)' },
    { slug: 'papier-massif-sol', label: 'Parquet Massif (sol)' },
    { slug: 'parquet-flottant-sol', label: 'Parquet Flottant (sol)' },
    { slug: 'plinthes-carrelage-sol', label: 'Plinthes carrelage (sol)' },
    { slug: 'plinthes-bois-sol', label: 'Plinthes bois (sol)' },
    { slug: 'depose', label: 'Dépose' },
    { slug: 'cloison', label: 'Cloison' },
    { slug: 'materiaux', label: 'Matériau' },
    { slug: 'type-de-porte-simple', label: 'Type de porte simple' },
    { slug: 'type-de-porte-double', label: 'Type de porte double' },
    { slug: 'type-de-porte-coulissante', label: 'Type de porte coulissante' },
    { slug: 'gamme-de-porte', label: 'Gamme de porte' },
    { slug: 'nature-porte', label: 'Nature de la porte' },
    { slug: 'renovation-electrique-partielle', label: 'Rénovation électrique partielle (Appareillage)' },
    { slug: 'renovation-electrique-complete', label: 'Rénovation électrique complete' },
    { slug: 'radiateur', label: 'Radiateur' },
    { slug: 'type-de-porte-creation-murs-non-porteurs_ep_5', label: 'Type de porte pour épaisseur = 5 (cmnp)' },
    { slug: 'type-de-porte-creation-murs-non-porteurs_ep_7', label: 'Type de porte pour épaisseur = 7 (cmnp)' },
    { slug: 'type-de-porte-creation-murs-non-porteurs_ep_10', label: 'Type de porte pour épaisseur = 10 (cmnp)' },
    { slug: 'type-de-porte-creation-murs-non-porteurs_ep_10+', label: 'Type de porte pour épaisseur > 10 (cmnp)' },
    { slug: 'type-de-cloison-murs-non-porteurs', label: 'Type de cloison (cmnp)' },
    { slug: 'depose-murs', label: 'Dépose de murs' },
    { slug: 'depose-salle-de-bain-salle-d-eau', label: 'Dépose d\'élements de salle de bain/salle d\'eau' },
    { slug: 'depose-cuisine', label: 'Dépose d\'élements de cuisine' },
    { slug: 'depose-revetement-plafond', label: 'Dépose de revetements pour plafond' },
    { slug: 'depose-revetement-sol', label: 'Dépose de revetements pour sol' },
    { slug: 'type-de-radiateur', label: 'Type de radiateur' },
    { slug: 'etat-des-surfaces-murs', label: 'État des surfaces (murs)' },
    { slug: 'etat-des-surfaces-plafond', label: 'État des surfaces (plafond)' },
    { slug: 'etat-des-surfaces-sol', label: 'État des surfaces (sol)' },
    
  ];
  travaux:Travail[]=[]
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
      Type: ['', [Validators.required]],
      Label: ['', [Validators.required]],
      Image: ['', []],
      Pdf: ['', []],
      Prix: [0, [Validators.required]],
      PrixMultiples:  this.fb.array([]),
      TravailID: [0, [Validators.required]],
      
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
    this.getDetails(parseInt(this.gammeId) )
  }
  loadtravaux(){
    this.userService.getTravaux()
        .subscribe((data: Travail[]) => {
          this.travaux = data;
          console.log("réponse de la requette get_travaux",this.travaux);
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
}