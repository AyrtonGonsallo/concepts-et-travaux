import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { AuthService } from '../Services/auth.service';

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
}
