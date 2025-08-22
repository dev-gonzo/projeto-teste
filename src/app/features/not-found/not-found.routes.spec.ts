import { TestBed } from '@angular/core/testing';
import { RouterOutlet } from '@angular/router';
import { Component } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { NOT_FOUND_ROUTES } from './not-found.routes';
import { LayoutBlankComponent } from '@app/layouts/layout-blank/layout-blank.component';


@Component({
  template: '<div>Mock Layout Blank</div>',
  standalone: true
})
class MockLayoutBlankComponent {}

@Component({
  template: '<router-outlet></router-outlet>',
  standalone: true,
  imports: [RouterOutlet]
})
class _TestHostComponent {}

describe('NOT_FOUND_ROUTES', () => {

  beforeEach(async () => {
    const faIconLibrarySpy = jasmine.createSpyObj('FaIconLibrary', [
      'addIcons', 
      'getIconDefinition',
      'addIconPacks',
      'addIcon'
    ]);
    
    faIconLibrarySpy.getIconDefinition.and.returnValue({
      prefix: 'fas',
      iconName: 'exclamation-triangle',
      icon: [512, 512, [], 'f071', 'M256 40c118.621 0 216 96.075 216 216 0 119.291-96.61 216-216 216-119.244 0-216-96.562-216-216 0-119.203 96.602-216 216-216M119.107 206.107l-14.5 87c-.231 1.39.69 2.893 2.08 2.893h158.626c1.39 0 2.311-1.502 2.08-2.893l-14.5-87c-.231-1.39-1.311-2.107-2.7-2.107H121.807c-1.39 0-2.469.717-2.7 2.107zM256 352c17.673 0 32-14.327 32-32s-14.327-32-32-32-32 14.327-32 32 14.327 32 32 32z']
    });
    faIconLibrarySpy.addIcons.and.stub();
    faIconLibrarySpy.addIconPacks.and.stub();
    faIconLibrarySpy.addIcon.and.stub();

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(NOT_FOUND_ROUTES),
        FontAwesomeModule
      ],
      providers: [
        { provide: LayoutBlankComponent, useClass: MockLayoutBlankComponent },
        { provide: FaIconLibrary, useValue: faIconLibrarySpy }
      ]
    }).compileComponents();

    
  });

  it('should be defined', () => {
    expect(NOT_FOUND_ROUTES).toBeDefined();
  });

  it('should have correct structure', () => {
    expect(NOT_FOUND_ROUTES).toBeInstanceOf(Array);
    expect(NOT_FOUND_ROUTES.length).toBe(1);
  });

  it('should have wildcard route configuration', () => {
    const wildcardRoute = NOT_FOUND_ROUTES[0];
    expect(wildcardRoute.path).toBe('**');
    expect(wildcardRoute.children).toBeDefined();
  });

  it('should have lazy loaded NotFoundPage component', async () => {
    const leafRoute = NOT_FOUND_ROUTES[0].children?.[0].children?.[0];
    expect(leafRoute?.loadComponent).toBeDefined();

    if (leafRoute?.loadComponent) {
      const module = await leafRoute.loadComponent();
      expect(typeof module).toBe('function');
    }
  });
});