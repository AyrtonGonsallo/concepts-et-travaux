import { Component } from '@angular/core';
import { Autorisation } from '../../../Models/Autorisations';
import { HttpClient } from '@angular/common/http';
interface DataItem {
  name: string;
  chinese: number;
  math: number;
  english: number;
}
@Component({
  selector: 'app-autorisations',
  templateUrl: './autorisations.component.html',
  styleUrl: './autorisations.component.css'
})
export class AutorisationsComponent {
  autorisations: Autorisation[] = [];
  listOfColumn = [
    {
      title: 'Id',
      compare: (a: Autorisation, b: Autorisation) => a.Id - b.Id,
      priority: 3
    },
    {
     title: 'Explications',
      compare: (a: Autorisation, b: Autorisation) => a.Explications.localeCompare(b.Explications),
      priority: 1
    },
    {
      title: 'Titre',
      compare: (a: Autorisation, b: Autorisation) => a.Titre.localeCompare(b.Titre),
      priority: false
    },
    {
      title: 'DateDeCreation',
      compare: (a: Autorisation, b: Autorisation) => {
        if (!a.DateDeCreation || !b.DateDeCreation) return 0;
        return a.DateDeCreation.getTime() - b.DateDeCreation.getTime();
      },
      priority: 2
    }
  ];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadAutorisations();
  }

  loadAutorisations(): void {
    this.http.get<Autorisation[]>('http://localhost:3000/get_autorisations')
      .subscribe((data: Autorisation[]) => {
        this.autorisations = data;
        console.log("réponse de la requette get_autorisations",this.autorisations);
      });
      console.log("envoi de la requette get_autorisations",this.autorisations);
  }
}