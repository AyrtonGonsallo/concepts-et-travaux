import { Component } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiConceptsEtTravauxService } from '../../../../Services/api-concepts-et-travaux.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { BesoinProjet } from '../../../../Models/Besoin-Projet';
import { Piece } from '../../../../Models/Piece';
import { Galerie } from '../../../../Models/Galerie';
import { EtapeProjet } from '../../../../Models/Etape-Projet';
import { NzSelectSizeType } from 'ng-zorro-antd/select';
import { Pointcle } from '../../../../Models/PointCle';
import { environment } from '../../../../environments/environment';
interface FormValues {
  Titre?: string;
  Superficie?: number;
  Prix?: number;
  Image_principale?: string;
  Description?: string;
  Duree?: number;
  Top?: boolean;
  GalerieID?: number; // Le point d'interrogation indique que la propriété est facultative
  PieceID?: number;
  Besoins?: any [];
   Etapes?: any [];
   Pointcles?: any [];
}

@Component({
  selector: 'app-modifier-realisation',
  templateUrl: './modifier-realisation.component.html',
  styleUrl: './modifier-realisation.component.css'
})
export class ModifierRealisationComponent {
  url_images=environment.imagesUrl
  validateForm: FormGroup<{
    Titre: FormControl<string>;
    SousTitre: FormControl<string>;
    Description: FormControl<string>;
    Image_principale: FormControl<string>;
    GalerieID: FormControl<number>;
    PieceID: FormControl<number>;
    Top: FormControl<boolean>;
    Duree: FormControl<number>;

    Prix: FormControl<number>;
    Superficie: FormControl<number>;



  }>;
  fileSizeError = false;
  maxFileSize = 10 * 1024 * 1024; // 10 MB in bytes
  file_Image_principale: string="";
  size: NzSelectSizeType = 'default';
  multipleValue1 : number[] = [];
  multipleValue2 : number[] = [];
  multipleValue3 : number[] = [];
  submitForm(): void {
    if (this.validateForm.valid) {
      const formValues: FormValues = { ...this.validateForm.value };
      formValues.Besoins = this.multipleValue1;
      formValues.Etapes = this.multipleValue2;
      formValues.Pointcles = this.multipleValue3;
      console.log('submit', formValues);

      this.userService.update_realisation( parseInt(this.realisationId),formValues).subscribe(
        (response) => {
          console.log("réponse de la requette update realisation",response);
          this.message.create('success', `réalisation mise a jour avec succès`);
          this.router.navigate(['/administration/realisations']);
        },
        (error) => {
          console.error('Erreur lors de la mise a jour des realisations :', error);
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
      this.file_Image_principale =  uniqueFileName;
    
      // Mettre à jour la valeur de l'input
      this.validateForm.patchValue({
        Image_principale: uniqueFileName
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
  realisationId:string =  this.route.snapshot.paramMap.get('id')??'0';
  ngOnInit(): void {
    this.loadGaleries();
    this.loadPieces()
    this.loadBesoin()
    this.loadEtapes()
    this.loadPointscles()
    this.getRealisationDetails(this.realisationId)
  }
  galeries: Galerie[] = [];
  pieces: Piece[] = [];
  besoins: BesoinProjet[] = [];
  etapes: EtapeProjet[] = [];
  loadGaleries(): void {
    this.userService.get_galeries().subscribe(
      (response) => {
        this.galeries = response;
        console.log("réponse de la requette get_galeries",this.galeries);
      },
      (error) => {
        console.error('Erreur lors de la recuperation des galeries :', error);
      }
    );
  }

  loadPieces(): void {
    this.userService.getPieces().subscribe(
      (response) => {
        this.pieces = response;
        console.log("réponse de la requette getPieces",this.pieces);
      },
      (error) => {
        console.error('Erreur lors de la recuperation des pieces :', error);
      }
    );
  }
  loadBesoin(): void {
    this.userService.getBesoinsProjet().subscribe(
      (response) => {
        this.besoins= response;
        console.log("réponse de la requette get besoins",this.besoins);
      },
      (error) => {
        console.error('Erreur lors de la recuperation des besoins :', error);
      }
    );
  }
  loadEtapes(): void {
    this.userService.getEtapesProjet().subscribe(
      (response) => {
        this.etapes= response;
        console.log("réponse de la requette get etapes",this.etapes);
      },
      (error) => {
        console.error('Erreur lors de la recuperation des etapes :', error);
      }
    );
  }
  pointscles: Pointcle[] = [];
  loadPointscles(): void {
    this.userService.getPointscles().subscribe(
      (response) => {
        this.pointscles= response;
        console.log("réponse de la requette get pointscles",this.pointscles);
      },
      (error) => {
        console.error('Erreur lors de la recuperation des pointscles :', error);
      }
    );
  }

  constructor(private fb: NonNullableFormBuilder,private route: ActivatedRoute,private router: Router,private message: NzMessageService,private userService: ApiConceptsEtTravauxService) {
    this.validateForm = this.fb.group({
      Titre: ['', [ Validators.required]],
      SousTitre: ['', [ ]],
      Description: ['', [ Validators.required]],
      Image_principale: ['', [ Validators.required]],
      GalerieID:  [0, [ Validators.required]],
      PieceID:  [0, [ Validators.required]],
      Duree:  [0, [ Validators.required]],
      Top:  [false, [ Validators.required]],
      Prix:  [0, [ Validators.required]],
      Superficie:  [0, [ Validators.required]],
    });
  }

  // Méthode pour récupérer les détails de l'utilisateur à partir de l'API
  getRealisationDetails(id: string): void {
    this.userService.getRealisation( parseInt(id, 10)).subscribe(
      (response) => {
        console.log("réponse de la requette get realisation details",response);
        this.validateForm.patchValue(response);
        
        response.BesoinProjets.forEach((besoin: any) => {
          // Ajouter l'ID de l'besoin à multipleValue
          this.multipleValue1.push(besoin.ID);
        });
        response.EtapeProjets.forEach((etape: any) => {
          // Ajouter l'ID de l'etape à multipleValue
          this.multipleValue2.push(etape.ID);
        });
        response.Pointcles.forEach((etape: any) => {
          // Ajouter l'ID de l'etape à multipleValue
          this.multipleValue3.push(etape.ID);
        });
        
      },
      (error) => {
        console.error('Erreur lors de la recuperation des details realisation :', error);
      }
    );
    
  }
}