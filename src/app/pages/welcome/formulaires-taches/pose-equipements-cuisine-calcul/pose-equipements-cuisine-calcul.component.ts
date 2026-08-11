import { Component } from '@angular/core';
import { FormArray, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiConceptsEtTravauxService } from '../../../../Services/api-concepts-et-travaux.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CalculDevisService } from '../../../../Services/calcul-devis.service';
import { DevisTache } from '../../../../Models/DevisTache';
import { Equipement } from '../../../../Models/Equipement';
import { forkJoin } from 'rxjs';


@Component({
  selector: 'app-pose-equipements-cuisine-calcul',
  templateUrl: './pose-equipements-cuisine-calcul.component.html',
  styleUrl: './pose-equipements-cuisine-calcul.component.css'
})
export class PoseEquipementsCuisineCalculComponent {
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
      this.loadAppareils()
      this.load_parametres()
     
      

    }
  getDetails(id: number): void {
    this.userService.get_devis_tache(id ).subscribe(
      (response) => {
        this.devisTache=response
        this.element =response
        this.donnees = JSON.parse(response.Donnees) 
        this.formulaire = this.fb.group({
          appareils_cuisine_form: this.fb.array([]),
          gammes_depose_form: this.fb.array(
            this.donnees["dimensions-pose-elementcuisines"].gammes_depose_form.map((gamme: any) => {
              return this.fb.group({
                quantite: [gamme.quantite],
                titre: [gamme.titre],
                prix: [gamme.prix],
                id: [gamme.id],
                artisan_depose:[gamme.artisan_depose??'']
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
  appareils_cuisine:Equipement[]=[]

  gammes_depose: any[] = [];
   // Getter pour accéder à la FormArray "gammes"
   get gammes_depose_form(): FormArray {
    return this.formulaire.get('gammes_depose_form') as FormArray;
  }
  get appareils_cuisine_form(): FormArray {
    return this.formulaire.get('appareils_cuisine_form') as FormArray;
  }
tableauIds = [9, 37, 10, 2,35,38,6,36,34,42,39,40,41,];

  loadAppareils(){
    
    this.userService.getEquipementsByPiece(7).subscribe(
      (response: Equipement[]) => {
        const tableauIds=this.tableauIds
        this.appareils_cuisine = response.filter(equipement => equipement.Modeles && equipement.Modeles.length > 0).sort((a, b) => {
          // Trier selon l'ordre des IDs dans le tableau
          const indexA = tableauIds.indexOf(a.ID);
          const indexB = tableauIds.indexOf(b.ID);
          
          // Les éléments non présents dans le tableau seront mis à la fin
          return (indexA === -1 ? Number.MAX_SAFE_INTEGER : indexA) - 
                 (indexB === -1 ? Number.MAX_SAFE_INTEGER : indexB);
        });;
        console.log("réponse de la requette  getEquipementsByPiece:salledebain",this.appareils_cuisine);
        let i=0

        this.appareils_cuisine.forEach(appareil => {

          let modele=""
          let active=false
          let longueur=0
          let largeur=0
          let titre = ""
           let artisan_pose=""
          let fournisseur_pose=""
          let nombre_de_vasque=0
          let encastre_ou_apparente=false
          if(this.donnees["gammes-produits-pose-elementcuisines"]){
            let form=this.donnees["gammes-produits-pose-elementcuisines"]
            modele=form?.appareils_cuisine[i]?.modele
            active=form?.appareils_cuisine[i]?.active
            titre=form?.appareils_cuisine[i]?.titre
            longueur=form?.appareils_cuisine[i]?.longueur
            largeur=form?.appareils_cuisine[i]?.largeur
            nombre_de_vasque=form?.appareils_cuisine[i]?.nombre_de_vasque
            encastre_ou_apparente=form?.appareils_cuisine[i]?.encastre_ou_apparente
            artisan_pose=form?.appareils_cuisine[i]?.artisan_pose
            fournisseur_pose=form?.appareils_cuisine[i]?.fournisseur_pose
            
          }
        
             // Créer un FormGroup pour chaque appareil
          const appareilGroup = this.fb.group({});
              
          appareilGroup.addControl("titre", this.fb.control(titre, ));
          appareilGroup.addControl("longueur", this.fb.control(longueur, ));
          appareilGroup.addControl("largeur", this.fb.control(largeur, ));
          appareilGroup.addControl("nombre_de_vasque", this.fb.control(nombre_de_vasque, ));
          appareilGroup.addControl("encastre_ou_apparente", this.fb.control(encastre_ou_apparente, ));
          appareilGroup.addControl("active", this.fb.control(active, ));
          appareilGroup.addControl("modele", this.fb.control(modele, ));
          appareilGroup.addControl("artisan_pose", this.fb.control(artisan_pose, ));
          appareilGroup.addControl("fournisseur_pose", this.fb.control(fournisseur_pose, ));
         

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
          (this.formulaire.get('appareils_cuisine_form') as FormArray).push(appareilGroup);
          i++
          
        });


         if (this.prix_coutant_mode) {
          this.modifier()
        }
      },
      (error) => {
        console.error('Erreur lors de la recuperation des  getEquipementsByPiece:salledebain :', error);
      }
    );


    this.userService.getGammesByTravailAndTypeOrdered(2, 'service-depose-cuisine').subscribe(
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

  

artisans_depose:any[] = []
artisans_pose:any[] = []
fournisseurs_pose:any[] = []

all_artisans:any = []
one_artisan_for_all=0
all_fournisseurs:any = []
one_fournisseur_for_all=0


load_artisans_fournisseurs() {

  const requests: any[] = [];

  // Dépose
  this.donnees["dimensions-pose-elementcuisines"].gammes_depose_form.forEach((gamme: any) => {

    requests.push(
      this.userService.getArtisansFournisseursElementsByGammeReference(
        gamme.id,
        'artisan'
      )
    );

  });

  // Pose
  this.donnees["gammes-produits-pose-elementcuisines"].appareils_cuisine.forEach((appareil: any) => {

    const ref_id = appareil.modele
      ? parseInt(appareil.modele.split(":")[0])
      : 0;

    requests.push(
      this.userService.getArtisansFournisseursModelesByReference(
        ref_id,
        'artisan'
      )
    );

    requests.push(
      this.userService.getArtisansFournisseursModelesByReference(
        ref_id,
        'fournisseur'
      )
    );

  });

  forkJoin(requests).subscribe({

    next: (responses: any[]) => {

      let index = 0;

      this.artisans_depose = [];
      this.artisans_pose = [];
      this.fournisseurs_pose = [];

      // Dépose
      this.donnees["dimensions-pose-elementcuisines"].gammes_depose_form.forEach((g: any, i: number) => {
        this.artisans_depose[i] = responses[index++];
      });

      // Pose
      this.donnees["gammes-produits-pose-elementcuisines"].appareils_cuisine.forEach((a: any, i: number) => {
        this.artisans_pose[i] = responses[index++];
        this.fournisseurs_pose[i] = responses[index++];
      });

      // Artisans distincts
      this.all_artisans = [
        ...new Map(
          [
            ...this.artisans_depose.flat().map((x: any) => x.Artisan),
            ...this.artisans_pose.flat().map((x: any) => x.Artisan)
          ].map((a: any) => [a.Id, a])
        ).values()
      ];

      // Fournisseurs distincts
      this.all_fournisseurs = [
        ...new Map(
          this.fournisseurs_pose
            .flat()
            .map((x: any) => x.Fournisseur)
            .map((f: any) => [f.Id, f])
        ).values()
      ];

      console.log('total artisans_depose:', this.artisans_depose);
      console.log('total artisans_pose:', this.artisans_pose);
      console.log('total fournisseurs_pose:', this.fournisseurs_pose);
      console.log('all_artisans:', this.all_artisans);
      console.log('all_fournisseurs:', this.all_fournisseurs);

    },

    error: err => {
      console.error(err);
    }

  });

}



onArtisanForAllChange(artisanId: number): void {

  this.selectArtisansFormArray(
    artisanId,
    this.artisans_depose,
    this.gammes_depose_form,
    'artisan_depose'
  );

  this.selectArtisansFormArray(
    artisanId,
    this.artisans_pose,
    this.appareils_cuisine_form,
    'artisan_pose'
  );

}


private selectArtisansFormArray(
  artisanId: number,
  optionsGroups: any[][],
  formArray: any,
  controlName: string
): void {

  optionsGroups.forEach((options, index) => {

    const option = options?.find(o => o.Artisan?.Id === artisanId);

    if (!option) {
      return;
    }

    const label = option.Label ?? option.Titre;

    formArray.at(index).get(controlName)?.setValue(
      `${option.ID}:${label}:${option.Prix}`
    );

  });

}


onFournisseurForAllChange(fournisseurId: number): void {
  

  this.selectFournisseursFormArray(
    fournisseurId,
    this.fournisseurs_pose,
    this.appareils_cuisine_form,
    'fournisseur_pose'
  );

}



private selectFournisseursFormArray(
  fournisseurId: number,
  optionsGroups: any[][],
  formArray: any,
  controlName: string
): void {


  optionsGroups.forEach((options, index) => {

    const option = options?.find(o => o.Fournisseur?.Id === fournisseurId);

    if (!option) {
      return;
    }

    const label = option.Label ?? option.Titre;

    formArray.at(index).get(controlName)?.setValue(
      `${option.ID}:${label}:${option.Prix}`
    );

  });

}






  modifier(){
    const gammes_depose_form = this.formulaire.value.gammes_depose_form;
    const appareils_cuisine_form = this.formulaire.value.appareils_cuisine_form;
   
  
    this.devisTache.Donnees = {
      "nomtache":this.devisTache.TravailSlug,
      "idtache":this.devisTache.TravailID,
      "gammes-produits-pose-elementcuisines": {
        gammes_depose_form: gammes_depose_form,
        appareils_cuisine:appareils_cuisine_form,
      },
      "etat-surfaces-pose-elementcuisines": {
        gammes_depose_form: gammes_depose_form,
        appareils_cuisine:appareils_cuisine_form,
      },
      "dimensions-pose-elementcuisines": {
        gammes_depose_form: gammes_depose_form,
        appareils_cuisine:appareils_cuisine_form,
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


submit() {
  console.log(this.formulaire.value);

  const gammes_depose_form = this.formulaire.value.gammes_depose_form;
  const appareils_cuisine_form = this.formulaire.value.appareils_cuisine_form;
 

  this.devisTache.Donnees = {
    "nomtache":this.devisTache.TravailSlug,
      "idtache":this.devisTache.TravailID,
    "gammes-produits-pose-elementcuisines": {
      gammes_depose_form: gammes_depose_form,
      appareils_cuisine:appareils_cuisine_form,
    },
    "etat-surfaces-pose-elementcuisines": {
      gammes_depose_form: gammes_depose_form,
      appareils_cuisine:appareils_cuisine_form,
    },
    "dimensions-pose-elementcuisines": {
      gammes_depose_form: gammes_depose_form,
      appareils_cuisine:appareils_cuisine_form,
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





  get_prix_vente(i:number,type:string){
    let prix = 0
    switch (type) {
      case 'pose':
        if(this.donnees["gammes-produits-pose-elementcuisines"].appareils_cuisine[i].active){
          prix = parseFloat(this.donnees["gammes-produits-pose-elementcuisines"].appareils_cuisine[i].modele.split(':')[2]);

        }
        break;
      case 'depose':
        if(this.donnees["dimensions-pose-elementcuisines"].gammes_depose_form[i].quantite>0){
          prix = parseFloat(this.donnees["dimensions-pose-elementcuisines"].gammes_depose_form[i].prix);
        }
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
      case 'pose':
        prix += parseFloat(this.donnees["gammes-produits-pose-elementcuisines"].appareils_cuisine[i].fournisseur_pose?.split(':')[2] || '0')
        prix += parseFloat(this.donnees["gammes-produits-pose-elementcuisines"].appareils_cuisine[i].artisan_pose?.split(':')[2] || '0')
        break;
      case 'depose':
        prix += parseFloat(this.donnees["dimensions-pose-elementcuisines"].gammes_depose_form[i].artisan_depose?.split(':')[2] || '0')
        break;
    
      default:
        break;
    }
    
    return `${prix} €`
  }


  get_prix_debourse(i:number,type:string){
     let prix = 0
    switch (type) {
      case 'pose':
        if(this.donnees["gammes-produits-pose-elementcuisines"].appareils_cuisine[i].active){
          prix = parseFloat(this.donnees["gammes-produits-pose-elementcuisines"].appareils_cuisine[i].modele.split(':')[2]);

        }
        break;
      case 'depose':
        if(this.donnees["dimensions-pose-elementcuisines"].gammes_depose_form[i].quantite>0){
          prix = parseFloat(this.donnees["dimensions-pose-elementcuisines"].gammes_depose_form[i].prix);
        }
        break;
    
      default:
        break;
    }
    return `${prix} €`
  }

  get_client_choice_label(i:number,type:string){
    let label = ''
    switch (type) {
      case 'depose':
        label = this.donnees["dimensions-pose-elementcuisines"].gammes_depose_form[i].titre 
        break;
      case 'pose':
        label = `${this.donnees["gammes-produits-pose-elementcuisines"].appareils_cuisine[i].titre} ${this.donnees["gammes-produits-pose-elementcuisines"].appareils_cuisine[i].modele?.split(':')[1]}` 
        break;
    
      default:
        break;
    }
    return `"${label}"`
  }

  get_dimensions(i:number,type:string){
    let label = '<br>'

    switch (type) {
      case 'depose':
        label += `quantité : ${this.donnees["dimensions-pose-elementcuisines"].gammes_depose_form[i].quantite}  <br>` 
        break;
      case 'pose':
        label += `longueur : ${this.donnees["gammes-produits-pose-elementcuisines"].appareils_cuisine[i].longueur} cm <br>` 
        label += `quantité : 1 <br>`
        break;
    
      default:
        break;
    }
   

    return label
  }

}
