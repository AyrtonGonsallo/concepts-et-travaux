import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';


@Injectable({
  providedIn: 'root'
})
export class IsNotArtisanGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router,private message: NzMessageService) {}

  canActivate(): boolean {
    if (this.authService.IsNotArtisan()) {
      return true;
    } else {
      this.message.info( `Vous n'avez pas assez de privilèges pour acceder à cette page`);
      return false;
    }
  }
}
