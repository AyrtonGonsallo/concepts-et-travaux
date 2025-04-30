import { Component } from '@angular/core';
import { FormArray, FormGroup, NonNullableFormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiConceptsEtTravauxService } from '../../../../Services/api-concepts-et-travaux.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CalculDevisService } from '../../../../Services/calcul-devis.service';
import { DevisTache } from '../../../../Models/DevisTache';

@Component({
  selector: 'app-pose-de-revetements-muraux-calcul',
  templateUrl: './pose-de-revetements-muraux-calcul.component.html',
  styleUrl: './pose-de-revetements-muraux-calcul.component.css'
})
export class PoseDeRevetementsMurauxCalculComponent {
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
    this.load_types()
    this.load_gammes()
    this.load_etats()
  }

  getDetails(id: number): void {
    this.userService.get_devis_tache(id ).subscribe(
      (response) => {
        this.devisTache=response
        this.element =response
        this.donnees = JSON.parse(response.Donnees) 
        this.formulaire = this.fb.group({
          murs: this.fb.array(this.donnees["dimensions-pose-murs"].murs.map((mur:any, i:number) => {
            return this.fb.group({
              hauteur: mur.hauteur,
              longueur: mur.longueur,
              depose: mur.depose,
              etat: this.donnees["etat-surfaces-pose-murs"].murs[i].etat,
              gamme: this.donnees["gammes-produits-pose-murs"].murs[i].gamme,
            });
          }))
        });
       // this.validateForm.patchValue(response);
        console.log("donnees ",this.donnees);
      },
      (error) => {
        console.error('Erreur lors de la recuperation des details  :', error);
      }
    );
    
  }

  get murs() {
    return this.formulaire.get('murs') as FormArray;
  }

  type_de_depose:any
  load_types(){
    this.userService.getGammesByTravailAndTypeOrdered(5,"depose-murs	").subscribe(
      (response: any) => {
        console.log('recuperation des types depose-murs	:', response);
        this.type_de_depose=response
      },
      (error: any) => {
        console.error('Erreur lors de la recuperation des types depose-murs	 :', error);
      }
    );
  }
etat_des_surfaces:any
load_etats(){
  this.userService.getGammesByTravailAndTypeOrdered(5,"etat-des-surfaces-murs").subscribe(
    (response: any) => {
      console.log('recuperation des etat-des-surfaces-murs	:', response);
      this.etat_des_surfaces=response
    },
    (error: any) => {
      console.error('Erreur lors de la recuperation des etat-des-surfaces-murs	 :', error);
    }
  );
}
    
  gammes_peinture:any
  gammes_enduit:any
  gammes_papier:any
  gammes_carrelage:any
  gammes_bois:any
  gammes_tissus:any
  load_gammes(){
    this.userService.getGammesByTravailAndType(5,"peinture").subscribe(
      (response: any) => {
        console.log('recuperation des gammes peinture:', response);
        this.gammes_peinture=response
      },
      (error: any) => {
        console.error('Erreur lors de la recuperation des gammes peinture :', error);
      }
    );
    this.userService.getGammesByTravailAndType(5,"bois").subscribe(
      (response: any) => {
        console.log('recuperation des gammes bois:', response);
        this.gammes_bois=response
      },
      (error: any) => {
        console.error('Erreur lors de la recuperation des gammes bois :', error);
      }
    );
    this.userService.getGammesByTravailAndType(5,"tissus").subscribe(
      (response: any) => {
        console.log('recuperation des gammes tissus:', response);
        this.gammes_tissus=response
      },
      (error: any) => {
        console.error('Erreur lors de la recuperation des gammes tissus :', error);
      }
    );
    this.userService.getGammesByTravailAndType(5,"enduit-decoratif").subscribe(
      (response: any) => {
        console.log('recuperation des gammes enduit-decoratif:', response);
        this.gammes_enduit=response
      },
      (error: any) => {
        console.error('Erreur lors de la recuperation des gammes enduit-decoratif :', error);
      }
    );
    this.userService.getGammesByTravailAndType(5,"papier-peint").subscribe(
      (response: any) => {
        console.log('recuperation des gammes papier-peint:', response);
        this.gammes_papier=response
      },
      (error: any) => {
        console.error('Erreur lors de la recuperation des gammes papier-peint :', error);
      }
    );
    this.userService.getGammesByTravailAndType(5,"carrelage").subscribe(
      (response: any) => {
        console.log('recuperation des gammes carrelage:', response);
        this.gammes_carrelage=response
      },
      (error: any) => {
        console.error('Erreur lors de la recuperation des gammes carrelage :', error);
      }
    );
  }


  submit(){
    console.log(this.formulaire.value)
    const mursFormArray = this.formulaire.value.murs;
    this.devisTache.Donnees = {
      "dimensions-pose-murs": {
        murs: mursFormArray.map((mur: any) => ({
          hauteur: mur.hauteur,
          longueur: mur.longueur,
          depose: mur.depose,
          image: null // ou garde l’ancienne valeur si dispo
        }))
      },
      "etat-surfaces-pose-murs": {
        murs: mursFormArray.map((mur: any) => ({
          etat: mur.etat
        }))
      },
      "gammes-produits-pose-murs": {
        murs: mursFormArray.map((mur: any) => ({
          gamme: mur.gamme,
          carrelage: 0,
          papier: 0,
          enduit: 0,
          peinture: 0
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
    console.log(this.formulaire.value)
    const mursFormArray = this.formulaire.value.murs;
    this.devisTache.Donnees = {
      "dimensions-pose-murs": {
        murs: mursFormArray.map((mur: any) => ({
          hauteur: mur.hauteur,
          longueur: mur.longueur,
          depose: mur.depose,
          image: null // ou garde l’ancienne valeur si dispo
        }))
      },
      "etat-surfaces-pose-murs": {
        murs: mursFormArray.map((mur: any) => ({
          etat: mur.etat
        }))
      },
      "gammes-produits-pose-murs": {
        murs: mursFormArray.map((mur: any) => ({
          gamme: mur.gamme,
          carrelage: 0,
          papier: 0,
          enduit: 0,
          peinture: 0
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
          this.message.create('success', `Tache modifié avec succès`);
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




