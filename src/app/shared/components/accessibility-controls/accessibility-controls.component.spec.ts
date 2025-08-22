import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { signal } from '@angular/core';

import { AccessibilityControlsComponent } from './accessibility-controls.component';
import { ThemeState } from '@app/design/theme/theme.state';
import { ThemeMode, FontSize } from '@app/design/theme/theme.types';

class MockThemeState {
  private _theme = signal<ThemeMode>('light');
  private _fontSize = signal<FontSize>('md');

  readonly theme = this._theme.asReadonly();
  readonly fontSize = this._fontSize.asReadonly();

  setTheme = jasmine.createSpy('setTheme');
  toggleTheme = jasmine.createSpy('toggleTheme');
  setFontSize = jasmine.createSpy('setFontSize');
  adjustFontSize = jasmine.createSpy('adjustFontSize');
  resetFontSize = jasmine.createSpy('resetFontSize');
}

describe('AccessibilityControlsComponent', () => {
  let component: AccessibilityControlsComponent;
  let fixture: ComponentFixture<AccessibilityControlsComponent>;
  let mockThemeState: MockThemeState;

  beforeEach(async () => {
    mockThemeState = new MockThemeState();

    await TestBed.configureTestingModule({
      imports: [
        AccessibilityControlsComponent,
        MatIconModule
      ],
      providers: [
        { provide: ThemeState, useValue: mockThemeState }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AccessibilityControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should inject ThemeState', () => {
    expect(component.theme).toBe(mockThemeState);
  });

  describe('toggleTheme', () => {
    it('should call theme.toggleTheme', () => {
      component.toggleTheme();
      expect(mockThemeState.toggleTheme).toHaveBeenCalled();
    });
  });

  describe('increaseFont', () => {
    it('should call theme.adjustFontSize with increase parameter', () => {
      component.increaseFont();
      expect(mockThemeState.adjustFontSize).toHaveBeenCalledWith('increase');
    });
  });

  describe('decreaseFont', () => {
    it('should call theme.adjustFontSize with decrease parameter', () => {
      component.decreaseFont();
      expect(mockThemeState.adjustFontSize).toHaveBeenCalledWith('decrease');
    });
  });

  describe('resetFont', () => {
    it('should call theme.resetFontSize', () => {
      component.resetFont();
      expect(mockThemeState.resetFontSize).toHaveBeenCalled();
    });
  });

  describe('Component Configuration', () => {
    it('should be a standalone component', () => {
      const componentDef = (AccessibilityControlsComponent as unknown as { ɵcmp: { standalone: boolean } }).ɵcmp;
      expect(componentDef.standalone).toBe(true);
    });

    it('should have correct selector', () => {
      const componentDef = (AccessibilityControlsComponent as unknown as { ɵcmp: { selectors: string[][] } }).ɵcmp;
      expect(componentDef.selectors[0][0]).toBe('app-accessibility-controls');
    });

    it('should import MatIconModule', () => {
      expect(() => fixture.detectChanges()).not.toThrow();
    });
  });

  describe('Template Integration', () => {
    it('should render without errors', () => {
      expect(() => {
        fixture.detectChanges();
      }).not.toThrow();
    });

    it('should maintain component state after change detection', () => {
      fixture.detectChanges();
      fixture.detectChanges();
      
      expect(component.theme).toBe(mockThemeState);
    });
  });
});