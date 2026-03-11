import { Component } from '@angular/core';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { EtapeDevis } from '../../../Models/Etape-Devis';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../Services/auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ApiConceptsEtTravauxService } from '../../../Services/api-concepts-et-travaux.service';
import { Title } from '@angular/platform-browser';
import { Travail } from '../../../Models/Travail';
import { forkJoin } from 'rxjs';

interface EtapeItem {
  id: number;
  travail_id: number;
  texte: string;
}
@Component({
  selector: 'app-etapes-devis',
  templateUrl: './etapes-devis.component.html',
  styleUrl: './etapes-devis.component.css'
})
export class EtapesDevisComponent {
  filteredNBTravailID=0
  filteredNBEtape=""
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
    
  ];
  etapes:EtapeDevis[] = [];

  constructor(private titleService: Title,private http: HttpClient,private authService: AuthService,private message: NzMessageService,private userService: ApiConceptsEtTravauxService) { }

  async ngOnInit(): Promise<void> {
    this.titleService.setTitle('Liste des Nota Bene');
    await this.loadEtapeDevis();
    this.loadTravaux();
    const savedfilteredNBTravailIDListeGammes = localStorage.getItem('filteredNBTravailIDListeGammes');
    if (savedfilteredNBTravailIDListeGammes) {
      this.filteredNBTravailID = parseInt(savedfilteredNBTravailIDListeGammes);
      console.log("Filtre récupéré travail: ", savedfilteredNBTravailIDListeGammes);
    }
    const savedfilteredNBEtapeListeGammes = localStorage.getItem('filteredNBEtapeListeGammes');
    if (savedfilteredNBEtapeListeGammes) {
      this.filteredNBEtape = (savedfilteredNBEtapeListeGammes);
      console.log("Filtre récupéré étape: ", savedfilteredNBEtapeListeGammes);
    }
    
    
  }

  travaux:Travail[] = [];
    loadTravaux(): Promise<void> {
      return new Promise((resolve, reject) => {
        this.userService.getActiveTravaux().subscribe({
          next: (data: Travail[]) => {
            this.travaux = data;
            console.log("réponse de la requête getTravaux", this.travaux);
            resolve();
          },
          error: (err) => reject(err)
        });
      });
    }

 

  async loadEtapeDevis() {
  
    forkJoin({
      etapes: this.userService.getEtapesDevis()
    })
    .subscribe({
      next: (result) => {
        this.etapes = result.etapes;
        this.listOfDisplayData = [...this.etapes];
        console.log("réponse de la requette get_etapes_devis",this.etapes);
        this.doubleSearch()
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des get_etapes_devis', error);
      }
    });
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



listeComplete: EtapeItem[] = [
  { id: 1, travail_id:3, texte: "Travaux" },
  { id: 1, travail_id:3, texte: "Étape 1 (Dimensions)" },
  { id: 1, travail_id:4, texte: "Étape 3 (Gamme de produits)" },
  { id: 1, travail_id:5, texte: "Étape 2 (Etat de surfaces)" },
  { id: 2, travail_id:5, texte: "Recapitulatif" },
  { id: 3, travail_id:5, texte: "Finalisation" },
  
];



filteredNBListEtapes: string[] = [];
doubleSearch(): void {
  // Filtrer selon l'ID
  
    this.filteredNBListEtapes = this.listeComplete.map(item => item.texte);
  

  this.applyFilters();
}

listOfDisplayData :any;
applyFilters(): void {
  localStorage.setItem('filteredNBTravailIDListeGammes', this.filteredNBTravailID.toString());
  localStorage.setItem('filteredNBEtapeListeGammes', this.filteredNBEtape);
    this.listOfDisplayData = this.etapes.filter((item: EtapeDevis) => {
      const matchTravail = !this.filteredNBTravailID || (item.TravailID) === this.filteredNBTravailID;
      const matchEtape = !this.filteredNBEtape || item.Etape === this.filteredNBEtape;
      return matchTravail && matchEtape;
    });
  }


findIdByText(text: string): number | null {
  const item = this.listeComplete.find(item => item.texte === text);
  return item ? item.id : null;
}


}
