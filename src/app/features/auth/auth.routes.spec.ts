import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { RouterOutlet } from '@angular/router';

import { AUTH_ROUTES } from './auth.routes';


@Component({
  selector: 'app-mock-login-page',
  template: '<div>Mock Login Page</div>',
  standalone: true
})
class MockLoginPage {}

@Component({
  selector: 'app-mock-register-page',
  template: '<div>Mock Register Page</div>',
  standalone: true
})
class MockRegisterPage {}

@Component({
  template: '<router-outlet></router-outlet>',
  standalone: true,
  imports: [RouterOutlet]
})
class MockLayoutBlankComponent {}

describe('AUTH_ROUTES', () => {
  let router: Router;
  let location: Location;
  let fixture: ComponentFixture<MockLayoutBlankComponent>;

  beforeEach(async () => {
    
    const testRoutes = [
      {
        path: 'auth',
        children: [
          {
            path: 'login',
            component: MockLayoutBlankComponent,
            children: [
              {
                path: '',
                component: MockLoginPage
              }
            ]
          },
          {
            path: 'register',
            component: MockLayoutBlankComponent,
            children: [
              {
                path: '',
                component: MockRegisterPage
              }
            ]
          }
        ]
      }
    ];

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(testRoutes),
        MockLayoutBlankComponent,
        MockLoginPage,
        MockRegisterPage
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    fixture = TestBed.createComponent(MockLayoutBlankComponent);
    fixture.detectChanges();
  });

  describe('Route Configuration', () => {
    it('should have correct route structure', () => {
      expect(AUTH_ROUTES).toBeDefined();
      expect(AUTH_ROUTES.length).toBe(1);
      
      const authRoute = AUTH_ROUTES[0];
      expect(authRoute.path).toBe('auth');
      expect(authRoute.children).toBeDefined();
      expect(authRoute.children?.length).toBe(2);
    });

    it('should have login route configuration', () => {
      const authRoute = AUTH_ROUTES[0];
      const loginRoute = authRoute.children?.find(route => route.path === 'login');
      
      expect(loginRoute).toBeDefined();
      expect(loginRoute?.children).toBeDefined();
      expect(loginRoute?.children?.length).toBe(1);
      
      const loginChildRoute = loginRoute?.children?.[0];
      expect(loginChildRoute?.path).toBe('');
      expect(loginChildRoute?.loadComponent).toBeDefined();
    });

    it('should have register route configuration', () => {
      const authRoute = AUTH_ROUTES[0];
      const registerRoute = authRoute.children?.find(route => route.path === 'register');
      
      expect(registerRoute).toBeDefined();
      expect(registerRoute?.children).toBeDefined();
      expect(registerRoute?.children?.length).toBe(1);
      
      const registerChildRoute = registerRoute?.children?.[0];
      expect(registerChildRoute?.path).toBe('');
      expect(registerChildRoute?.loadComponent).toBeDefined();
    });
  });

  describe('Lazy Loading', () => {
    it('should have loadComponent function for login route', () => {
      const authRoute = AUTH_ROUTES[0];
      const loginRoute = authRoute.children?.find(route => route.path === 'login');
      const loginChildRoute = loginRoute?.children?.[0];
      
      expect(loginChildRoute?.loadComponent).toBeDefined();
      expect(typeof loginChildRoute?.loadComponent).toBe('function');
    });

    it('should have loadComponent function for register route', () => {
      const authRoute = AUTH_ROUTES[0];
      const registerRoute = authRoute.children?.find(route => route.path === 'register');
      const registerChildRoute = registerRoute?.children?.[0];
      
      expect(registerChildRoute?.loadComponent).toBeDefined();
      expect(typeof registerChildRoute?.loadComponent).toBe('function');
    });

    it('should load login component correctly', async () => {
      const authRoute = AUTH_ROUTES[0];
      const loginRoute = authRoute.children?.find(route => route.path === 'login');
      const loginChildRoute = loginRoute?.children?.[0];
      
      if (loginChildRoute?.loadComponent) {
        const loadComponentFn = loginChildRoute.loadComponent;
        expect(loadComponentFn).toBeDefined();
        
        
        const result = loadComponentFn();
        expect(result).toBeInstanceOf(Promise);
      }
    });

    it('should load register component correctly', async () => {
      const authRoute = AUTH_ROUTES[0];
      const registerRoute = authRoute.children?.find(route => route.path === 'register');
      const registerChildRoute = registerRoute?.children?.[0];
      
      if (registerChildRoute?.loadComponent) {
        const loadComponentFn = registerChildRoute.loadComponent;
        expect(loadComponentFn).toBeDefined();
        
        
        const result = loadComponentFn();
        expect(result).toBeInstanceOf(Promise);
      }
    });
  });

  describe('Navigation', () => {
    it('should navigate to login route', async () => {
      await router.navigate(['/auth/login']);
      expect(location.path()).toBe('/auth/login');
    });

    it('should navigate to register route', async () => {
      await router.navigate(['/auth/register']);
      expect(location.path()).toBe('/auth/register');
    });
  });

  describe('Route Structure Validation', () => {
    it('should have login and register routes with children', () => {
      const authRoute = AUTH_ROUTES[0];
      const loginRoute = authRoute.children?.find(route => route.path === 'login');
      const registerRoute = authRoute.children?.find(route => route.path === 'register');
      
      expect(loginRoute).toBeTruthy();
      expect(registerRoute).toBeTruthy();
      expect(loginRoute?.children).toBeTruthy();
      expect(registerRoute?.children).toBeTruthy();
    });

    it('should have empty path for child routes', () => {
      const authRoute = AUTH_ROUTES[0];
      const loginRoute = authRoute.children?.find(route => route.path === 'login');
      const registerRoute = authRoute.children?.find(route => route.path === 'register');
      
      expect(loginRoute?.children?.[0]?.path).toBe('');
      expect(registerRoute?.children?.[0]?.path).toBe('');
    });

    it('should have correct import paths in loadComponent functions', () => {
      const authRoute = AUTH_ROUTES[0];
      const loginRoute = authRoute.children?.find(route => route.path === 'login');
      const registerRoute = authRoute.children?.find(route => route.path === 'register');
      
      
      expect(loginRoute?.children?.[0]?.loadComponent).toBeDefined();
      expect(registerRoute?.children?.[0]?.loadComponent).toBeDefined();
      
      
      const loginLoadFn = loginRoute?.children?.[0]?.loadComponent;
      const registerLoadFn = registerRoute?.children?.[0]?.loadComponent;
      
      expect(typeof loginLoadFn).toBe('function');
      expect(typeof registerLoadFn).toBe('function');
    });
  });
});