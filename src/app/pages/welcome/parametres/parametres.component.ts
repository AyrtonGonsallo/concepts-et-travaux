import { Component } from '@angular/core';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { AuthService } from '../../../Services/auth.service';
import { HttpClient } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ApiConceptsEtTravauxService } from '../../../Services/api-concepts-et-travaux.service';
import { Parametre } from '../../../Models/Parametre';
import { Tva } from '../../../Models/Tva';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-parametres',
  templateUrl: './parametres.component.html',
  styleUrl: './parametres.component.css'
})
export class ParametresComponent {
size: NzButtonSize = 'large';
  listOfColumn = [
    {
      title: 'Id',
      compare: (a: Parametre, b: Parametre) => a.ID - b.ID,
      priority: 3
    },
   
    {
      title: 'Nom',
      compare: (a: Parametre, b: Parametre) => a.Nom.localeCompare(b.Nom),
      priority: 2
    },
    {
      title: 'Valeur',
      compare: (a: Parametre, b: Parametre) => a.Valeur-(b.Valeur),
      priority: 1
    },
    {
      title: 'Type',
      compare: (a: Parametre, b: Parametre) => a.Type.localeCompare(b.Type),
      priority: 1
    },
    
  ];
  tache_generale:Parametre[] = [];
  listOfDisplayData:any
  constructor(private titleService: Title,private http: HttpClient,private authService: AuthService,private message: NzMessageService,private userService: ApiConceptsEtTravauxService) { }

  ngOnInit(): void {
    this.titleService.setTitle('Liste des paramètres');
    this.loadParametre();
    this.loadTva();
  }

  loadParametre(): void {
    this.userService.getParametres()
      .subscribe((data: Parametre[]) => {
        this.tache_generale = data;
        this.listOfDisplayData=data
        console.log("réponse de la requette get_tache_generale",this.tache_generale);
      });
      console.log("envoi de la requette get_tache_generale",this.tache_generale);
      
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
 deleteParametre(id: number) {
    if (this.authService.isAdminorSuperAdmin()) {
      this.userService.deleteParametre(id).subscribe(
        () => {
          //console.log('Parametre supprimé avec succès');
          this.message.success( 'Parametre supprimé avec succès');
          // Mettez ici le code pour actualiser la liste des tache_generale si nécessaire
          this.loadParametre();
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
 

  
    searchValue = '';
    visible = false;
    reset(): void {
      this.searchValue = '';
      this.search();
    }
  
    search(): void {
      this.visible = false;
      this.listOfDisplayData = this.tache_generale.filter((item: Parametre) => item.Nom.indexOf(this.searchValue) !== -1);
    }

    //parametres tva

    listOfColumn2 = [
    {
      title: 'Id',
      compare: (a: Tva, b: Tva) => a.ID - b.ID,
      priority: 3
    },
    {
      title: 'Valeur',
      compare: (a: Tva, b: Tva) => a.Valeur-(b.Valeur),
      priority: 1
    },
    {
      title: 'Commentaire',
      compare: (a: Tva, b: Tva) => (a.Commentaire??'').localeCompare((b.Commentaire??'')),
      priority: 2
    },
    {
      title: 'Defaut',
      priority: 2,
      compare:null
    },
    
  ];
  tvas:Tva[] = [];
  listOfDisplayData2:any

  deleteTva(id: number){
    if (this.authService.isAdminorSuperAdmin()) {
      this.userService.deleteTva(id).subscribe(
        () => {
          //console.log('Parametre supprimé avec succès');
          this.message.success( 'Parametre supprimé avec succès');
          // Mettez ici le code pour actualiser la liste des tache_generale si nécessaire
          this.loadTva();
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

  loadTva(): void {
    this.userService.getAllTva()
      .subscribe((data: Tva[]) => {
        this.tvas = data;
        this.listOfDisplayData2=data
        console.log("réponse de la requette tvas",this.tvas);
      });
      console.log("envoi de la requette tvas",this.tvas);
      
  }
}

