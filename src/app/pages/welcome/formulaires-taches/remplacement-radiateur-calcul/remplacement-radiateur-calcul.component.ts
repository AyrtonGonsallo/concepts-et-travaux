import { Component } from '@angular/core';
import { FormArray, FormGroup, NonNullableFormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiConceptsEtTravauxService } from '../../../../Services/api-concepts-et-travaux.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CalculDevisService } from '../../../../Services/calcul-devis.service';
import { DevisTache } from '../../../../Models/DevisTache';


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
        }
      });
      this.route.params.subscribe(params => {
        this.tacheId = params['id'] ?? '0';
        console.log('Tache ID récupéré:', this.tacheId);
      });
      this.getDetails(parseInt(this.tacheId, 10))
      this.load_gammes()
      this.load_types()
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



artisans_pose:any[] = []
fournisseurs_pose:any[] = []

artisans_type:any[] = []
fournisseurs_type:any[] = []



load_artisans_fournisseurs(){

  this.donnees["gammes-produits-pose-chauffage"].radiateurs.map((radiateur:any, i:number) => {
    let gamme_id=parseInt(radiateur.gamme.split(":")[0]);


    this.userService.getArtisansFournisseursModelesByReference(gamme_id,'artisan').subscribe(
      (response: any) => {
        console.log('recuperation des artisans_pose:',gamme_id,'artisan', response);
        this.artisans_pose[i] = response;
      },
      (error: any) => {
        console.error('Erreur lors de la recuperation des artisans_pose :', error);
      }
    );

    this.userService.getArtisansFournisseursModelesByReference(gamme_id,'fournisseur').subscribe(
      (response: any) => {
        console.log('recuperation des fournisseurs_pose:', response);
        this.fournisseurs_pose[i] = response;
      },
      (error: any) => {
        console.error('Erreur lors de la recuperation des fournisseurs_pose :', error);
      }
    );


  });


  this.donnees["etat-surfaces-pose-chauffage"].radiateurs.map((radiateur:any, i:number) => {
    let type_id=parseInt(radiateur.type.split(":")[0]);

   

   
    this.userService.getArtisansFournisseursElementsByGammeReference(type_id,'artisan').subscribe(
      (response: any) => {
        console.log('recuperation des artisans_type:',type_id,'artisan', response);
        this.artisans_type[i] = response;
      },
      (error: any) => {
        console.error('Erreur lors de la recuperation des artisans_type :', error);
      }
    );

    this.userService.getArtisansFournisseursElementsByGammeReference(type_id,'fournisseur').subscribe(
      (response: any) => {
        console.log('recuperation des fournisseurs_type:', response);
        this.fournisseurs_type[i] = response;
      },
      (error: any) => {
        console.error('Erreur lors de la recuperation des fournisseurs_type :', error);
      }
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
        setTimeout(() => {
          this.router.navigate(['/administration/devis-pieces', 'modifier-devis-piece', this.devisTache.DevisPieceID]);
        }, 2000);
      },
      (error) => {
        console.error('Erreur lors de la modification de la tache :', error);
      }
    );
  }).catch(error => {
    console.error('Erreur lors du calcul du prix:', error);
  });


 
}

}
