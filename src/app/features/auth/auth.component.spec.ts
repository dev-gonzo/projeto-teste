import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router, RouterOutlet } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { SeoService } from '../../core/services';
import { routes as authRoutes } from './auth.routes';
import { AuthComponent } from './auth.component';

class MockSeoService {
  setMetaDescription(content: string) {}
  setMetaTitle(title: string) {}
}

@Component({ standalone: true, selector: 'dummy-login', template: '' })
class DummyLoginComponent {}

@Component({ standalone: true, selector: 'dummy-create-password', template: '' })
class DummyCreatePasswordComponent {}

@Component({ standalone: true, selector: 'dummy-primeiro-acesso', template: '' })
class DummyPrimeiroAcessoComponent {}

@Component({ standalone: true, selector: 'dummy-validate-email', template: '' })
class DummyValidateEmailComponent {}

@Component({ standalone: true, selector: 'dummy-validar-token', template: '' })
class DummyValidateTokenComponent {}

@Component({ standalone: true, selector: 'dummy-recover-pass', template: '' })
class DummyRecoverPassComponent {}

describe('AuthComponent', () => {
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;
  let seoService: SeoService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthComponent, RouterTestingModule],
      providers: [{ provide: SeoService, useClass: MockSeoService }],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthComponent);
    component = fixture.componentInstance;
    seoService = TestBed.inject(SeoService);
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve chamar os métodos do SeoService ao ser inicializado', () => {
    const descSpy = spyOn(seoService, 'setMetaDescription');
    const titleSpy = spyOn(seoService, 'setMetaTitle');

    fixture.detectChanges();

    expect(descSpy).toHaveBeenCalledWith('Aplicação web Portal de Mídias');
    expect(titleSpy).toHaveBeenCalledWith('Página de Autenticação');
  });

  it('deve ter um router-outlet em seu template', () => {
    const element: HTMLElement = fixture.nativeElement;
    const routerOutlet = element.querySelector('router-outlet');
    expect(routerOutlet).not.toBeNull();
  });
});

describe('Auth Routing', () => {
  let router: Router;
  let location: Location;
  let fixture: ComponentFixture<AuthComponent>;

  beforeEach(async () => {
    const testRoutes = authRoutes[0].children?.map(route => {
      if (route.path === 'login' || route.path === '**') return { path: route.path, component: DummyLoginComponent };
      if (route.path === 'criar-senha') return { path: route.path, component: DummyCreatePasswordComponent };
      if (route.path === 'primeiro-acesso') return { path: route.path, component: DummyPrimeiroAcessoComponent };
      if (route.path === 'validar-email') return { path: route.path, component: DummyValidateEmailComponent };
      if (route.path === 'validar-token') return { path: route.path, component: DummyValidateTokenComponent };
      if (route.path === 'recuperar-senha') return { path: route.path, component: DummyRecoverPassComponent };
      return route;
    });

    await TestBed.configureTestingModule({
      imports: [
        AuthComponent,
        DummyLoginComponent,
        DummyCreatePasswordComponent,
        DummyPrimeiroAcessoComponent,
        DummyValidateEmailComponent,
        DummyValidateTokenComponent,
        DummyRecoverPassComponent,
        RouterTestingModule.withRoutes([
            {
                path: '',
                component: AuthComponent,
                children: testRoutes
            }
        ]),
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    fixture = TestBed.createComponent(AuthComponent);
    router.initialNavigation();
  });

  it('deve navegar para /login', fakeAsync(() => {
    router.navigate(['/auth/login']);
    tick();
    expect(location.path()).toBe('/auth/login');
  }));

  it('deve navegar para /criar-senha', fakeAsync(() => {
    router.navigate(['/criar-senha']);
    tick();
    expect(location.path()).toBe('/criar-senha');
  }));

  it('deve navegar para /primeiro-acesso', fakeAsync(() => {
    router.navigate(['/primeiro-acesso']);
    tick();
    expect(location.path()).toBe('/primeiro-acesso');
  }));

  it('deve navegar para /validar-email', fakeAsync(() => {
    router.navigate(['/validar-email']);
    tick();
    expect(location.path()).toBe('/validar-email');
  }));

  it('deve navegar para /validar-token', fakeAsync(() => {
    router.navigate(['/validar-token']);
    tick();
    expect(location.path()).toBe('/validar-token');
  }));

  it('deve navegar para /recuperar-senha', fakeAsync(() => {
    router.navigate(['/recuperar-senha']);
    tick();
    expect(location.path()).toBe('/recuperar-senha');
  }));
  
  it('deve redirecionar para /login em uma rota desconhecida', fakeAsync(() => {
    router.navigate(['/rota-que-nao-existe']);
    tick();
    expect(location.path()).toBe('/auth/login');
  }));
});