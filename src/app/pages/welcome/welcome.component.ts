import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  isCollapsed = true;
  user:any
  constructor(private auth:AuthService) { }
  conn_visible: boolean = false;

  conn_clickMe(): void {
    this.conn_visible = false;
  }

  conn_change(value: boolean): void {
    console.log(value);
  }
  ngOnInit() { 
    this.auth.getUser().subscribe(
      (user) => {
        console.log('Utilisateur récupéré:', user);
        this.user=user
      },
      (error) => {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      }
    );
    console.log("init welcome",this.user)
  }


  logout(){
    this.auth.logout()
  }

  isAdmin(){
    return this.auth.isAdmin()
  }
  isAdminorSuperAdmin(){
    return this.auth.isAdminorSuperAdmin()
  }
}
