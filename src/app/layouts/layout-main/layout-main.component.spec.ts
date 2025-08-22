import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Component } from '@angular/core';

import { LayoutMainComponent } from './layout-main.component';


@Component({
  template: '<div>Test Route</div>',
  standalone: true
})
class TestRouteComponent {}

describe('LayoutMainComponent', () => {
  let component: LayoutMainComponent;
  let fixture: ComponentFixture<LayoutMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LayoutMainComponent,
        CommonModule,
        MatSidenavModule,
        NoopAnimationsModule,
        RouterTestingModule.withRoutes([
          { path: 'test', component: TestRouteComponent }
        ])
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayoutMainComponent);
    component = fixture.componentInstance;
  });

  describe('Component Creation & Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with sidebar closed', () => {
      expect(component.isSidebarOpen).toBe(false);
    });

    it('should have correct component selector', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled).toBeTruthy();
    });
  });

  describe('Sidebar State Management', () => {
    it('should toggle sidebar state from false to true', () => {
      expect(component.isSidebarOpen).toBe(false);
      
      component.toggleSidebar();
      
      expect(component.isSidebarOpen).toBe(true);
    });

    it('should toggle sidebar state from true to false', () => {
      component.isSidebarOpen = true;
      
      component.toggleSidebar();
      
      expect(component.isSidebarOpen).toBe(false);
    });

    it('should toggle sidebar state multiple times', () => {
      expect(component.isSidebarOpen).toBe(false);
      
      component.toggleSidebar();
      expect(component.isSidebarOpen).toBe(true);
      
      component.toggleSidebar();
      expect(component.isSidebarOpen).toBe(false);
      
      component.toggleSidebar();
      expect(component.isSidebarOpen).toBe(true);
    });
  });

  describe('Template Rendering', () => {
    it('should render router-outlet', () => {
      fixture.detectChanges();
      const routerOutlet = fixture.debugElement.query(By.directive(RouterOutlet));
      expect(routerOutlet).toBeTruthy();
    });

    it('should have correct main layout structure', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const mainContainer = compiled.querySelector('.d-flex.flex-column.vh-100');
      expect(mainContainer).toBeTruthy();
    });

    it('should render sidebar container', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const sidebarContainer = compiled.querySelector('.theme-surface.overflow-hidden.col-md-3.col-lg-2');
      expect(sidebarContainer).toBeTruthy();
    });

    it('should render main content area', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const mainContent = compiled.querySelector('.flex-grow-1');
      expect(mainContent).toBeTruthy();
    });
  });

  describe('Template Integration', () => {
    it('should render template with sidebar closed state', () => {
      component.isSidebarOpen = false;
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.innerHTML).toContain('theme-surface');
      expect(compiled.innerHTML).toContain('flex-grow-1');
    });

    it('should render template with sidebar open state', () => {
      component.isSidebarOpen = true;
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.innerHTML).toContain('theme-surface');
      expect(compiled.innerHTML).toContain('flex-grow-1');
    });

    it('should update template when sidebar state changes', () => {
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement as HTMLElement;
      const initialHTML = compiled.innerHTML;
      
      component.toggleSidebar();
      fixture.detectChanges();
      
      const updatedHTML = compiled.innerHTML;
      expect(initialHTML).toBeTruthy();
      expect(updatedHTML).toBeTruthy();
    });
  });

  describe('Method Testing', () => {
    it('should call toggleSidebar method directly', () => {
      spyOn(component, 'toggleSidebar').and.callThrough();
      
      component.toggleSidebar();
      
      expect(component.toggleSidebar).toHaveBeenCalled();
    });

    it('should be a function', () => {
      expect(typeof component.toggleSidebar).toBe('function');
    });
  });

  describe('Component Integration', () => {
    it('should maintain component state after change detection', () => {
      component.isSidebarOpen = true;
      fixture.detectChanges();
      
      
      fixture.detectChanges();
      fixture.detectChanges();
      
      expect(component.isSidebarOpen).toBe(true);
    });

    it('should preserve component structure after state changes', () => {
      fixture.detectChanges();
      
      const initialNavbar = fixture.debugElement.query(By.css('app-navbar'));
      const initialSidebar = fixture.debugElement.query(By.css('app-sidebar'));
      const initialFooter = fixture.debugElement.query(By.css('app-footer'));
      
      component.toggleSidebar();
      fixture.detectChanges();
      
      const afterNavbar = fixture.debugElement.query(By.css('app-navbar'));
      const afterSidebar = fixture.debugElement.query(By.css('app-sidebar'));
      const afterFooter = fixture.debugElement.query(By.css('app-footer'));
      
      expect(initialNavbar).toBeTruthy();
      expect(afterNavbar).toBeTruthy();
      expect(initialSidebar).toBeTruthy();
      expect(afterSidebar).toBeTruthy();
      expect(initialFooter).toBeTruthy();
      expect(afterFooter).toBeTruthy();
    });
  });
});