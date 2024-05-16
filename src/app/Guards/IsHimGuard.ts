import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';


@Injectable({
  providedIn: 'root'
})
export class IsHimGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router,private message: NzMessageService) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    // Récupérer le paramètre de l'URL
    const idString = route.paramMap.get('id');
const id = idString ? parseInt(idString, 10) : 1;
    if (this.authService.isHim( id)) {
      return true;
    } else {
      this.message.info( `Vous n'avez pas assez de privilèges pour acceder à cette page et/ou ce n'est pas votre compte`);
      return false;
    }
  }
}
