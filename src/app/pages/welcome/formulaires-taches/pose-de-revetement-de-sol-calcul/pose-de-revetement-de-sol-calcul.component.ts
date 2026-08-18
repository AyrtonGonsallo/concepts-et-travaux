import { Component } from '@angular/core';
import { FormArray, FormGroup, NonNullableFormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiConceptsEtTravauxService } from '../../../../Services/api-concepts-et-travaux.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CalculDevisService } from '../../../../Services/calcul-devis.service';
import { DevisTache } from '../../../../Models/DevisTache';
import { forkJoin } from 'rxjs';

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
      this.load_gammes_depose()
      this.load_gammes_pose()
      this.load_types()
      this.load_parametres()
    }


    devispiece:any
  getDetails(id: number): void {
    this.userService.get_devis_tache(id ).subscribe(
      (response) => {
        console.log(response)
        this.devisTache=response

        this.userService.getDevisPieceMinimumDatasById(this.devisTache.DevisPieceID).subscribe(
          (response) => {
            this.devispiece=response
            console.log('this.devispiece',this.devispiece)
            
          },
          (error) => {
            console.error('Erreur lors de la recuperation des details devis :', error);
          }
        );
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
            has_plinthes: this.donnees["gammes-produits-pose-sol"].has_plinthes,
            artisan_depose:(this.donnees["gammes-produits-pose-sol"].artisan_depose)?this.donnees["gammes-produits-pose-sol"].artisan_depose:"",
            artisan_surfaces:(this.donnees["gammes-produits-pose-sol"].artisan_surfaces)?this.donnees["gammes-produits-pose-sol"].artisan_surfaces:"",
            artisan_pose:(this.donnees["gammes-produits-pose-sol"].artisan_pose)?this.donnees["gammes-produits-pose-sol"].artisan_pose:"",
            fournisseur_pose:(this.donnees["gammes-produits-pose-sol"].fournisseur_pose)?this.donnees["gammes-produits-pose-sol"].fournisseur_pose:"",
            artisan_pose_plinthes:(this.donnees["gammes-produits-pose-sol"].artisan_pose_plinthes)?this.donnees["gammes-produits-pose-sol"].artisan_pose_plinthes:"",
            fournisseur_pose_plinthes:(this.donnees["gammes-produits-pose-sol"].fournisseur_pose_plinthes)?this.donnees["gammes-produits-pose-sol"].fournisseur_pose_plinthes:"",
        });
        
       // this.validateForm.patchValue(response);
        console.log("donnees ",this.donnees);
        this.load_artisans_fournisseurs()

         
        if (this.prix_coutant_mode) {
          this.modifier()
        }
      },
      (error) => {
        console.error('Erreur lors de la recuperation des details  :', error);
      }
    );
    
  }


  
  getDetails2(id: number): void {
    this.userService.get_devis_tache(id ).subscribe(
      (response) => {
        console.log(response)
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
            has_plinthes: this.donnees["gammes-produits-pose-sol"].has_plinthes,
            artisan_depose:(this.donnees["gammes-produits-pose-sol"].artisan_depose)?this.donnees["gammes-produits-pose-sol"].artisan_depose:"",
            artisan_surfaces:(this.donnees["gammes-produits-pose-sol"].artisan_surfaces)?this.donnees["gammes-produits-pose-sol"].artisan_surfaces:"",
            artisan_pose:(this.donnees["gammes-produits-pose-sol"].artisan_pose)?this.donnees["gammes-produits-pose-sol"].artisan_pose:"",
            fournisseur_pose:(this.donnees["gammes-produits-pose-sol"].fournisseur_pose)?this.donnees["gammes-produits-pose-sol"].fournisseur_pose:"",
            artisan_pose_plinthes:(this.donnees["gammes-produits-pose-sol"].artisan_pose_plinthes)?this.donnees["gammes-produits-pose-sol"].artisan_pose_plinthes:"",
            fournisseur_pose_plinthes:(this.donnees["gammes-produits-pose-sol"].fournisseur_pose_plinthes)?this.donnees["gammes-produits-pose-sol"].fournisseur_pose_plinthes:"",
        });
        
       // this.validateForm.patchValue(response);
        console.log("donnees ",this.donnees);
        this.load_artisans_fournisseurs()

       
      },
      (error) => {
        console.error('Erreur lors de la recuperation des details  :', error);
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


  gammes_depose:any
  load_gammes_depose(){
   
    this.userService.getGammesByTravailAndTypeOrdered(9,"service-depose-revetement-sol").subscribe(
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

artisans_depose:any
artisans_surfaces:any
artisans_pose:any
fournisseurs_pose:any
artisans_pose_plinthes:any
fournisseurs_pose_plinthes:any

all_artisans:any = []
one_artisan_for_all=0

all_fournisseurs:any = []
one_fournisseur_for_all=0

  load_artisans_fournisseurs() {

  const rev_a_poser_id = parseInt(this.donnees["gammes-produits-pose-sol"].gamme.split(":")[0]);
  const plinthe_a_poser_id = parseInt(this.donnees["gammes-produits-pose-sol"].plinthes.split(":")[0]);
  const etat_id = parseInt(this.donnees["etat-surfaces-pose-sol"].etat.split("-")[0]);
  const rev_a_deposer_id = parseInt(this.donnees["dimensions-pose-sol"].depose.split(":")[0]);


  forkJoin({

    artisans_depose:
      this.userService.getArtisansFournisseursElementsByGammeReference(
        rev_a_deposer_id,
        'artisan'
      ),

    artisans_surfaces:
      this.userService.getArtisansFournisseursElementsByGammeReference(
        etat_id,
        'artisan'
      ),

    artisans_pose_plinthes:
      this.userService.getArtisansFournisseursElementsByGammeReference(
        plinthe_a_poser_id,
        'artisan'
      ),

    fournisseurs_pose_plinthes:
      this.userService.getArtisansFournisseursElementsByGammeReference(
        plinthe_a_poser_id,
        'fournisseur'
      ),

    artisans_pose:
      this.userService.getArtisansFournisseursElementsByGammeReference(
        rev_a_poser_id,
        'artisan'
      ),

    fournisseurs_pose:
      this.userService.getArtisansFournisseursElementsByGammeReference(
        rev_a_poser_id,
        'fournisseur'
      )

  }).subscribe({

    next: (responses:any) => {

      this.artisans_depose = responses.artisans_depose;

      this.artisans_surfaces = responses.artisans_surfaces;

      this.artisans_pose_plinthes = responses.artisans_pose_plinthes;

      this.fournisseurs_pose_plinthes = responses.fournisseurs_pose_plinthes;

      this.artisans_pose = responses.artisans_pose;

      this.fournisseurs_pose = responses.fournisseurs_pose;


      // Artisans distincts
      this.all_artisans = [
        ...new Map(
          [
            ...this.artisans_depose.map((x:any)=>x.Artisan),
            ...this.artisans_surfaces.map((x:any)=>x.Artisan),
            ...this.artisans_pose_plinthes.map((x:any)=>x.Artisan),
            ...this.artisans_pose.map((x:any)=>x.Artisan)
          ]
          .map((a:any)=>[a.Id,a])
        ).values()
      ];


      // Fournisseurs distincts
      this.all_fournisseurs = [
        ...new Map(
          [
            ...this.fournisseurs_pose_plinthes.map((x:any)=>x.Fournisseur),
            ...this.fournisseurs_pose.map((x:any)=>x.Fournisseur)
          ]
          .map((f:any)=>[f.Id,f])
        ).values()
      ];


      console.log('artisans_depose', this.artisans_depose);
      console.log('artisans_surfaces', this.artisans_surfaces);
      console.log('artisans_pose_plinthes', this.artisans_pose_plinthes);
      console.log('fournisseurs_pose_plinthes', this.fournisseurs_pose_plinthes);
      console.log('artisans_pose', this.artisans_pose);
      console.log('fournisseurs_pose', this.fournisseurs_pose);

      console.log('all_artisans', this.all_artisans);
      console.log('all_fournisseurs', this.all_fournisseurs);

    },

    error: err => {
      console.error('Erreur récupération artisans/fournisseurs', err);
    }

  });

}



onArtisanForAllChange(artisanId: number): void {

  this.selectArtisan(artisanId, this.artisans_depose, 'artisan_depose');

  this.selectArtisan(artisanId, this.artisans_surfaces, 'artisan_surfaces', '-');

  this.selectArtisan(artisanId, this.artisans_pose, 'artisan_pose');

  this.selectArtisan(artisanId, this.artisans_pose_plinthes, 'artisan_pose_plinthes');

}



onFournisseurForAllChange(fournisseurId: number): void {

  this.selectFournisseur(
    fournisseurId,
    this.fournisseurs_pose_plinthes,
    'fournisseur_pose_plinthes'
  );

  this.selectFournisseur(
    fournisseurId,
    this.fournisseurs_pose,
    'fournisseur_pose'
  );

}


private selectArtisan(
  artisanId: number,
  options: any[],
  controlName: string,
  separator: string = ':'
): void {

  const option = options.find(
    o => o.Artisan?.Id === artisanId
  );

  if (!option) {
    this.formulaire.get(controlName)?.setValue(
    ``
  );
    return;
  }

  this.formulaire.get(controlName)?.setValue(
    `${option.ID}${separator}${option.Label}${separator}${option.Prix}`
  );

}


private selectFournisseur(
  fournisseurId: number,
  options: any[],
  controlName: string,
  separator: string = ':'
): void {

  const option = options.find(
    o => o.Fournisseur?.Id === fournisseurId
  );

  if (!option) {
    this.formulaire.get(controlName)?.setValue(
    ``
  );
    return;
  }

  this.formulaire.get(controlName)?.setValue(
    `${option.ID}${separator}${option.Label}${separator}${option.Prix}`
  );

}



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
    this.userService.getGammesByTravailAndType(9,"plinthes-carrelage-sol").subscribe(
      (response: any) => {
        console.log('recuperation des gammes plinthes-carrelage:', response);
        this.gammes_plithes_carrelage=response
      },
      (error: any) => {
        console.error('Erreur lors de la recuperation des gammes plinthes :', error);
      }
    );
    this.userService.getGammesByTravailAndType(9,"plinthes-bois-sol").subscribe(
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
      "nomtache":this.devisTache.TravailSlug,
        "idtache":this.devisTache.TravailID,
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
        has_plinthes: this.formulaire.value.has_plinthes,

        artisan_depose:this.formulaire.value.artisan_depose,
        artisan_surfaces:this.formulaire.value.artisan_surfaces,
        artisan_pose:this.formulaire.value.artisan_pose,
        fournisseur_pose:this.formulaire.value.fournisseur_pose,
        artisan_pose_plinthes:this.formulaire.value.artisan_pose_plinthes,
        fournisseur_pose_plinthes:this.formulaire.value.fournisseur_pose_plinthes,
          
      }
    };
    console.log("donnees", this.devisTache)
    this.calculDevisService.calculer_prix_tache(this.devisTache).then((result) => {
      this.detailsCalcul = result
      let formule = this.detailsCalcul.resultats[this.element.TravailSlug]?.formule;
      let formule_marge = this.detailsCalcul.resultats[this.element.TravailSlug]?.formule_marge;

      // Si formule existe, on remplace les \n par des <br>
      if (formule) {
        formule = formule.replace(/\n/g, '<br>');

        // On réinjecte la formule modifiée dans l'objet
        this.detailsCalcul.resultats[this.element.TravailSlug] = {
          ...this.detailsCalcul.resultats[this.element.TravailSlug],
          formule: formule
        };
      }
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
      "nomtache":this.devisTache.TravailSlug,
        "idtache":this.devisTache.TravailID,
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
        has_plinthes: this.formulaire.value.has_plinthes,
        
        artisan_depose:this.formulaire.value.artisan_depose,
        artisan_surfaces:this.formulaire.value.artisan_surfaces,
        artisan_pose:this.formulaire.value.artisan_pose,
        fournisseur_pose:this.formulaire.value.fournisseur_pose,
        artisan_pose_plinthes:this.formulaire.value.artisan_pose_plinthes,
        fournisseur_pose_plinthes:this.formulaire.value.fournisseur_pose_plinthes,
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
          }else{
           this.getDetails2(parseInt(this.tacheId, 10))
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




  get_prix_debourse(type:string){
    let prix = 0
    switch (type) {
       case 'plinthes':
        prix += parseFloat(this.donnees["gammes-produits-pose-sol"].plinthes?.split(':')[2] || '0')
        break;
      case 'gamme':
        prix = parseFloat(this.donnees["gammes-produits-pose-sol"].gamme.split(':')[2]);
        break;
      case 'etat':
        prix = parseFloat(this.donnees["etat-surfaces-pose-sol"].etat.split('-')[2]);
        break;
      case 'depose':
        prix = parseFloat(this.donnees["dimensions-pose-sol"].depose.split(':')[2]);
        break;
    
      default:
        break;
    }
    prix*=this.coefficient
    return `${prix} €`
  }


  get_prix_vente(type:string){
    let prix = 0
    switch (type) {
       case 'plinthes':
        prix += parseFloat(this.donnees["gammes-produits-pose-sol"].plinthes?.split(':')[2] || '0')
        break;
      case 'gamme':
        prix = parseFloat(this.donnees["gammes-produits-pose-sol"].gamme.split(':')[2]);
        break;
      case 'etat':
        prix = parseFloat(this.donnees["etat-surfaces-pose-sol"].etat.split('-')[2]);
        break;
      case 'depose':
        prix = parseFloat(this.donnees["dimensions-pose-sol"].depose.split(':')[2]);
        break;
    
      default:
        break;
    }
    return `${prix} €`
  }

  get_prix_coutant(type:string){
    let prix = 0
    switch (type) {
      case 'plinthes':
        prix += parseFloat(this.donnees["gammes-produits-pose-sol"].fournisseur_pose_plinthes?.split(':')[2] || '0')
        prix += parseFloat(this.donnees["gammes-produits-pose-sol"].artisan_pose_plinthes?.split(':')[2] || '0')
        break;
      case 'gamme':
        prix += parseFloat(this.donnees["gammes-produits-pose-sol"].fournisseur_pose?.split(':')[2] || '0')
        prix += parseFloat(this.donnees["gammes-produits-pose-sol"].artisan_pose?.split(':')[2] || '0')
        break;
      case 'etat':
        prix += parseFloat(this.donnees["gammes-produits-pose-sol"].artisan_surfaces?.split('-')[2] || '0')
        break;
      case 'depose':
        prix += parseFloat(this.donnees["gammes-produits-pose-sol"].artisan_depose?.split(':')[2] || '0')
        break;
    
      default:
        break;
    }
    return `${prix} €`
  }

  get_client_choice_label(type:string){
    let label = ''
    switch (type) {
      case 'depose':
        label = this.donnees["dimensions-pose-sol"].depose?.split(':')[1] 
        break;
      case 'etat':
        label = this.donnees["etat-surfaces-pose-sol"].etat?.split('-')[1] 
        break;
      case 'gamme':
        label = this.donnees["gammes-produits-pose-sol"].gamme?.split(':')[1]
        break;
      case 'plinthes':
        if(this.donnees["gammes-produits-pose-sol"].has_plinthes){
          label = this.donnees["gammes-produits-pose-sol"].plinthes?.split(':')[1]
        }
        break;
    
      default:
        break;
    }
    return `"${label}"`
  }

  get_dimensions(){
    let label = '1  <br>'
   
    label += `longueur : ${this.donnees["dimensions-pose-sol"].longueur} cm <br>` 
    label += `largeur : ${this.donnees["dimensions-pose-sol"].largeur } cm <br>`
       
    
    return label
  }


}
