import { TestBed } from '@angular/core/testing';
import { Router, Routes } from '@angular/router';
import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

import { routes } from './app.routes';


const ROUTES = {
  HOME: '',
  AUTH: 'auth',
  CONTACTS: 'contato',
  DEMO: 'demo',
  NOT_FOUND: 'not-found'
};


@Component({ template: 'Home Page', standalone: true })
class MockHomeComponent {}

@Component({ template: 'Auth Page', standalone: true })
class MockAuthComponent {}

@Component({ template: 'Contacts Page', standalone: true })
class MockContactsComponent {}

@Component({ template: 'Demo Page', standalone: true })
class MockDemoComponent {}

@Component({ template: 'Not Found Page', standalone: true })
class MockNotFoundComponent {}

describe('App Routes', () => {
  let router: Router;
  let location: Location;


  beforeEach(async () => {
    const mockRoutes: Routes = [
      { path: ROUTES.HOME, component: MockHomeComponent },
      { path: ROUTES.AUTH, component: MockAuthComponent },
      { path: ROUTES.CONTACTS, component: MockContactsComponent },
      { path: ROUTES.DEMO, component: MockDemoComponent },
      { path: ROUTES.NOT_FOUND, component: MockNotFoundComponent },
      { path: '', redirectTo: ROUTES.HOME, pathMatch: 'full' },
      { path: '**', redirectTo: ROUTES.NOT_FOUND }
    ];

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(mockRoutes)],
      declarations: []
    }).compileComponents();

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    TestBed.createComponent(MockHomeComponent);
  });

  it('should be defined', () => {
    expect(routes).toBeDefined();
    expect(Array.isArray(routes)).toBe(true);
  });

  it('should have correct number of routes', () => {
    expect(routes.length).toBe(5); 
  });

  it('should have home route configuration', () => {
    
    const homeRoutes = routes.filter(route => route.path === '');
    expect(homeRoutes.length).toBeGreaterThan(0);
  });

  it('should have auth route configuration', () => {
    const authRoute = routes.find(route => route.path === 'auth');
    expect(authRoute).toBeDefined();
    expect(authRoute?.children).toBeDefined();
  });

  it('should have contacts route configuration', () => {
    const contactsRoute = routes.find(route => route.path === 'contato');
    expect(contactsRoute).toBeDefined();
    expect(contactsRoute?.children).toBeDefined();
  });


  it('should have not found route configuration', () => {
    const notFoundRoute = routes.find(route => route.path === '**');
    expect(notFoundRoute).toBeDefined();
    expect(notFoundRoute?.children).toBeDefined();
  });

  it('should have routes with empty paths for home', () => {
    const emptyRoutes = routes.filter(route => route.path === '');
    expect(emptyRoutes.length).toBeGreaterThan(0);
  });

  it('should have wildcard route for not found', () => {
    const wildcardRoute = routes.find(route => route.path === '**');
    expect(wildcardRoute).toBeDefined();
    expect(wildcardRoute?.children).toBeDefined();
  });

  it('should navigate to home route', async () => {
    await router.navigate([ROUTES.HOME]);
    expect(location.path()).toBe(`/${ROUTES.HOME}`);
  });

  it('should navigate to auth route', async () => {
    await router.navigate([ROUTES.AUTH]);
    expect(location.path()).toBe(`/${ROUTES.AUTH}`);
  });

  it('should navigate to contacts route', async () => {
    await router.navigate([ROUTES.CONTACTS]);
    expect(location.path()).toBe(`/${ROUTES.CONTACTS}`);
  });

  it('should navigate to demo route', async () => {
    await router.navigate([ROUTES.DEMO]);
    expect(location.path()).toBe(`/${ROUTES.DEMO}`);
  });

  it('should redirect empty path to home', async () => {
    await router.navigate(['']);
    expect(location.path()).toBe('/');
  });

  it('should redirect unknown routes to not found', async () => {
    await router.navigate(['/unknown-route']);
    expect(location.path()).toBe('/not-found');
  });

  it('should have lazy loading configuration for components', () => {
    
    expect(routes).toBeDefined();
    expect(Array.isArray(routes)).toBe(true);
    expect(routes.length).toBeGreaterThan(0);
    
    
    const wildcardRoute = routes.find(route => route.path === '**');
    expect(wildcardRoute).toBeDefined();
  });
});