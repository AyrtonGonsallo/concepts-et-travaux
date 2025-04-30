import { Component } from '@angular/core';
import { FormArray, FormGroup, NonNullableFormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiConceptsEtTravauxService } from '../../../../Services/api-concepts-et-travaux.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CalculDevisService } from '../../../../Services/calcul-devis.service';
import { DevisTache } from '../../../../Models/DevisTache';

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
                });
              })
            )
          });
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







  submit(){
    console.log(this.formulaire.value)
    const portesFormArray = this.formulaire.value.portes;
    this.devisTache.Donnees = {
      
      "gammes-produits-pose-portes": {
        portes: portesFormArray.map((porte: any) => ({
          gamme: porte.gamme,
          nature_porte: porte.nature_porte,
          type_porte: porte.type_porte,
          etat: porte.etat,
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
      console.log("Prix reçu :", this.detailsCalcul);
      
    }).catch((error) => {
      console.error("Erreur lors du calcul :", error);
    });
  }


  
  modifier(){
    const portesFormArray = this.formulaire.value.portes;
    this.devisTache.Donnees = {
      
      "gammes-produits-pose-portes": {
        portes: portesFormArray.map((porte: any) => ({
          gamme: porte.gamme,
          nature_porte: porte.nature_porte,
          type_porte: porte.type_porte,
          etat: porte.etat,
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
  