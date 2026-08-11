import { Component } from '@angular/core';
import { FormArray, FormGroup, NonNullableFormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiConceptsEtTravauxService } from '../../../../Services/api-concepts-et-travaux.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CalculDevisService } from '../../../../Services/calcul-devis.service';
import { DevisTache } from '../../../../Models/DevisTache';
import { TacheGenerale } from '../../../../Models/TacheGenerale';
import { forkJoin } from 'rxjs';


@Component({
  selector: 'app-renovation-electrique-complete-calcul',
  templateUrl: './renovation-electrique-complete-calcul.component.html',
  styleUrl: './renovation-electrique-complete-calcul.component.css'
})
export class RenovationElectriqueCompleteCalculComponent {
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
    }



  getDetails(id: number): void {
    this.userService.get_devis_tache(id ).subscribe(
      (response) => {
        this.devisTache=response
        this.element =response
        this.donnees = JSON.parse(response.Donnees) 
        this.formulaire = this.fb.group({
          chauffage_exist: [this.donnees["gammes-produits-renovation-electrique"].chauffage_exist || false],
          mise_en_securite: [this.donnees["gammes-produits-renovation-electrique"].mise_en_securite || false],
          renovation_conforme: [this.donnees["gammes-produits-renovation-electrique"].renovation_conforme || false],
          quantite_chauffage: [this.donnees["gammes-produits-renovation-electrique"].quantite_chauffage || 0],
          surface: [this.donnees["gammes-produits-renovation-electrique"].surface || 0],
          artisan_mise_en_securite:[this.donnees["gammes-produits-renovation-electrique"].artisan_mise_en_securite??''],
          artisan_mise_aux_normes:[this.donnees["gammes-produits-renovation-electrique"].artisan_mise_aux_normes??''],
          artisan_chauffage:[this.donnees["gammes-produits-renovation-electrique"].artisan_chauffage??''],
        });

         
        if (this.prix_coutant_mode) {
          this.modifier()
        }
        
        
        this.load_artisans_fournisseurs()
        this.load_taches_generales()
        this.load_parametres()
       // this.validateForm.patchValue(response);
        console.log("donnees ",this.donnees);
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
  artisans_mise_en_securite:any = [] 
  artisans_mise_aux_normes:any = [] 
  artisans_chauffage:any = [] 
  all_artisans:any = []
  one_artisan_for_all=0
 
load_artisans_fournisseurs() {

  forkJoin({
    mise_en_securite: this.userService.getArtisansFournisseursElementsByGammeReference(222, 'artisan'),
    mise_aux_normes: this.userService.getArtisansFournisseursElementsByGammeReference(223, 'artisan'),
    chauffage: this.userService.getArtisansFournisseursElementsByGammeReference(224, 'artisan')
  }).subscribe({

    next: (result) => {

      this.artisans_mise_en_securite = result.mise_en_securite;
      this.artisans_mise_aux_normes = result.mise_aux_normes;
      this.artisans_chauffage = result.chauffage;

      this.all_artisans = [
        ...new Map(
          [
            ...result.mise_en_securite.map((i: any) => i.Artisan),
            ...result.mise_aux_normes.map((i: any) => i.Artisan),
            ...result.chauffage.map((i: any) => i.Artisan)
          ].map((a: any) => [a.Id, a])
        ).values()
      ];

      console.log('total artisans_mise_en_securite:', this.artisans_mise_en_securite); 
      console.log('total artisans_mise_aux_normes:', this.artisans_mise_aux_normes); 
      console.log('total artisans_chauffage:', this.artisans_chauffage); 
      console.log('this.all_artisans',this.all_artisans)

    },

    error: (err) => {
      console.error(err);
    }

  });

}


onArtisanForAllChange(artisanId: number): void {

  this.selectArtisan(
    artisanId,
    this.artisans_mise_en_securite,
    'artisan_mise_en_securite'
  );

  this.selectArtisan(
    artisanId,
    this.artisans_mise_aux_normes,
    'artisan_mise_aux_normes'
  );

  this.selectArtisan(
    artisanId,
    this.artisans_chauffage,
    'artisan_chauffage'
  );

}


private selectArtisan(
  artisanId: number,
  options: any[],
  controlName: string
): void {

  const option = options.find(o => o.Artisan?.Id === artisanId);

  if (!option) {
    return;
  }

  this.formulaire.get(controlName)?.setValue(
    `${option.ID}:${option.Label}:${option.Prix}`
  );

}



tache_mise_en_securite:TacheGenerale | undefined
tache_mise_aux_normes:TacheGenerale| undefined
tache_chauffage:TacheGenerale| undefined


load_taches_generales(){

  this.userService.getTacheGeneraleById(27).subscribe(
      (response: any) => {
        console.log('recuperation des tache_mise_en_securite',response);
        this.tache_mise_en_securite = response;
      },
      (error: any) => {
        console.error('Erreur lors de la recuperation des artisans_chauffage :', error);
      }
    );

    this.userService.getTacheGeneraleById(30).subscribe(
      (response: any) => {
        console.log('recuperation des tache_mise_aux_normes',response);
        this.tache_mise_aux_normes = response;
      },
      (error: any) => {
        console.error('Erreur lors de la recuperation des artisans_chauffage :', error);
      }
    );

    this.userService.getTacheGeneraleById(26).subscribe(
      (response: any) => {
        console.log('recuperation des tache_chauffage',response);
        this.tache_chauffage = response;
      },
      (error: any) => {
        console.error('Erreur lors de la recuperation des artisans_chauffage :', error);
      }
    );
    

}


submit() {
  console.log(this.formulaire.value);

  const chauffage_exist = this.formulaire.value.chauffage_exist;
  const mise_en_securite = this.formulaire.value.mise_en_securite;
  const renovation_conforme = this.formulaire.value.renovation_conforme;
  const surface = this.formulaire.value.surface;
  const quantite_chauffage = this.formulaire.value.quantite_chauffage;
   const artisan_chauffage = this.formulaire.value.artisan_chauffage;
  const artisan_mise_aux_normes = this.formulaire.value.artisan_mise_aux_normes;
  const artisan_mise_en_securite = this.formulaire.value.artisan_mise_en_securite;



  this.devisTache.Donnees = {
    "nomtache":this.devisTache.TravailSlug,
      "idtache":this.devisTache.TravailID,
    "gammes-produits-renovation-electrique": {
        chauffage_exist: chauffage_exist,
        mise_en_securite: mise_en_securite,
        renovation_conforme: renovation_conforme,
        quantite_chauffage: quantite_chauffage,
        surface: surface,
        artisan_chauffage:artisan_chauffage,
        artisan_mise_aux_normes:artisan_mise_aux_normes,
        artisan_mise_en_securite:artisan_mise_en_securite
    },
    "etat-surfaces-renovation-electrique": {
      chauffage_exist: chauffage_exist,
        mise_en_securite: mise_en_securite,
        renovation_conforme: renovation_conforme,
        quantite_chauffage: quantite_chauffage,
        surface: surface
    },
    "dimensions-renovation-electrique": {
      chauffage_exist: chauffage_exist,
        mise_en_securite: mise_en_securite,
        renovation_conforme: renovation_conforme,
        quantite_chauffage: quantite_chauffage,
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
  
  const chauffage_exist = this.formulaire.value.chauffage_exist;
  const mise_en_securite = this.formulaire.value.mise_en_securite;
  const renovation_conforme = this.formulaire.value.renovation_conforme;
  const surface = this.formulaire.value.surface;
  const quantite_chauffage = this.formulaire.value.quantite_chauffage;
  const artisan_chauffage = this.formulaire.value.artisan_chauffage;
  const artisan_mise_aux_normes = this.formulaire.value.artisan_mise_aux_normes;
  const artisan_mise_en_securite = this.formulaire.value.artisan_mise_en_securite;



  this.devisTache.Donnees = {
     "nomtache":this.devisTache.TravailSlug,
      "idtache":this.devisTache.TravailID,
    "gammes-produits-renovation-electrique": {
        chauffage_exist: chauffage_exist,
        mise_en_securite: mise_en_securite,
        renovation_conforme: renovation_conforme,
        quantite_chauffage: quantite_chauffage,
        surface: surface,
        artisan_chauffage:artisan_chauffage,
        artisan_mise_aux_normes:artisan_mise_aux_normes,
        artisan_mise_en_securite:artisan_mise_en_securite
    },
    "etat-surfaces-renovation-electrique": {
      chauffage_exist: chauffage_exist,
        mise_en_securite: mise_en_securite,
        renovation_conforme: renovation_conforme,
        quantite_chauffage: quantite_chauffage,
        surface: surface
    },
    "dimensions-renovation-electrique": {
      chauffage_exist: chauffage_exist,
        mise_en_securite: mise_en_securite,
        renovation_conforme: renovation_conforme,
        quantite_chauffage: quantite_chauffage,
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





  get_prix_vente(type:string){
    let prix = 0
    switch (type) {
      case 'mise_en_securite':
        prix = (this.tache_mise_en_securite?this.tache_mise_en_securite.Prix:0);
        break;
      case 'mise_aux_normes':
        prix = (this.tache_mise_aux_normes?this.tache_mise_aux_normes.Prix:0);
        break;
      case 'chauffage':
        prix = (this.tache_chauffage?this.tache_chauffage.Prix:0);
        break;
    
      default:
        break;
    }
    prix*=this.coefficient
    return `${prix} €`
  }

  get_prix_coutant(type:string){
    let prix = 0
    switch (type) {
      case 'mise_en_securite':
        prix += parseFloat(this.donnees["gammes-produits-renovation-electrique"].artisan_mise_en_securite?.split(':')[2] || '0')
        break;
      case 'mise_aux_normes':
        prix += parseFloat(this.donnees["gammes-produits-renovation-electrique"].artisan_mise_aux_normes?.split(':')[2] || '0')
        break;
      case 'chauffage':
        prix += parseFloat(this.donnees["gammes-produits-renovation-electrique"].artisan_chauffage?.split(':')[2] || '0')
        break;
    
      default:
        break;
    }
    return `${prix} €`
  }

   get_prix_debourse(type:string){
    let prix = 0
    switch (type) {
      case 'mise_en_securite':
        prix += parseFloat(this.donnees["gammes-produits-renovation-electrique"].artisan_mise_en_securite?.split(':')[2] || '0')
        break;
      case 'mise_aux_normes':
        prix += parseFloat(this.donnees["gammes-produits-renovation-electrique"].artisan_mise_aux_normes?.split(':')[2] || '0')
        break;
      case 'chauffage':
        prix += parseFloat(this.donnees["gammes-produits-renovation-electrique"].artisan_chauffage?.split(':')[2] || '0')
        break;
    
      default:
        break;
    }
    return `${prix} €`
  }

  

  get_dimensions(){
    let label = '1  <br>'
   
    label += `surface : ${this.donnees["dimensions-renovation-electrique"].surface} m² <br>` 
       
    
    return label
  }

}