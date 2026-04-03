import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '../Services/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canMatch(): boolean | UrlTree {
    console.log('check canMatch');

    // ❌ non connecté
    if (!this.authService.isLoggedIn()) {
      return this.router.createUrlTree(['login']);
    }

    // ❌ session expirée
    if (this.authService.isSessionExpired()) {
      this.authService.logout();
      return this.router.createUrlTree(['login']);
    }

    // ✅ autorisé
    return true;
  }

   canActivate(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot,
  ): Observable<boolean> | Promise<boolean> | boolean {
    const user = this.authService.getCurrentUser();

    if (!user || !Object.keys(user).length) {
      console.log('not logged')
      this.router.navigate(['/blank']);
      return false;
    }else{
      console.log('logged',user)
    }

    return true;
  }
}
