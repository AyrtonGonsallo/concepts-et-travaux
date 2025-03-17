import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AuthService } from '../../../Services/auth.service';
import { ApiConceptsEtTravauxService } from '../../../Services/api-concepts-et-travaux.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Travail } from '../../../Models/Travail';

@Component({
  selector: 'app-tests-formules',
  templateUrl: './tests-formules.component.html',
  styleUrl: './tests-formules.component.css'
})
export class TestsFormulesComponent {

  panels = [
    {
      active: true,
      name: 'This is panel header 1',
      content:''
    },
    
  ];
  constructor(private http: HttpClient,private authService: AuthService,private message: NzMessageService,private userService: ApiConceptsEtTravauxService) { }

  travaux:Travail[] = [];
  ngOnInit(): void {
    this.loadTravaux();
  }

    loadTravaux(): void {
      this.userService.getTravaux()
        .subscribe((data: Travail[]) => {
          let data2 = data.filter(travail => travail.Valide === false);

          this.travaux = data2;
          console.log("réponse de la requette get_travail",this.travaux);
          let is_first = true
          let newpanels=[]
          for (let travail of data2) {
            newpanels.push({
              active: is_first,
              name: travail.ID+") "+travail.Titre,
              content:this.get_formule(travail.ID)
            })
            is_first = false
          }
          this.panels=newpanels
        });
        
        
        
    }

    get_formule(id_tache:number){
      let res=""
      switch (id_tache) {
        case 2:
          res= "Prix de dépose de l'élement \"meuble bas\": quantité (1) * prix de dépose (20 €) = 20 €\nPrix de dépose de l'élement \"Évier\": quantité (2) * prix de dépose (30 €) = 60 €\nPrix de dépose de l'élement \"Four\": quantité (0) * prix de dépose (25 €) = 0 €\nPrix de dépose de l'élement \"Meuble haut\": quantité (1) * prix de dépose (11 €) = 11 €\nPrix de dépose de l'élement \"Lave vaisselle\": quantité (0) * prix de dépose (12 €) = 0 €\nPrix de dépose de l'élement \"Lave linge\": quantité (3) * prix de dépose (15 €) = 45 €\nPrix de dépose de l'élement \"Frigo\": quantité (1) * prix de dépose (26 €) = 26 €\nPrix de pose de l'élement \"Meuble bas 3\": quantité (1) * prix (100 €) = 100 €\nPrix de pose de l'élement \"Modèle Robinetterie évier 1\": quantité (1) * prix (100 €) = 100 €\nPrix de pose de l'élement \"Gamme 1\": quantité (1) * prix (11 €) = 11 €\nPrix final = prix total (373 €) * Facteur global (1.25) = 466.25 €\n"
          break;
        case 3:
          res= "Prix du mur 1: surface (10.5 m²) * prix unitaire (38 €) = 399 €\nPrix du mur 2: surface (4.8 m²) * prix unitaire (39 €) = 187.2 €\nPrix de l'ouverture 1: surface (3.3 m²) * prix unitaire (39 €) = 128.7 €\nPrix de l'ouverture 2: surface (3.12 m²) * prix unitaire (38 €) = 118.56 €\nPrix final = prix total (833.46 €) * Facteur global (1.25) = 1041.83 €\n"
          break;
        case 4:
          res= "Prix du mur 1 = surface 6 m² * prix unitaire 10 € = 60 €\nPrix du mur 2 = surface 9.2 m² * prix unitaire 10 € = 92 €\nPrix du mur 3 = surface 5.25 m² * prix unitaire 10 € = 52.5 €\nPrix porte 1 = 1 * prix unitaire 18 € = 18 €\nPrix porte 2 = 1 * prix unitaire 23 € = 23 €\nPrix final = prix total (245.5 €) * Facteur global (1.25) = 306.88 €\n"
          break;
        case 5:
          res= "Prix de pose du mur 1: surface (12 m²) * prix de la gamme choisie \"Gamme test peint\" (9 €) = 108 €\nPrix de dépose du mur 1: surface (12 m²) * prix du revêtement à déposer \"Polystyrène\" (16 €) = 192 €\nPrix de pose du mur 2: surface (16.1 m²) * prix de la gamme choisie \"Papier-peint gamme 1\" (50 €) = 805.0000000000001 €\nPrix de dépose du mur 2: surface (16.1 m²) * prix du revêtement à déposer \"Carrelage\" (10 €) = 161 €\nPrix de pose du mur 3: surface (12.6 m²) * prix de la gamme choisie \"Carrelage gamme 2\" (300 €) = 3780 €\nPrix de dépose du mur 3: surface (12.6 m²) * prix du revêtement à déposer \"Papier peint\" (12 €) = 151.2 €\nPrix final = prix total (5197.2 €) * Facteur global (1.25) = 6496.50 €\n"
          break;
        case 8:
          res= "Prix de la pose = Surface (35 m²) * Prix de la gamme choisie \"Enduit décoratif gamme 1\" (98.5 €) = 3447.5 €\nPrix de la dépose = Surface (35 m²) * Prix de la gamme du revêtement à déposer \"Papier peint\" (11 €) = 385 €\nPrix final = prix total (3832.5 €) * Facteur global (1.25) = 4790.63 €\n"
          break;
        case 9:
          res= "Prix de pose = Surface (30 m²) * Prix de la gamme choisie \"Sol souple gamme 1\" (20 €) = 600 €\nPrix de dépose = Surface (30 m²) * Prix du revêtement à déposer \"Carrelage\" (20 €) = 600 €\nPrix de la pose de plinthes = Surface (30 m²) * Prix des plinthes \"Plinthes bois gamme 2\" (16 €) = 480 €\nPrix final = prix total (1680 €) * Facteur global (1.25) = 2100.00 €\n"
          break;
        case 10:
          res= "Prix de la porte 1 = Prix de la gamme de porte \"Gamme 2\" (18 €) + Prix de la nature de la porte \"Creuse\" (8 €) + Prix du type de porte \"120\" (13 €) = 39 €\nPrix de la porte 2 = Prix de la gamme de porte \"Gamme 1\" (10 €) + Prix de la nature de la porte \"Creuse\" (8 €) + Prix du type de porte \"60\" (12 €) = 30 €\nPrix de la porte 3 = Prix de la gamme de porte \"Gamme 3\" (16 €) + Prix de la nature de la porte \"Vitrée\" (11 €) + Prix du type de porte \"80\" (16 €) = 43 €\nPrix final = prix total (112 €) * Facteur global (1.25) = 140.00 €\n"
          break;
        case 12:
          res= "Prix du radiateur 1= Prix de la gamme choisie (Gamme 2) = 40 €\nPrix du radiateur 2= Prix de la gamme choisie (Gamme 1) = 20 €\nPrix du radiateur 3= Prix de la gamme choisie (Gamme 2) = 40 €\nPrix du radiateur 4= Prix de la gamme choisie (Gamme 1) = 20 €\nPrix final = prix total (120 €) * Facteur global (1.25) = 150.00 €\n"
          break;
        case 13:
          res= "Prix du remplacement de l'appareil \"Prise électrique\": nombre à remplacer (1) * 14 € = 14 € \nPrix de la création de l'appareil \"Plafonnier\": nombre à créer (2) * 5 € = 10 € \nPrix du remplacement de l'appareil \"Chauffage\": nombre à remplacer (2) * 14 € = 28 € \nPrix de la création de l'appareil \"Prise téléphone\": nombre à créer (2) * 5 € = 10 € \nPrix de la gamme \"Gamme d'appareillage 2\" = 1 * 240 € = 240 € \nPrix final = prix total (302 €) * Facteur global (1.25) = 377.50 €\n"
          break;
        case 15:
          res= "Prix renovation de chauffage: 1 * 6 € = 6 €\nPrix mise en sécurité: 1 * 8 € = 8 €\nPrix final = prix total (14 €) * Facteur global (1.25) = 17.50 €\n"
          break;
        case 16:
          res= "Prix de pose Gamme 2: 1 * prix de pose (6 €) = 6 €\nPrix de pose Modele Baignoire simple: 1 * prix de pose (100 €) = 100 €\nPrix de pose Gamme 1: 1 * prix de pose (22 €) = 22 €\nPrix de pose Meuble vasque gamme 2: 1 * prix de pose (12 €) = 12 €\nPrix de pose Gamme 1: 1 * prix de pose (11 €) = 11 €\nPrix de dépose Baignoire : 1 * prix de dépose (20 €) = 20 €\nPrix de dépose Receveur de douches : 1 * prix de dépose (20 €) = 20 €\nPrix final = prix total (191 €) * Facteur global (1.25) = 238.75 €\n"
          break;



        default:
          res= ""
          break;
      }
      return res.replaceAll("\n","<br>")

    }
}
