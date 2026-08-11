import { Component } from '@angular/core';
import { FormArray, FormGroup, NonNullableFormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiConceptsEtTravauxService } from '../../../../Services/api-concepts-et-travaux.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CalculDevisService } from '../../../../Services/calcul-devis.service';
import { DevisTache } from '../../../../Models/DevisTache';
import { forkJoin } from 'rxjs';


@Component({
  selector: 'app-remplacement-radiateur-calcul',
  templateUrl: './remplacement-radiateur-calcul.component.html',
  styleUrl: './remplacement-radiateur-calcul.component.css'
})
export class RemplacementRadiateurCalculComponent {
 tacheId:string =  this.route.snapshot.paramMap.get('id')??'0';
  element:any
  donnees:any
  formulaire!: FormGroup;
  devisTache!:DevisTache;
  detailsCalcul:any
  edit_mode=false
  prix_coutant_mode=false

   constructor(private calculDevisService:CalculDevisService,private fb: NonNullableFormBuilder,private route: ActivatedRoute,private userService: ApiConceptsEtTravauxService,private message: NzMessageService, private router: Router) {
    }

    ngOnInit(): void {
      this.route.queryParams.subscribe(params => {
        const mode = params['mode'];
        if (mode === 'modification') {
          // Mode modification activé
          console.log('On est en mode modification');
          this.edit_mode=true
        } else if (mode === 'prix_coutant') {
          // Mode prix_coutant activé
          console.log('On est en mode prix_coutant');
          this.prix_coutant_mode=true
        }
        else {
          // Mode création/test
          console.log('On est en mode test');
        }
      });
      this.route.params.subscribe(params => {
        this.tacheId = params['id'] ?? '0';
        console.log('Tache ID récupéré:', this.tacheId);
      });
      this.getDetails(parseInt(this.tacheId, 10))
      this.load_gammes()
      this.load_types()
      this.load_parametres()
    }
  getDetails(id: number): void {
    this.userService.get_devis_tache(id ).subscribe(
      (response) => {
        this.devisTache=response
        this.element =response
        this.donnees = JSON.parse(response.Donnees) 
        this.formulaire = this.fb.group({
          gamme_radiateurs_form: this.fb.array(
            this.donnees["gammes-produits-pose-chauffage"].radiateurs.map((radiateur: any) => {
              return this.fb.group({
                gamme: [radiateur.gamme],
                visible: [radiateur.visible],
                artisan_pose:[radiateur.artisan_pose],
                fournisseur_pose:[radiateur.fournisseur_pose],
              
              });
            })
          ),
          type_radiateurs_form: this.fb.array(
            this.donnees["etat-surfaces-pose-chauffage"].radiateurs.map((radiateur: any) => {
              return this.fb.group({
                type: [radiateur.type],
                artisan_type:[radiateur.artisan_type],
                fournisseur_type:[radiateur.fournisseur_type],
              
              });
            })
          ),
          hauteur: [this.donnees["dimensions-pose-chauffage"].hauteur || 0],
          surface: [this.donnees["dimensions-pose-chauffage"].surface || 0]
        });
        
        

        this.load_artisans_fournisseurs()

         
        if (this.prix_coutant_mode) {
          this.modifier()
        }
        
       // this.validateForm.patchValue(response);
        console.log("donnees ",this.donnees);
      },
      (error) => {
        console.error('Erreur lors de la recuperation des details  :', error);
      }
    );
    
  }

  
  get gamme_radiateurs_form() {
    return this.formulaire.get('gamme_radiateurs_form') as FormArray;
  }
  get type_radiateurs_form() {
    return this.formulaire.get('type_radiateurs_form') as FormArray;
  }

  gammes_radiateurs:any
  load_gammes(){
    this.userService.getEquipementsByType("gamme-de-radiateur").subscribe(
    (response: any) => {
      console.log('recuperation des getEquipementsByType radiateur:', response[0].Modeles);
      this.gammes_radiateurs=response[0].Modeles
    },
    (error: any) => {
      console.error('Erreur lors de la recuperation des getEquipementsByType radiateur :', error);
    }
  );
  }

  types:any
  load_types(){
    this.userService.getGammesByTravailAndType(12,"type-de-radiateur").subscribe(
      (response: any) => {
        console.log('recuperation des gammes type-de-radiateur:', response);
        this.types=response
      },
      (error: any) => {
        console.error('Erreur lors de la recuperation des gammes type-de-radiateur :', error);
      }
    );
    
  }

 coefficient = 0
  load_parametres(){
    
    this.userService.get_parametre_by_id_or_nom(1,"coefficient")
      .subscribe(
        (data) => {
          this.coefficient=data.Valeur;
        },
        (error) => {
          console.error('Erreur lors de la recupération des parametres', error);
        }
      );
  }

artisans_pose:any[] = []
fournisseurs_pose:any[] = []

artisans_type:any[] = []
fournisseurs_type:any[] = []

all_artisans:any = []
one_artisan_for_all=0
all_fournisseurs:any = []
one_fournisseur_for_all=0




load_artisans_fournisseurs() {

  const requests: any[] = [];

  // Pose
  this.donnees["gammes-produits-pose-chauffage"].radiateurs.forEach((radiateur: any) => {

    const gamme_id = parseInt(radiateur.gamme.split(":")[0]);

    requests.push(
      this.userService.getArtisansFournisseursModelesByReference(
        gamme_id,
        'artisan'
      )
    );

    requests.push(
      this.userService.getArtisansFournisseursModelesByReference(
        gamme_id,
        'fournisseur'
      )
    );

  });

  // Type
  this.donnees["etat-surfaces-pose-chauffage"].radiateurs.forEach((radiateur: any) => {

    const type_id = parseInt(radiateur.type.split(":")[0]);

    requests.push(
      this.userService.getArtisansFournisseursElementsByGammeReference(
        type_id,
        'artisan'
      )
    );

    requests.push(
      this.userService.getArtisansFournisseursElementsByGammeReference(
        type_id,
        'fournisseur'
      )
    );

  });

  forkJoin(requests).subscribe({

    next: (responses: any[]) => {

      let index = 0;

      this.artisans_pose = [];
      this.fournisseurs_pose = [];
      this.artisans_type = [];
      this.fournisseurs_type = [];

      // Pose
      this.donnees["gammes-produits-pose-chauffage"].radiateurs.forEach((r: any, i: number) => {

        this.artisans_pose[i] = responses[index++];
        this.fournisseurs_pose[i] = responses[index++];

      });

      // Type
      this.donnees["etat-surfaces-pose-chauffage"].radiateurs.forEach((r: any, i: number) => {

        this.artisans_type[i] = responses[index++];
        this.fournisseurs_type[i] = responses[index++];

      });

      // Artisans distincts
      this.all_artisans = [
        ...new Map(
          [
            ...this.artisans_pose.flat().map((x: any) => x.Artisan),
            ...this.artisans_type.flat().map((x: any) => x.Artisan)
          ].map((a: any) => [a.Id, a])
        ).values()
      ];

      // Fournisseurs distincts
      this.all_fournisseurs = [
        ...new Map(
          [
            ...this.fournisseurs_pose.flat().map((x: any) => x.Fournisseur),
            ...this.fournisseurs_type.flat().map((x: any) => x.Fournisseur)
          ].map((f: any) => [f.Id, f])
        ).values()
      ];

      console.log('total artisans_pose:', this.artisans_pose);
      console.log('total fournisseurs_pose:', this.fournisseurs_pose);
      console.log('total artisans_type:', this.artisans_type);
      console.log('total fournisseurs_type:', this.fournisseurs_type);

      console.log('all_artisans:', this.all_artisans);
      console.log('all_fournisseurs:', this.all_fournisseurs);

    },

    error: err => {
      console.error(err);
    }

  });

}




onArtisanForAllChange(artisanId: number): void {

  this.selectArtisanFormArray(
    artisanId,
    this.artisans_type,
    this.type_radiateurs_form,
    'artisan_type'
  );

  this.selectArtisanFormArray(
    artisanId,
    this.artisans_pose,
    this.gamme_radiateurs_form,
    'artisan_pose', 
  );


}


onFournisseurForAllChange(fournisseurId: number): void {

  this.selectFournisseurFormArray(
    fournisseurId,
    this.fournisseurs_pose,
    this.type_radiateurs_form,
    'fournisseur_type'
  );

}


private selectFournisseurFormArray(
  fournisseurId: number,
  optionsArray: any[][],
  formArray: any,
  controlName: string
): void {

  optionsArray.forEach((options, index) => {

    const option = options.find(
      (o:any) => o.Fournisseur?.Id === fournisseurId
    );

    if (!option) {
      return;
    }

    const label = option.Label ?? option.Titre;

    formArray.at(index)
      .get(controlName)
      ?.setValue(
        `${option.ID}:${option.Prix}:${label}`
      );

  });

}



private selectArtisanFormArray(
  artisanId: number,
  optionsArray: any[][],
  formArray: any,
  controlName: string,
  separator: string = ':'
): void {



  optionsArray.forEach((options, index) => {

    const option = options.find(
      (o:any) => o.Artisan?.Id === artisanId
    );

    if (!option) {
      return;
    }

    const label = option.Label ?? option.Titre;

    formArray.at(index)
      .get(controlName)
      ?.setValue(
        `${option.ID}${separator}${option.Prix}${separator}${label}`
      );

  });

}




submit() {
  console.log(this.formulaire.value);

  const gamme_radiateurs = this.formulaire.value.gamme_radiateurs_form;
  const type_radiateurs = this.formulaire.value.type_radiateurs_form;
  const hauteur = this.formulaire.value.hauteur;
  const surface = this.formulaire.value.surface;

  this.devisTache.Donnees = {
    "nomtache":this.devisTache.TravailSlug,
      "idtache":this.devisTache.TravailID,
    "gammes-produits-pose-chauffage": {
      radiateurs: gamme_radiateurs
    },
    "etat-surfaces-pose-chauffage": {
      radiateurs: type_radiateurs
    },
    "dimensions-pose-chauffage": {
      hauteur: hauteur,
      surface: surface
    }
  };

  console.log("donnees", this.devisTache);

  this.calculDevisService.calculer_prix_tache(this.devisTache).then((result) => {
    this.detailsCalcul = result;

    let formule = this.detailsCalcul.resultats[this.element.TravailSlug]?.formule;
    if (formule) {
      formule = formule.replace(/\n/g, '<br>');
      this.detailsCalcul.resultats[this.element.TravailSlug] = {
        ...this.detailsCalcul.resultats[this.element.TravailSlug],
        formule: formule
      };
    }
    let formule_marge = this.detailsCalcul.resultats[this.element.TravailSlug]?.formule_marge;
    if (formule_marge) {
      formule_marge = formule_marge.replace(/\n/g, '<br>');

      // On réinjecte la formule_marge modifiée dans l'objet
      this.detailsCalcul.resultats[this.element.TravailSlug] = {
        ...this.detailsCalcul.resultats[this.element.TravailSlug],
        formule_marge: formule_marge
      };
    }

    console.log("Prix reçu :", this.detailsCalcul);

  }).catch((error) => {
    console.error("Erreur lors du calcul :", error);
  });
}


modifier(){
  
  const gamme_radiateurs = this.formulaire.value.gamme_radiateurs_form;
  const type_radiateurs = this.formulaire.value.type_radiateurs_form;
  const hauteur = this.formulaire.value.hauteur;
  const surface = this.formulaire.value.surface;

  this.devisTache.Donnees = {
     "nomtache":this.devisTache.TravailSlug,
      "idtache":this.devisTache.TravailID,
    "gammes-produits-pose-chauffage": {
      radiateurs: gamme_radiateurs
    },
    "etat-surfaces-pose-chauffage": {
      radiateurs: type_radiateurs
    },
    "dimensions-pose-chauffage": {
      hauteur: hauteur,
      surface: surface
    }
  };

  console.log("Données avant modification", this.devisTache);

  this.calculDevisService.calculer_prix_tache(this.devisTache).then((result) => {
    this.detailsCalcul = result;
    let formule = this.detailsCalcul.resultats[this.element.TravailSlug]?.formule;
    if (formule) {
      formule = formule.replace(/\n/g, '<br>');
      this.detailsCalcul.resultats[this.element.TravailSlug] = {
        ...this.detailsCalcul.resultats[this.element.TravailSlug],
        formule: formule
      };
    }
    let formule_marge = this.detailsCalcul.resultats[this.element.TravailSlug]?.formule_marge;
    if (formule_marge) {
      formule_marge = formule_marge.replace(/\n/g, '<br>');

      // On réinjecte la formule_marge modifiée dans l'objet
      this.detailsCalcul.resultats[this.element.TravailSlug] = {
        ...this.detailsCalcul.resultats[this.element.TravailSlug],
        formule_marge: formule_marge
      };
    }
    const prixCalcule = (this.detailsCalcul?.resultats?.[this.element.TravailSlug]?.prix/1.25);
    console.log("Prix calculé", this.element.TravailSlug, prixCalcule);

    if (prixCalcule !== undefined) {
      this.devisTache.Prix = prixCalcule;
    }

    console.log("Données après modification", this.devisTache);

    this.userService.updateDevistache(parseInt(this.tacheId),this.devisTache).subscribe(
      (response) => {
        console.log('Tache modifiée avec succès :', response);
        this.message.create('success', `Tache modifiée avec succès`);
        if(!this.prix_coutant_mode){
          setTimeout(() => {
            this.router.navigate(['/administration/devis-pieces', 'modifier-devis-piece', this.devisTache.DevisPieceID]);
          }, 2000);
        }
        
      },
      (error) => {
        console.error('Erreur lors de la modification de la tache :', error);
      }
    );
  }).catch(error => {
    console.error('Erreur lors du calcul du prix:', error);
  });
}


  get_prix_debourse(i:number,type:string){
    let prix = 0
    switch (type) {
      case 'gamme':
        prix = parseFloat(this.donnees["gammes-produits-pose-chauffage"].radiateurs[i].gamme.split(':')[1]);
        break;
      case 'type':
        prix = parseFloat(this.donnees["etat-surfaces-pose-chauffage"].radiateurs[i].type.split(':')[1]);
        break;
    
      default:
        break;
    }
    return `${prix} €`
  }


  get_prix_vente(i:number,type:string){
    let prix = 0
    switch (type) {
      case 'gamme':
        prix = parseFloat(this.donnees["gammes-produits-pose-chauffage"].radiateurs[i].gamme.split(':')[1]);
        break;
      case 'type':
        prix = parseFloat(this.donnees["etat-surfaces-pose-chauffage"].radiateurs[i].type.split(':')[1]);
        break;
    
      default:
        break;
    }
    prix*=this.coefficient
    return `${prix} €`
  }

  get_prix_coutant(i:number,type:string){
    let prix = 0
    switch (type) {
      case 'gamme':
        prix += parseFloat(this.donnees["gammes-produits-pose-chauffage"].radiateurs[i].fournisseur_pose?.split(':')[1] || '0')
        prix += parseFloat(this.donnees["gammes-produits-pose-chauffage"].radiateurs[i].artisan_pose?.split(':')[1] || '0')
        break;
      case 'type':
        prix += parseFloat(this.donnees["etat-surfaces-pose-chauffage"].radiateurs[i].fournisseur_type?.split(':')[1] || '0')
        prix += parseFloat(this.donnees["etat-surfaces-pose-chauffage"].radiateurs[i].artisan_type?.split(':')[1] || '0')
        break;
    
      default:
        break;
    }
    return `${prix} €`
  }

  get_client_choice_label(i:number,type:string){
    let label = ''
    switch (type) {
      case 'type':
        label = this.donnees["etat-surfaces-pose-chauffage"].radiateurs[i].type?.split(':')[2] 
        break;
      case 'gamme':
        label = this.donnees["gammes-produits-pose-chauffage"].radiateurs[i].gamme?.split(':')[2]
        break;
    
      default:
        break;
    }
    return `"${label}"`
  }

  get_dimensions(){
    let label = '1  <br>'
   
    label += `hauteur : ${this.donnees["dimensions-pose-chauffage"].hauteur} cm <br>` 
    label += `surface : ${this.donnees["dimensions-pose-chauffage"].surface } m² <br>`
       
    
    return label
  }

}
