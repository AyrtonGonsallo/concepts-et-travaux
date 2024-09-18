import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  isCollapsed = true;
  constructor(private auth:AuthService) { }

  ngOnInit() { }

  logout(){
    this.auth.logout()
  }

  isAdmin(){
    return this.auth.isAdmin()
  }
}
