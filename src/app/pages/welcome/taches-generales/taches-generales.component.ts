import { Component } from '@angular/core';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { TacheGenerale } from '../../../Models/TacheGenerale';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../Services/auth.service';
import { ApiConceptsEtTravauxService } from '../../../Services/api-concepts-et-travaux.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Travail } from '../../../Models/Travail';

@Component({
  selector: 'app-taches-generales',
  templateUrl: './taches-generales.component.html',
  styleUrl: './taches-generales.component.css'
})
export class TachesGeneralesComponent {
  size: NzButtonSize = 'large';
  listOfColumn = [
    {
      title: 'Id',
      compare: (a: TacheGenerale, b: TacheGenerale) => a.ID - b.ID,
      priority: 3
    },
   {
         title: 'Travail',
         compare: (a: TacheGenerale, b: TacheGenerale) => (this.get_travail_title(a.TravailID)??"").localeCompare(this.get_travail_title(b.TravailID)??""),
         priority: 1,
         order:null
       },
    {
      title: 'Label',
      compare: (a: TacheGenerale, b: TacheGenerale) => a.Label.localeCompare(b.Label),
      priority: 2
    },
    {
      title: 'Prix',
      compare: (a: TacheGenerale, b: TacheGenerale) => a.Prix-(b.Prix),
      priority: 1
    }
  ];
  tache_generale:TacheGenerale[] = [];
  listOfDisplayData:any
  constructor(private http: HttpClient,private authService: AuthService,private message: NzMessageService,private userService: ApiConceptsEtTravauxService) { }

  ngOnInit(): void {


    Promise.all([
      this.loadTacheGenerale(),
      this.loadTravaux()
    ]).then(() => {
      const savedFilter = localStorage.getItem('filteredTravailListeServices');
      if (savedFilter) {
        this.filteredTravail = savedFilter;
        console.log("Filtre récupéré: ", savedFilter);
      }
      this.search2();
    });
  }
 filteredTravail=""
  travaux:Travail[] = [];
  loadTravaux(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.userService.getTravaux().subscribe({
        next: (data: Travail[]) => {
          this.travaux = data;
          console.log("réponse de la requête get_travail", this.travaux);
          resolve();
        },
        error: (err) => reject(err)
      });
    });
  }
  
  loadTacheGenerale(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.userService.getTacheGenerales().subscribe({
        next: (data: TacheGenerale[]) => {
          this.tache_generale = data;
          this.listOfDisplayData = data;
          console.log("réponse de la requête get_tache_generale", this.tache_generale);
          resolve();
        },
        error: (err) => reject(err)
      });
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
  deleteTacheGenerale(id: number) {
    if (this.authService.isAdminorSuperAdmin()) {
      this.userService.deleteTacheGenerale(id).subscribe(
        () => {
          //console.log('TacheGenerale supprimé avec succès');
          this.message.success( 'Tâche générale supprimée avec succès');
          // Mettez ici le code pour actualiser la liste des tache_generale si nécessaire
          this.loadTacheGenerale();
        },
        (error) => {
          console.error('Erreur lors de la suppression de l\'utilisateur :', error);
          this.message.error( 'Erreur lors de la suppression de la tâche');
        }
      );
      return true
    } else {
      this.message.info( `Vous n'avez pas assez de privilèges pour acceder à cette tache`);
      return false;
    }
    
  }

  get_travail(id: number): Travail | undefined {
    return this.travaux.find(travail => travail.ID === id);
  }
  get_travail_title(id: number): string {
    const travail = this.travaux.find(travail => travail.ID === id);
    return travail ? travail.Titre : '';
  }
  
  
  searchValue = '';
  visible = false;
  reset(): void {
    this.searchValue = '';
    this.applyFilters();
  }

  search(): void {
    this.visible = false;
    this.applyFilters();
  }
  search2(): void {
    this.applyFilters();
  }
  applyFilters(): void {
    localStorage.setItem('filteredTravailListeServices', this.filteredTravail);
    this.listOfDisplayData = this.tache_generale.filter((item: TacheGenerale) => {
      const matchLabel = !this.searchValue || item.Label.toLowerCase().includes(this.searchValue.toLowerCase());
      const matchTravail = !this.filteredTravail || this.get_travail_title(item.TravailID) === this.filteredTravail;
      return matchLabel && matchTravail;
    });
  }
}
