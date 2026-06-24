import { Component } from '@angular/core';
import { Projet } from '../../../Models/Projet';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../Services/auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ApiConceptsEtTravauxService } from '../../../Services/api-concepts-et-travaux.service';
import { Title } from '@angular/platform-browser';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-projet',
  templateUrl: './projet.component.html',
  styleUrl: './projet.component.css'
})
export class ProjetComponent {
  projets: Projet[] = [];
  size: NzButtonSize = 'large';
  listOfColumn = [
    {
      title: 'Id Projet',
      compare: (a: Projet, b: Projet) => a.Id - b.Id,
      priority: 1,
       order:'descend', 
    },
    {
      title: 'Date',
      compare: (a: Projet, b: Projet) => {
        if (!a.Date_de_creation || !b.Date_de_creation) return 0;
        return new Date(a.Date_de_creation).getTime() - new Date(b.Date_de_creation).getTime();
      },
      priority: false,
      order:null, 
    },
    {
     title: 'Nom',
      compare: (a: Projet, b: Projet) => a.Nom.localeCompare(b.Nom),
      priority: false,
      order:null, 
    },
    {
      title: 'Statut',
      compare: (a: Projet, b: Projet) => a.Status.localeCompare(b.Status),
      priority: false,
      order: null
    },
    
  ];

  constructor(private fb: NonNullableFormBuilder,private titleService: Title,private http: HttpClient,private authService: AuthService,private message: NzMessageService,private userService: ApiConceptsEtTravauxService) { 
    this.projet_devis_Form = this.fb.group({
      devis_id: [0, [Validators.required]],
      projet_id: [0, [Validators.required]],
      action: ['add', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.titleService.setTitle('Liste des projets');
    this.loadProjets();
    this.load_parametres()
  }

  
  
  tva = 0
  coefficient = 0
  load_parametres(){
    this.userService.get_parametre_by_id_or_nom(6,"TVA")
    .subscribe(
      (data) => {
        this.tva=(1+data.Valeur/100);
        console.log("tva",data)
      },
      (error) => {
        console.error('Erreur lors de la recupération des parametres', error);
      });

    this.userService.get_parametre_by_id_or_nom(1,"coefficient")
    .subscribe(
      (data) => {
        this.coefficient=data.Valeur;
      },
      (error) => {
        console.error('Erreur lors de la recupération des parametres', error);
      });
  }

  calculerPrixTTC(prix: any,tva:number): number {
    
    if (!prix) return 0;
    const total = prix * this.coefficient * (1+tva/100);
    return Math.round(total * 100) / 100; // arrondi à 2 décimales
  }


  loadProjets(): void {
    if(this.authService.isAdminorSuperAdmin()){
      this.userService.getProjets().subscribe(
        (response) => {
          this.projets = response;
          console.log("réponse de la requette get_projets",response);
        },
        (error) => {
          console.error('Erreur lors de la recuperation des projets :', error);
        }
      );
    }else{
      this.userService.getProjetsByUserId (this.authService.getDataFromLocal("utilisateur").Id).subscribe(
        (response) => {
          this.projets = response;
          console.log("réponse de la requette get_projets",this.projets);
        },
        (error) => {
          console.error('Erreur lors de la recuperation des projets :', error);
        }
      );
    }
    
      console.log("envoi de la requette get_Projets",this.projets);
  }
  deleteProjet(autoId: number) {
    this.userService.get_projet(autoId).subscribe((succ) => {
      let projet_a_sup=succ
      if (this.authService.isAdminorSuperAdmin()) {
        this.userService.deleteProjet(autoId).subscribe(
          () => {
            console.log('Utilisateur supprimé avec succès');
            // Mettez ici le code pour actualiser la liste des Projets si nécessaire
            this.loadProjets();
          },
          (error) => {
            console.error('Erreur lors de la suppression de l\'utilisateur :', error);
          }
        );
        return true
      } else {
        this.message.info( `Vous n'avez pas assez de privilèges pour faire cette action`);
        return false;
      }
    },
    (error) => {
      console.error('Erreur lors de la suppression de l\'utilisateur :', error);
    })

  }


  projet_devis_Form: FormGroup<{
      projet_id: FormControl<number>;
      devis_id: FormControl<number>;
      action: FormControl<string>;
  }>;

  _display_edit_relation = false
  _swith_display_edit_relation(){
    this._display_edit_relation = !this._display_edit_relation
  }

  _editProjetDevis() {
    let projet_id = this.projet_devis_Form.controls['projet_id'].value;
    let devis_id = this.projet_devis_Form.controls['devis_id'].value;
    let action = this.projet_devis_Form.controls['action'].value;

    this.userService.edit_projet_devis(projet_id, devis_id, action).subscribe((succ) => {
      if (this.authService.isAdminorSuperAdmin()) {
        this.message.success( `Relation projet devis modifiée`);
        this.loadProjets();
        return true
      } else {
        this.message.error( `Vous n'avez pas assez de privilèges pour faire cette action`);
        return false;
      }
    },
    (error) => {
      console.error('Erreur lors de la suppression de l\'utilisateur :', error);
      this.message.error( `Relation projet devis modifiée`);
    })

  }
}