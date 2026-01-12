import { Component } from '@angular/core';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { EtapeDevis } from '../../../Models/Etape-Devis';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../Services/auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ApiConceptsEtTravauxService } from '../../../Services/api-concepts-et-travaux.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-etapes-devis',
  templateUrl: './etapes-devis.component.html',
  styleUrl: './etapes-devis.component.css'
})
export class EtapesDevisComponent {
  size: NzButtonSize = 'large';
  listOfColumn = [
    {
      title: 'Id',
      compare: (a: EtapeDevis, b: EtapeDevis) => a.ID - b.ID,
      priority: 3,
      order:'descend'
    },
   
    {
      title: 'Titre',
      compare: (a: EtapeDevis, b: EtapeDevis) => a.Titre.localeCompare(b.Titre),
      priority: 2,
      order:null
    },
    {
      title: 'Travail',
      compare: (a: EtapeDevis, b: EtapeDevis) => (a.Travail?.Titre).localeCompare(b.Travail?.Titre),
      priority: 2,
      order:null
    },
    {
      title: 'Etape',
      compare: (a: EtapeDevis, b: EtapeDevis) => (a.Etape).localeCompare(b.Etape),
      priority: 2,
      order:null
    },
    {
      title: 'Wc',
      compare: (a: EtapeDevis, b: EtapeDevis) => (a.Description_wc??'').localeCompare(b.Description_wc??''),
      priority: 1,
      order:null
    },
    {
      title: 'Cuisine',
      compare: (a: EtapeDevis, b: EtapeDevis) => (a.Description_cuisine??'').localeCompare(b.Description_cuisine??''),
      priority: 1,
      order:null
    },
    {
      title: 'Salon',
      compare: (a: EtapeDevis, b: EtapeDevis) => (a.Description_salon??'').localeCompare(b.Description_salon??''),
      priority: 1,
      order:null
    },
    
  ];
  etapes:EtapeDevis[] = [];

  constructor(private titleService: Title,private http: HttpClient,private authService: AuthService,private message: NzMessageService,private userService: ApiConceptsEtTravauxService) { }

  ngOnInit(): void {
    this.titleService.setTitle('Liste des Nota Bene');
    this.loadEtapeDevis();
  }

  loadEtapeDevis(): void {
    this.userService.getEtapesDevis()
      .subscribe((data: EtapeDevis[]) => {
        this.etapes = data;
        console.log("réponse de la requette get_etapes_devis",this.etapes);
      });
      console.log("envoi de la requette get_etapes_devis",this.etapes);
      
  }
  isAdminOrHim(id:number){

    return this.authService.isAdminOrHim(id)
  }
  isHimOrAdminAndOtherNotAdmin(id:number,rid:number| undefined){
    return this.authService.isHimOrAdminAndOtherNotAdmin(id,rid?rid:0)
  }
  cancel(): void {
    this.message.info('suppression annulée');
  }
  deleteEtape(id: number) {
    if (this.authService.isAdminorSuperAdmin()) {
      this.userService.deleteEtapeDevis(id).subscribe(
        () => {
          //console.log('EtapeDevis supprimé avec succès');
          this.message.success( 'EtapeDevis supprimé avec succès');
          // Mettez ici le code pour actualiser la liste des etapes si nécessaire
          this.loadEtapeDevis();
        },
        (error) => {
          console.error('Erreur lors de la suppression de l\'utilisateur :', error);
          this.message.error( 'Erreur lors de la suppression de l\'utilisateur');
        }
      );
      return true
    } else {
      this.message.info( `Vous n'avez pas assez de privilèges pour acceder à cette page et/ou ce n'est pas votre compte`);
      return false;
    }
    
  }
}
