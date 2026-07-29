import { Component } from '@angular/core';
import { FormArray, FormGroup, NonNullableFormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiConceptsEtTravauxService } from '../../../../Services/api-concepts-et-travaux.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CalculDevisService } from '../../../../Services/calcul-devis.service';
import { DevisTache } from '../../../../Models/DevisTache';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-remplacement-de-portes-calcul',
  templateUrl: './remplacement-de-portes-calcul.component.html',
  styleUrl: './remplacement-de-portes-calcul.component.css'
})
export class RemplacementDePortesCalculComponent {
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
        } else {
          // Mode création/test
          console.log('On est en mode test');
        }if (mode === 'modification') {
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
    }

    getDetails(id: number): void {
      this.userService.get_devis_tache(id ).subscribe(
        (response) => {
          this.devisTache=response
          this.element =response
          this.donnees = JSON.parse(response.Donnees) 
          this.formulaire = this.fb.group({
            portes: this.fb.array(
              this.donnees["gammes-produits-pose-portes"].portes.map((porte: any, i: number) => {
                return this.fb.group({
                  gamme: this.donnees["gammes-produits-pose-portes"].portes[i].gamme,
                  nature_porte: this.donnees["gammes-produits-pose-portes"].portes[i].nature_porte,
                  type_porte: this.donnees["gammes-produits-pose-portes"].portes[i].type_porte,
                  artisan_pose:(this.donnees["gammes-produits-pose-portes"].portes[i].artisan_pose)?this.donnees["gammes-produits-pose-portes"].portes[i].artisan_pose:"",
                  fournisseur_pose:(this.donnees["gammes-produits-pose-portes"].portes[i].fournisseur_pose)?this.donnees["gammes-produits-pose-portes"].portes[i].fournisseur_pose:"",
              
                  artisan_nature:(this.donnees["gammes-produits-pose-portes"].portes[i].artisan_nature)?this.donnees["gammes-produits-pose-portes"].portes[i].artisan_nature:"",
                  fournisseur_nature:(this.donnees["gammes-produits-pose-portes"].portes[i].fournisseur_nature)?this.donnees["gammes-produits-pose-portes"].portes[i].fournisseur_nature:"",
              
                  artisan_type:(this.donnees["gammes-produits-pose-portes"].portes[i].artisan_type)?this.donnees["gammes-produits-pose-portes"].portes[i].artisan_type:"",
                  fournisseur_type:(this.donnees["gammes-produits-pose-portes"].portes[i].fournisseur_type)?this.donnees["gammes-produits-pose-portes"].portes[i].fournisseur_type:"",
              
                });
              })
            )
          });


          this.load_artisans_fournisseurs()
         // this.validateForm.patchValue(response);
          console.log("donnees ",this.donnees);
        },
        (error) => {
          console.error('Erreur lors de la recuperation des details  :', error);
        }
      );
      
    }


    get portes() {
      return this.formulaire.get('portes') as FormArray;
    }

    
  
types_de_porte_simples:any
types_de_porte_doubles:any
types_de_porte_coulissantes:any
natures_porte:any
gammes:any
load_gammes(){
  this.userService.getGammesByTravailAndType(10,"type-de-porte-simple").subscribe(
    (response: any) => {
      console.log('recuperation des gammes type-de-porte-simple:', response);
      this.types_de_porte_simples=response
    },
    (error: any) => {
      console.error('Erreur lors de la recuperation des gammes type-de-porte-simple :', error);
    }
  );
  this.userService.getGammesByTravailAndType(10,"type-de-porte-coulissante").subscribe(
    (response: any) => {
      console.log('recuperation des gammes type-de-porte-coulissante:', response);
      this.types_de_porte_coulissantes=response
    },
    (error: any) => {
      console.error('Erreur lors de la recuperation des gammes type-de-porte-coulissantee :', error);
    }
  );
  this.userService.getGammesByTravailAndType(10,"type-de-porte-double").subscribe(
    (response: any) => {
      console.log('recuperation des gammes type-de-porte-double:', response);
      this.types_de_porte_doubles=response
    },
    (error: any) => {
      console.error('Erreur lors de la recuperation des gammes type-de-porte-double :', error);
    }
  );
  this.userService.getGammesByTravailAndType(10,"nature-porte").subscribe(
    (response: any) => {
      console.log('recuperation des gammes nature-porte:', response);
      this.natures_porte=response
    },
    (error: any) => {
      console.error('Erreur lors de la recuperation des gammes nature-porte :', error);
    }
  );

  this.userService.getGammesByTravailAndType(10,"gamme-de-porte").subscribe(
    (response: any) => {
      console.log('recuperation des gammes :', response);
      this.gammes=response
    },
    (error: any) => {
      console.error('Erreur lors de la recuperation des gammes  :', error);
    }
  );
  
}



artisans_pose:any[] = []
fournisseurs_pose:any[] = []

artisans_nature:any[] = []
fournisseurs_nature:any[] = []

artisans_type:any[] = []
fournisseurs_type:any[] = []

all_artisans:any = []
one_artisan_for_all=0
all_fournisseurs:any = []
one_fournisseur_for_all=0


load_artisans_fournisseurs() {

  const requests: any[] = [];

  // Portes
  this.donnees["gammes-produits-pose-portes"].portes.forEach((porte: any) => {

    const porte_choisie_id = parseInt(porte.gamme.split(":")[0]);
    const nature_choisie_id = parseInt(porte.nature_porte.split(":")[0]);
    const type_choisie_id = parseInt(porte.type_porte.split(":")[0]);

    // Pose
    requests.push(
      this.userService.getArtisansFournisseursElementsByGammeReference(
        porte_choisie_id,
        'artisan'
      )
    );

    requests.push(
      this.userService.getArtisansFournisseursElementsByGammeReference(
        porte_choisie_id,
        'fournisseur'
      )
    );

    // Nature
    requests.push(
      this.userService.getArtisansFournisseursElementsByGammeReference(
        nature_choisie_id,
        'artisan'
      )
    );

    requests.push(
      this.userService.getArtisansFournisseursElementsByGammeReference(
        nature_choisie_id,
        'fournisseur'
      )
    );

    // Type
    requests.push(
      this.userService.getArtisansFournisseursElementsByGammeReference(
        type_choisie_id,
        'artisan'
      )
    );

    requests.push(
      this.userService.getArtisansFournisseursElementsByGammeReference(
        type_choisie_id,
        'fournisseur'
      )
    );

  });

  forkJoin(requests).subscribe({

    next: (responses: any[]) => {

      let index = 0;

      this.artisans_pose = [];
      this.fournisseurs_pose = [];
      this.artisans_nature = [];
      this.fournisseurs_nature = [];
      this.artisans_type = [];
      this.fournisseurs_type = [];

      this.donnees["gammes-produits-pose-portes"].portes.forEach((porte: any, i: number) => {

        this.artisans_pose[i] = responses[index++];
        this.fournisseurs_pose[i] = responses[index++];

        this.artisans_nature[i] = responses[index++];
        this.fournisseurs_nature[i] = responses[index++];

        this.artisans_type[i] = responses[index++];
        this.fournisseurs_type[i] = responses[index++];

      });

      // Artisans distincts
      this.all_artisans = [
        ...new Map(
          [
            ...this.artisans_pose.flat().map((x: any) => x.Artisan),
            ...this.artisans_nature.flat().map((x: any) => x.Artisan),
            ...this.artisans_type.flat().map((x: any) => x.Artisan)
          ].map((a: any) => [a.Id, a])
        ).values()
      ];

      // Fournisseurs distincts
      this.all_fournisseurs = [
        ...new Map(
          [
            ...this.fournisseurs_pose.flat().map((x: any) => x.Fournisseur),
            ...this.fournisseurs_nature.flat().map((x: any) => x.Fournisseur),
            ...this.fournisseurs_type.flat().map((x: any) => x.Fournisseur)
          ].map((f: any) => [f.Id, f])
        ).values()
      ];

      console.log('artisans_pose', this.artisans_pose);
      console.log('fournisseurs_pose', this.fournisseurs_pose);

      console.log('artisans_nature', this.artisans_nature);
      console.log('fournisseurs_nature', this.fournisseurs_nature);

      console.log('artisans_type', this.artisans_type);
      console.log('fournisseurs_type', this.fournisseurs_type);

      console.log('all_artisans', this.all_artisans);
      console.log('all_fournisseurs', this.all_fournisseurs);

    },

    error: err => {
      console.error('Erreur récupération artisans/fournisseurs', err);
    }

  });

}


onArtisanForAllChange(artisanId: number): void {

  this.selectArtisanFormArray(
    artisanId,
    this.artisans_pose,
    this.portes,
    'artisan_pose'
  );

  this.selectArtisanFormArray(
    artisanId,
    this.artisans_nature,
    this.portes,
    'artisan_nature', 
  );

  this.selectArtisanFormArray(
    artisanId,
    this.artisans_type,
    this.portes,
    'artisan_type'
  );

}


onFournisseurForAllChange(fournisseurId: number): void {

 this.selectFournisseurFormArray(
    fournisseurId,
    this.fournisseurs_pose,
    this.portes,
    'fournisseur_pose'
  );

  this.selectFournisseurFormArray(
    fournisseurId,
    this.fournisseurs_nature,
    this.portes,
    'fournisseur_nature'
  );

  this.selectFournisseurFormArray(
    fournisseurId,
    this.fournisseurs_type,
    this.portes,
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

    formArray.at(index)
      .get(controlName)
      ?.setValue(
        `${option.ID}:${option.Prix}:${option.Label}`
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

    formArray.at(index)
      .get(controlName)
      ?.setValue(
        `${option.ID}${separator}${option.Prix}${separator}${option.Label}`
      );

  });

}


  submit(){
    console.log(this.formulaire.value)
    const portesFormArray = this.formulaire.value.portes;
    this.devisTache.Donnees = {
      "nomtache":this.devisTache.TravailSlug,
      "idtache":this.devisTache.TravailID,
      "gammes-produits-pose-portes": {
        portes: portesFormArray.map((porte: any) => ({
          gamme: porte.gamme,
          nature_porte: porte.nature_porte,
          type_porte: porte.type_porte,
          etat: porte.etat,
          artisan_pose:porte.artisan_pose,
          fournisseur_pose:porte.fournisseur_pose,
          artisan_nature:porte.artisan_nature,
          fournisseur_nature:porte.fournisseur_nature,
          artisan_type:porte.artisan_type,
          fournisseur_type:porte.fournisseur_type,
        }))
      }
    };
    console.log("donnees", this.devisTache)
    this.calculDevisService.calculer_prix_tache(this.devisTache).then((result) => {
      this.detailsCalcul = result
      let formule = this.detailsCalcul.resultats[this.element.TravailSlug]?.formule;

      // Si formule existe, on remplace les \n par des <br>
      if (formule) {
        formule = formule.replace(/\n/g, '<br>');

        // On réinjecte la formule modifiée dans l'objet
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
    const portesFormArray = this.formulaire.value.portes;
    this.devisTache.Donnees = {
      "nomtache":this.devisTache.TravailSlug,
      "idtache":this.devisTache.TravailID,
      "gammes-produits-pose-portes": {
        portes: portesFormArray.map((porte: any) => ({
          gamme: porte.gamme,
          nature_porte: porte.nature_porte,
          type_porte: porte.type_porte,
          etat: porte.etat,
          artisan_pose:porte.artisan_pose,
          fournisseur_pose:porte.fournisseur_pose,
           artisan_nature:porte.artisan_nature,
          fournisseur_nature:porte.fournisseur_nature,
          artisan_type:porte.artisan_type,
          fournisseur_type:porte.fournisseur_type,
              
        }))
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


  get_prix_vente(i:number,type:string){
    let prix = 0
    switch (type) {
      case 'gamme':
        prix = parseFloat(this.donnees["gammes-produits-pose-portes"].portes[i].gamme.split(':')[1]);
        break;
      case 'nature_porte':
        prix = parseFloat(this.donnees["gammes-produits-pose-portes"].portes[i].nature_porte.split(':')[1]);
        break;
      case 'type_porte':
        prix = parseFloat(this.donnees["gammes-produits-pose-portes"].portes[i].type_porte.split(':')[1]);
        break;
    
      default:
        break;
    }
    return `${prix} €`
  }

  get_prix_coutant(i:number,type:string){
    let prix = 0
    switch (type) {
      case 'gamme':
        prix += parseFloat(this.donnees["gammes-produits-pose-portes"].portes[i].fournisseur_pose?.split(':')[1] || '0')
        prix += parseFloat(this.donnees["gammes-produits-pose-portes"].portes[i].artisan_pose?.split(':')[1] || '0')
        break;
      case 'nature_porte':
        prix += parseFloat(this.donnees["gammes-produits-pose-portes"].portes[i].fournisseur_nature?.split(':')[1] || '0')
        prix += parseFloat(this.donnees["gammes-produits-pose-portes"].portes[i].artisan_nature?.split(':')[1] || '0')
        break;
      case 'type_porte':
        prix += parseFloat(this.donnees["gammes-produits-pose-portes"].portes[i].artisan_type?.split(':')[1] || '0')
        prix += parseFloat(this.donnees["gammes-produits-pose-portes"].portes[i].fournisseur_type?.split(':')[1] || '0')
        break;
    
      default:
        break;
    }
    return `${prix} €`
  }

  get_client_choice_label(i:number,type:string){
    let label = ''
    switch (type) {
      case 'gamme':
        label = this.donnees["gammes-produits-pose-portes"].portes[i].gamme?.split(':')[2] 
        break;
      case 'nature_porte':
        label = this.donnees["gammes-produits-pose-portes"].portes[i].nature_porte?.split(':')[2] 
        break;
      case 'type_porte':
        label = this.donnees["gammes-produits-pose-portes"].portes[i].type_porte?.split(':')[2]
        break;
    
      default:
        break;
    }
    return `"${label}"`
  }

}
  