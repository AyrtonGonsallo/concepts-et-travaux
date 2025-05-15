import { Component } from '@angular/core';
import { FormArray, FormGroup, NonNullableFormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiConceptsEtTravauxService } from '../../../../Services/api-concepts-et-travaux.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CalculDevisService } from '../../../../Services/calcul-devis.service';
import { DevisTache } from '../../../../Models/DevisTache';

@Component({
  selector: 'app-pose-de-revetement-de-sol-calcul',
  templateUrl: './pose-de-revetement-de-sol-calcul.component.html',
  styleUrl: './pose-de-revetement-de-sol-calcul.component.css'
})
export class PoseDeRevetementDeSolCalculComponent {
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
      this.load_gammes_depose()
      this.load_gammes_pose()
      this.load_types()
    }
  getDetails(id: number): void {
    this.userService.get_devis_tache(id ).subscribe(
      (response) => {
        this.devisTache=response
        this.element =response
        this.donnees = JSON.parse(response.Donnees) 
        this.formulaire = this.fb.group({
          
            // Dimensions du sol
            longueur: this.donnees["dimensions-pose-sol"].longueur,
            largeur: this.donnees["dimensions-pose-sol"].largeur,
            depose: this.donnees["dimensions-pose-sol"].depose,
        
            // État de la surface
            etat: this.donnees["etat-surfaces-pose-sol"].etat,
        
            // Gammes produits
            gamme: this.donnees["gammes-produits-pose-sol"].gamme,
            autre_gamme: this.donnees["gammes-produits-pose-sol"].autre_gamme,
            lineaire: this.donnees["gammes-produits-pose-sol"].lineaire,
            plinthes: this.donnees["gammes-produits-pose-sol"].plinthes,
            has_plinthes: this.donnees["gammes-produits-pose-sol"].has_plinthes
          
        });
        
       // this.validateForm.patchValue(response);
        console.log("donnees ",this.donnees);
      },
      (error) => {
        console.error('Erreur lors de la recuperation des details  :', error);
      }
    );
    
  }

  
  gammes_depose:any
  load_gammes_depose(){
   
    this.userService.getGammesByTravailAndTypeOrdered(9,"depose-revetement-sol").subscribe(
      (response: any) => {
        console.log('recuperation des gammes gamme_depose:', response);
        this.gammes_depose=response
      },
      (error: any) => {
        console.error('Erreur lors de la recuperation des gammes gamme_depose :', error);
      }
    );

  }

  
gammes_peinture_sol:any
gammes_parquet_massif:any
gammes_sol_souple:any
gammes_parquet_flottant:any
gammes_carrelage_sol:any
gammes_plithes_carrelage:any
gammes_plithes_bois:any
gamme_resine_decorative:any
gamme_moquette_sol:any

load_gammes_pose(){
  this.userService.getGammesByTravailAndType(9,"peinture-de-sol").subscribe(
    (response: any) => {
      console.log('recuperation des gammes peinture-de-sol:', response);
      this.gammes_peinture_sol=response
    },
    (error: any) => {
      console.error('Erreur lors de la recuperation des gammes peinture-de-sol :', error);
    }
  );
  this.userService.getGammesByTravailAndType(9,"papier-massif-sol").subscribe(
    (response: any) => {
      console.log('recuperation des gammes papier-massif-sol:', response);
      this.gammes_parquet_massif=response
    },
    (error: any) => {
      console.error('Erreur lors de la recuperation des gammes papier-massif-sol :', error);
    }
  );
  this.userService.getGammesByTravailAndType(9,"parquet-flottant-sol").subscribe(
    (response: any) => {
      console.log('recuperation des gammes parquet-flottant-sol:', response);
      this.gammes_parquet_flottant=response
    },
    (error: any) => {
      console.error('Erreur lors de la recuperation des gammes parquet-flottant-finition-bois :', error);
    }
  );
  this.userService.getGammesByTravailAndType(9,"sol-souple").subscribe(
    (response: any) => {
      console.log('recuperation des gammes sol-souple:', response);
      this.gammes_sol_souple=response
    },
    (error: any) => {
      console.error('Erreur lors de la recuperation des gammes sol-souple :', error);
    }
  );
  this.userService.getGammesByTravailAndType(9,"carrelage-sol").subscribe(
    (response: any) => {
      console.log('recuperation des gammes carrelage-sol:', response);
      this.gammes_carrelage_sol=response
    },
    (error: any) => {
      console.error('Erreur lors de la recuperation des gammes carrelage-sol :', error);
    }
  );
  this.userService.getGammesByTravailAndType(9,"plinthes-carrelage").subscribe(
    (response: any) => {
      console.log('recuperation des gammes plinthes-carrelage:', response);
      this.gammes_plithes_carrelage=response
    },
    (error: any) => {
      console.error('Erreur lors de la recuperation des gammes plinthes :', error);
    }
  );
  this.userService.getGammesByTravailAndType(9,"plinthes-bois").subscribe(
    (response: any) => {
      console.log('recuperation des gammes plinthes-bois:', response);
      this.gammes_plithes_bois=response
    },
    (error: any) => {
      console.error('Erreur lors de la recuperation des gammes plinthes :', error);
    }
  );
  this.userService.getGammesByTravailAndType(9,"resine-decorative-de-sol").subscribe(
    (response: any) => {
      console.log('recuperation des gammes resine-decorative-de-sol:', response[0]);
      this.gamme_resine_decorative=response
    },
    (error: any) => {
      console.error('Erreur lors de la recuperation des gammes resine-decorative-de-sol :', error);
    }
  );
  this.userService.getGammesByTravailAndType(9,"moquette-de-sol").subscribe(
    (response: any) => {
      console.log('recuperation des gammes moquette-de-sol:', response[0]);
      this.gamme_moquette_sol=response
      
    },
    (error: any) => {
      console.error('Erreur lors de la recuperation des gammes moquette-de-sol :', error);
    }
  );
}


submit(){
  console.log(this.formulaire.value)
  this.devisTache.Donnees = {
    "dimensions-pose-sol": {
      longueur: this.formulaire.value.longueur,
      largeur: this.formulaire.value.largeur,
      depose: this.formulaire.value.depose
    },
    "etat-surfaces-pose-sol": {
      etat: this.formulaire.value.etat
    },
    "gammes-produits-pose-sol": {
      gamme: this.formulaire.value.gamme,
      autre_gamme: this.formulaire.value.autre_gamme,
      lineaire: this.formulaire.value.lineaire,
      plinthes: this.formulaire.value.plinthes,
      has_plinthes: this.formulaire.value.has_plinthes
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

etat_des_surfaces:any
load_types(){
  this.userService.getGammesByTravailAndTypeOrdered(9,"etat-des-surfaces-sol").subscribe(
    (response: any) => {
      console.log('recuperation des etat-des-surfaces-murs	:', response);
      this.etat_des_surfaces=response
    },
    (error: any) => {
      console.error('Erreur lors de la recuperation des etat-des-surfaces-murs	 :', error);
    }
  );
}


modifier(){
  this.devisTache.Donnees = {
    "dimensions-pose-sol": {
      longueur: this.formulaire.value.longueur,
      largeur: this.formulaire.value.largeur,
      depose: this.formulaire.value.depose
    },
    "etat-surfaces-pose-sol": {
      etat: this.formulaire.value.etat
    },
    "gammes-produits-pose-sol": {
      gamme: this.formulaire.value.gamme,
      autre_gamme: this.formulaire.value.autre_gamme,
      lineaire: this.formulaire.value.lineaire,
      plinthes: this.formulaire.value.plinthes,
      has_plinthes: this.formulaire.value.has_plinthes
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
