import { Component } from '@angular/core';
import { FormArray, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiConceptsEtTravauxService } from '../../../../Services/api-concepts-et-travaux.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CalculDevisService } from '../../../../Services/calcul-devis.service';
import { DevisTache } from '../../../../Models/DevisTache';
import { Equipement } from '../../../../Models/Equipement';


@Component({
  selector: 'app-installation-sanitaires-calcul',
  templateUrl: './installation-sanitaires-calcul.component.html',
  styleUrl: './installation-sanitaires-calcul.component.css'
})
export class InstallationSanitairesCalculComponent {
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
      this.loadAppareils()

    }
  getDetails(id: number): void {
    this.userService.get_devis_tache(id ).subscribe(
      (response) => {
        this.devisTache=response
        this.element =response
        this.donnees = JSON.parse(response.Donnees) 
        this.formulaire = this.fb.group({
          appareils_salle_de_bain_form: this.fb.array([]),
          gammes_depose_form: this.fb.array(
            this.donnees["dimensions-pose-app-san"].gammes_depose_form.map((gamme: any) => {
              return this.fb.group({
                quantite: [gamme.quantite],
                titre: [gamme.titre],
                prix: [gamme.prix],
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
  appareils_salle_de_bain:Equipement[]=[]

  gammes_depose: any[] = [];
   // Getter pour accéder à la FormArray "gammes"
   get gammes_depose_form(): FormArray {
    return this.formulaire.get('gammes_depose_form') as FormArray;
  }
  get appareils_salle_de_bain_form(): FormArray {
    return this.formulaire.get('appareils_salle_de_bain_form') as FormArray;
  }
tableauIds = [9, 37, 10, 2,35,38,6,36,34,42,39,40,41,];

  loadAppareils(){
    
    this.userService.getEquipementsByPiece(5).subscribe(
      (response: Equipement[]) => {
        const tableauIds=this.tableauIds
        this.appareils_salle_de_bain = response.filter(equipement => equipement.ModeleEquipements && equipement.ModeleEquipements.length > 0).sort((a, b) => {
          // Trier selon l'ordre des IDs dans le tableau
          const indexA = tableauIds.indexOf(a.ID);
          const indexB = tableauIds.indexOf(b.ID);
          
          // Les éléments non présents dans le tableau seront mis à la fin
          return (indexA === -1 ? Number.MAX_SAFE_INTEGER : indexA) - 
                 (indexB === -1 ? Number.MAX_SAFE_INTEGER : indexB);
        });;
        console.log("réponse de la requette  getEquipementsByPiece:salledebain",this.appareils_salle_de_bain);
        let i=0

        this.appareils_salle_de_bain.forEach(appareil => {

          let modele=""
          let active=false
          let longueur=0
          let titre=""
          let largeur=0
          let nombre_de_vasque=0
          let encastre_ou_apparente=false
          if(this.donnees["gammes-produits-pose-app-san"]){
            let form=this.donnees["gammes-produits-pose-app-san"]
            modele=form?.appareils_salle_de_bain[i]?.modele
            active=form?.appareils_salle_de_bain[i]?.active
            longueur=form?.appareils_salle_de_bain[i]?.longueur
            largeur=form?.appareils_salle_de_bain[i]?.largeur
            nombre_de_vasque=form?.appareils_salle_de_bain[i]?.nombre_de_vasque
            encastre_ou_apparente=form?.appareils_salle_de_bain[i]?.encastre_ou_apparente
            titre=form?.appareils_salle_de_bain[i]?.titre
          }
        
             // Créer un FormGroup pour chaque appareil
          const appareilGroup = this.fb.group({});
              
          appareilGroup.addControl("longueur", this.fb.control(longueur, ));
          appareilGroup.addControl("largeur", this.fb.control(largeur, ));
          appareilGroup.addControl("nombre_de_vasque", this.fb.control(nombre_de_vasque, ));
          appareilGroup.addControl("encastre_ou_apparente", this.fb.control(encastre_ou_apparente, ));
          appareilGroup.addControl("active", this.fb.control(active, ));
          appareilGroup.addControl("modele", this.fb.control(modele, ));
          appareilGroup.addControl("titre", this.fb.control(titre, ));
         

          // Obtenez les contrôles pour pouvoir les manipuler
          const nombre_de_vasqueControl = appareilGroup.get('nombre_de_vasque');
          const largeurControl = appareilGroup.get('largeur');
          const longueurControl = appareilGroup.get('longueur');
          const modeleControl = appareilGroup.get('modele');
          const activeControl = appareilGroup.get('active');

          // Abonnez-vous aux changements de la valeur de 'active'
          activeControl?.valueChanges.subscribe((isActive: boolean) => {
            if (isActive) {
              // Si 'active' est true, ajouter les validateurs
              modeleControl?.setValidators(Validators.required);
            } else {
              // Sinon, supprimer les validateurs
              modeleControl?.clearValidators();
            }
            // Mettre à jour la validation pour forcer la vérification des erreurs
            modeleControl?.updateValueAndValidity();
          });
           

          // Ajouter le FormGroup de l'appareil au FormArray
          (this.formulaire.get('appareils_salle_de_bain_form') as FormArray).push(appareilGroup);
          i++
          
        });
      },
      (error) => {
        console.error('Erreur lors de la recuperation des  getEquipementsByPiece:salledebain :', error);
      }
    );


    this.userService.getGammesByTravailAndTypeOrdered(16, 'depose-salle-de-bain-salle-d-eau').subscribe(
      (response: any) => {
        this.gammes_depose = response
        console.log("réponse de la requette  get depose salle de bain",this.gammes_depose);
        let i=0

        
      },
      (error) => {
        console.error('Erreur lors de la recuperation des gammes_depose :', error);
      }
    );


  }


submit() {
  console.log(this.formulaire.value);

  const gammes_depose_form = this.formulaire.value.gammes_depose_form;
  const appareils_salle_de_bain_form = this.formulaire.value.appareils_salle_de_bain_form;
 

  this.devisTache.Donnees = {
    "gammes-produits-pose-app-san": {
      gammes_depose_form: gammes_depose_form,
      appareils_salle_de_bain:appareils_salle_de_bain_form,
    },
    "etat-surfaces-pose-app-san": {
      gammes_depose_form: gammes_depose_form,
      appareils_salle_de_bain:appareils_salle_de_bain_form,
    },
    "dimensions-pose-app-san": {
      gammes_depose_form: gammes_depose_form,
      appareils_salle_de_bain:appareils_salle_de_bain_form,
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




  
modifier(){
  const gammes_depose_form = this.formulaire.value.gammes_depose_form;
  const appareils_salle_de_bain_form = this.formulaire.value.appareils_salle_de_bain_form;
 

  this.devisTache.Donnees = {
    "gammes-produits-pose-app-san": {
      gammes_depose_form: gammes_depose_form,
      appareils_salle_de_bain:appareils_salle_de_bain_form,
    },
    "etat-surfaces-pose-app-san": {
      gammes_depose_form: gammes_depose_form,
      appareils_salle_de_bain:appareils_salle_de_bain_form,
    },
    "dimensions-pose-app-san": {
      gammes_depose_form: gammes_depose_form,
      appareils_salle_de_bain:appareils_salle_de_bain_form,
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