import { Component } from '@angular/core';
import { ArtisanFournisseurProjet } from '../../../../Models/ArtisanFournisseurProjet';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { Utilisateur } from '../../../../Models/Utilisateurs';
import { Title } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { ApiConceptsEtTravauxService } from '../../../../Services/api-concepts-et-travaux.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService } from '../../../../Services/auth.service';

@Component({
  selector: 'app-artisan-prestations',
  templateUrl: './artisan-prestations.component.html',
  styleUrl: './artisan-prestations.component.css'
})
export class ArtisanPrestationsComponent {

  search_term=''
  size: NzButtonSize = 'large';
  listOfColumn = [
    {
      title: 'Id',
      compare: (a: ArtisanFournisseurProjet, b: ArtisanFournisseurProjet) => a.Id - b.Id,
      priority: 3
    },
      {
      title: 'Projet',
      compare: (a: ArtisanFournisseurProjet, b: ArtisanFournisseurProjet) => (a?.Projet?.Nom ?? "").localeCompare(b?.Projet?.Nom ?? ""),
      priority: 2
    },
    
    {
      title: 'Tâche',
      compare: (a: ArtisanFournisseurProjet, b: ArtisanFournisseurProjet) => (a?.DevisTache?.Travail.Titre ?? "").localeCompare(b?.DevisTache?.Travail.Titre ?? ""),
      priority: 2
    },
    {
      title: 'Montant',
      compare: (a: ArtisanFournisseurProjet, b: ArtisanFournisseurProjet) => a.Montant -(b.Montant),
      priority: 1
    },
    {
      title: 'Avis clients',
      compare: (a: ArtisanFournisseurProjet, b: ArtisanFournisseurProjet) => (a.AvisClients??0)-(b.AvisClients??0),
      priority: 1
    },
    {
      title: 'Respect des délais',
      compare: (a: ArtisanFournisseurProjet, b: ArtisanFournisseurProjet) => (a.RespectDesDelais??0)-(b.RespectDesDelais??0),
      priority: 1
    },
    {
      title: 'Respect du prix',
      compare: (a: ArtisanFournisseurProjet, b: ArtisanFournisseurProjet) => (a.RespectDuPrix??0)-(b.RespectDuPrix??0),
      priority: 1
    },
    
  ];
  artisanFournisseurProjet:ArtisanFournisseurProjet[] = [];
  artisanFournisseurProjetFiltres: ArtisanFournisseurProjet[] = [];
  userId:number =  parseInt(this.route.snapshot.paramMap.get('id')??'0');
  user:Utilisateur | undefined



  constructor(private titleService: Title,private http: HttpClient,  private route: ActivatedRoute,private authService: AuthService,private message: NzMessageService,private userService: ApiConceptsEtTravauxService) { }

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id')??'0';
    this.titleService.setTitle('Liste des prestations');
    this.loadArtisanFournisseurProjets();
  
    
  }

  uid=0
  loadArtisanFournisseurProjets(): void {
    this.userService.getPrestationsByUser(this.userId)
      .subscribe((data: ArtisanFournisseurProjet[]) => {
        if(!this.isAdminorSuperAdmin()){
          this.artisanFournisseurProjet = data.filter(user => user.Id === this.uid);
          
        }else{
          this.artisanFournisseurProjet = data;
          console.log("réponse de la requette getArtisanFournisseurByUser",this.artisanFournisseurProjet)
        }
        this.user = this.artisanFournisseurProjet[0].Utilisateur
        console.log("réponse de la requette getArtisanFournisseurByUser ",this.uid,this.artisanFournisseurProjet)
        console.log("user ",this.user)
        this.artisanFournisseurProjetFiltres = [...this.artisanFournisseurProjet];
        ;
      });
      console.log("envoi de la requette getArtisanFournisseurByUser",this.artisanFournisseurProjet);
      
  }
  isAdminOrHim(id:number){

    return this.authService.isAdminOrHim(id)
  }
  isHimOrSuperAdmin(id:number){
    return this.authService.isHimOrSuperAdmin(id)
  }
  isAdminorSuperAdmin(){
    return this.authService.isAdminorSuperAdmin()
  }
  cancel(): void {
    this.message.info('suppression annulée');
  }
  



  onSearch(): void {
    const term = this.search_term.toLowerCase();

    this.artisanFournisseurProjetFiltres = this.artisanFournisseurProjet.filter(afp =>
      afp.NatureDesTravaux?.toLowerCase().includes(term) ||
      afp.Utilisateur.Nom?.toLowerCase().includes(term) ||
      afp.Utilisateur.Prenom?.toLowerCase().includes(term) ||
      afp.Projet?.Nom?.toLowerCase().includes(term) ||
      afp.Projet?.Description?.toLowerCase().includes(term)
    );
  }


  capitalize(value: string): string {

    if (!value) {
      return '';
    }

    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }

  
}
