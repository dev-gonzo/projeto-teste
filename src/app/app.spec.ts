import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Component, signal } from '@angular/core';
import { By } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';

import { AppComponent } from './app';
import { ToastComponent } from './shared/components/toast/toast.component';
import { ThemeState } from './design/theme/theme.state';
import { ThemeMode, FontSize } from './design/theme/theme.types';


@Component({
  selector: 'app-toast',
  template: '<div class="toast-mock">Toast Component</div>',
  standalone: true
})
class MockToastComponent {}


class MockThemeState {
  private _theme = signal('light' as ThemeMode);
  private _fontSize = signal('md' as FontSize);
  
  readonly theme = this._theme.asReadonly();
  readonly fontSize = this._fontSize.asReadonly();
  
  setTheme = jasmine.createSpy('setTheme');
  setFontSize = jasmine.createSpy('setFontSize');
  adjustFontSize = jasmine.createSpy('adjustFontSize');
  toggleTheme = jasmine.createSpy('toggleTheme');
  resetFontSize = jasmine.createSpy('resetFontSize');
}

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let mockThemeState: MockThemeState;

  beforeEach(async () => {
    mockThemeState = new MockThemeState();

    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        RouterTestingModule,
        MockToastComponent
      ],
      providers: [
        { provide: ThemeState, useValue: mockThemeState }
      ]
    })
    .overrideComponent(AppComponent, {
      remove: { imports: [ToastComponent] },
      add: { imports: [MockToastComponent] }
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have app-root selector', () => {
    
    expect(AppComponent).toBeDefined();
    const componentDef = (AppComponent as unknown as { ɵcmp: { selectors: string[][] } }).ɵcmp;
    expect(componentDef.selectors[0][0]).toBe('app-root');
  });

  it('should render router-outlet', () => {
    fixture.detectChanges();
    const routerOutlet = fixture.debugElement.query(By.directive(RouterOutlet));
    expect(routerOutlet).toBeTruthy();
  });

  it('should render toast component', () => {
    fixture.detectChanges();
    const toastComponent = fixture.debugElement.query(By.css('app-toast'));
    expect(toastComponent).toBeTruthy();
  });

  it('should inject ThemeState service', () => {
    expect(component['_theme']).toBeDefined();
    expect(component['_theme']).toBe(mockThemeState);
  });

  it('should have correct template structure', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    
    
    const routerOutlet = compiled.querySelector('router-outlet');
    expect(routerOutlet).toBeTruthy();
    
    
    const toastComponent = compiled.querySelector('app-toast');
    expect(toastComponent).toBeTruthy();
  });

  it('should be a standalone component', () => {
    
    expect(AppComponent).toBeDefined();
    
    const componentDef = (AppComponent as unknown as { ɵcmp: { standalone: boolean } }).ɵcmp;
    expect(componentDef).toBeDefined();
    expect(componentDef.standalone).toBe(true);
  });

  it('should import RouterOutlet and ToastComponent', () => {
    
    fixture.detectChanges();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should handle theme state injection without errors', () => {
    expect(() => {
      fixture.detectChanges();
    }).not.toThrow();
    
    expect(component['_theme']).toBe(mockThemeState);
  });

  it('should render template without errors', () => {
    expect(() => {
      fixture.detectChanges();
    }).not.toThrow();
    
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.innerHTML).toContain('router-outlet');
    expect(compiled.innerHTML).toContain('app-toast');
  });

  it('should maintain component structure after change detection', () => {
    fixture.detectChanges();
    
    
    fixture.detectChanges();
    fixture.detectChanges();
    
    const routerOutlet = fixture.debugElement.query(By.directive(RouterOutlet));
    const toastComponent = fixture.debugElement.query(By.css('app-toast'));
    
    expect(routerOutlet).toBeTruthy();
    expect(toastComponent).toBeTruthy();
  });
});