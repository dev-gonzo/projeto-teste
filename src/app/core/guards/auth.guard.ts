import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { AuthService } from '../services';
import { isPermissaoPerfil, PermissaoPerfil, RotasPermitidasPorPerfil } from '../../shared/models';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    return this.checkAccess(route);
  }

  private checkAccess(route: ActivatedRouteSnapshot): boolean {
    if (!this.authService.isAuthenticatedUser()) {
      this.router.navigate(['/auth/login']);
      return false;
    }

    const perfil = this.authService.getPermissaoPerfil();
    const rotaAtual = route.routeConfig?.path;

    if (!perfil || !rotaAtual || !this.perfilTemAcesso(perfil, rotaAtual)) {
      this.router.navigate(['/nao-autorizado']);
      return false;
    }

    return true;
  }
  

  private perfilTemAcesso(perfil: string | null, rota: string): boolean {
    if (!isPermissaoPerfil(perfil)) {
      console.warn(`Perfil inválido: ${perfil}`);
      return false;
    }
    const permissoes = RotasPermitidasPorPerfil[perfil] || [];
    return permissoes.includes(rota);
  }

}
