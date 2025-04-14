import { Component } from '@angular/core';
import { DevisTache } from '../../../../Models/DevisTache';
import { AuthService } from '../../../../Services/auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ApiConceptsEtTravauxService } from '../../../../Services/api-concepts-et-travaux.service';
import { HttpClient } from '@angular/common/http';
import { NzButtonSize } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-remplacement-de-portes-liste',
  templateUrl: './remplacement-de-portes-liste.component.html',
  styleUrl: './remplacement-de-portes-liste.component.css'
})
export class RemplacementDePortesListeComponent {
size: NzButtonSize = 'large';
  listOfColumn = [
    {
      title: 'ID',
      compare: (a: DevisTache, b: DevisTache) => a.ID - b.ID,
      priority: 3,
      order:null, 
    },
    
    {
      title: 'Prix',
      priority: 1,
      order:'descend', 
    }
  ];
  devis_pieces:DevisTache[] = [];

  constructor(private http: HttpClient,private authService: AuthService,private message: NzMessageService,private devis_pieceService: ApiConceptsEtTravauxService) { }

  ngOnInit(): void {
    this.loadDevisTaches();
   
  }
  
  loadDevisTaches(): void {
    this.devis_pieceService.get_devis_taches_by_travail(10)
      .subscribe((data: DevisTache[]) => {
        this.devis_pieces = data;
        console.log("envoi de la requette get_devis_pieces",this.devis_pieces); 
      })
  }
}

