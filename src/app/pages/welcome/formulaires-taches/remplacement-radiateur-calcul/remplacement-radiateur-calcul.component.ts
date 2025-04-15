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

   constructor(private calculDevisService:CalculDevisService,private fb: NonNullableFormBuilder,private route: ActivatedRoute,private userService: ApiConceptsEtTravauxService,private message: NzMessageService, private router: Router) {
    }

    ngOnInit(): void {
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
              });
            })
          ),
          type_radiateurs_form: this.fb.array(
            this.donnees["etat-surfaces-pose-chauffage"].radiateurs.map((radiateur: any) => {
              return this.fb.group({
                type: [radiateur.type],
                
              });
            })
          ),
          hauteur: [this.donnees["dimensions-pose-chauffage"].hauteur || 0],
          surface: [this.donnees["dimensions-pose-chauffage"].surface || 0]
        });
        
        
        
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
    this.userService.getGammesByTravailAndType(12,"radiateur").subscribe(
      (response: any) => {
        console.log('recuperation des gammes radiateur:', response);
        this.gammes_radiateurs=response
      },
      (error: any) => {
        console.error('Erreur lors de la recuperation des gammes radiateur :', error);
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


submit() {
  console.log(this.formulaire.value);

  const gamme_radiateurs = this.formulaire.value.gamme_radiateurs_form;
  const type_radiateurs = this.formulaire.value.type_radiateurs_form;
  const hauteur = this.formulaire.value.hauteur;
  const surface = this.formulaire.value.surface;

  this.devisTache.Donnees = {
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

    console.log("Prix reçu :", this.detailsCalcul);

  }).catch((error) => {
    console.error("Erreur lors du calcul :", error);
  });
}



}
