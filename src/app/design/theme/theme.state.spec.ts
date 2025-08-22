import { TestBed } from '@angular/core/testing';
import { ThemeState } from './theme.state';
import { ThemeMode, FontSize } from './theme.types';

describe('ThemeState', () => {
  let service: ThemeState;
  let mockLocalStorage: { [key: string]: string };
  let mockDocumentElement: jasmine.SpyObj<HTMLElement>;

  beforeEach(() => {
    
    mockLocalStorage = {};
    spyOn(localStorage, 'getItem').and.callFake((key: string) => mockLocalStorage[key] || null);
    spyOn(localStorage, 'setItem').and.callFake((key: string, value: string) => {
      mockLocalStorage[key] = value;
    });
    spyOn(localStorage, 'removeItem').and.callFake((key: string) => {
      delete mockLocalStorage[key];
    });

    
    mockDocumentElement = jasmine.createSpyObj('HTMLElement', ['setAttribute']);
    spyOnProperty(document, 'documentElement', 'get').and.returnValue(mockDocumentElement);

    TestBed.configureTestingModule({
      providers: [ThemeState]
    });
  });

  afterEach(() => {
    mockLocalStorage = {};
  });

  describe('Initialization', () => {
    it('should be created', () => {
      service = TestBed.inject(ThemeState);
      expect(service).toBeTruthy();
    });

    it('should initialize with default light theme when no localStorage value exists', () => {
      service = TestBed.inject(ThemeState);
      expect(service.theme()).toBe('light');
      expect(mockDocumentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'light');
    });

    it('should initialize with default md font size when no localStorage value exists', () => {
      service = TestBed.inject(ThemeState);
      expect(service.fontSize()).toBe('md');
      expect(mockDocumentElement.setAttribute).toHaveBeenCalledWith('data-font', 'md');
    });

    it('should load theme from localStorage if available', () => {
      mockLocalStorage['user-theme'] = 'dark';
      service = TestBed.inject(ThemeState);
      expect(service.theme()).toBe('dark');
      expect(mockDocumentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'dark');
    });

    it('should load font size from localStorage if available', () => {
      mockLocalStorage['user-font'] = 'lg';
      service = TestBed.inject(ThemeState);
      expect(service.fontSize()).toBe('lg');
      expect(mockDocumentElement.setAttribute).toHaveBeenCalledWith('data-font', 'lg');
    });

    it('should apply both theme and font to DOM on initialization', () => {
      mockLocalStorage['user-theme'] = 'dark';
      mockLocalStorage['user-font'] = 'xl';
      service = TestBed.inject(ThemeState);
      
      expect(mockDocumentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'dark');
      expect(mockDocumentElement.setAttribute).toHaveBeenCalledWith('data-font', 'xl');
      expect(mockDocumentElement.setAttribute).toHaveBeenCalledTimes(2);
    });
  });

  describe('Theme Management', () => {
    beforeEach(() => {
      service = TestBed.inject(ThemeState);
      mockDocumentElement.setAttribute.calls.reset();
    });

    it('should set theme and update localStorage and DOM', () => {
      service.setTheme('dark');
      
      expect(service.theme()).toBe('dark');
      expect(localStorage.setItem).toHaveBeenCalledWith('user-theme', 'dark');
      expect(mockDocumentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'dark');
      expect(mockDocumentElement.setAttribute).toHaveBeenCalledWith('data-font', 'md');
    });

    it('should toggle theme from light to dark', () => {
      
      expect(service.theme()).toBe('light');
      
      service.toggleTheme();
      
      expect(service.theme()).toBe('dark');
      expect(localStorage.setItem).toHaveBeenCalledWith('user-theme', 'dark');
      expect(mockDocumentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'dark');
    });

    it('should toggle theme from dark to light', () => {
      
      service.setTheme('dark');
      mockDocumentElement.setAttribute.calls.reset();
      
      service.toggleTheme();
      
      expect(service.theme()).toBe('light');
      expect(localStorage.setItem).toHaveBeenCalledWith('user-theme', 'light');
      expect(mockDocumentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'light');
    });

    it('should handle all valid theme modes', () => {
      const themes: ThemeMode[] = ['light', 'dark'];
      
      themes.forEach(theme => {
        service.setTheme(theme);
        expect(service.theme()).toBe(theme);
        expect(localStorage.setItem).toHaveBeenCalledWith('user-theme', theme);
      });
    });
  });

  describe('Font Size Management', () => {
    beforeEach(() => {
      service = TestBed.inject(ThemeState);
      mockDocumentElement.setAttribute.calls.reset();
    });

    it('should set font size and update localStorage and DOM', () => {
      service.setFontSize('lg');
      
      expect(service.fontSize()).toBe('lg');
      expect(localStorage.setItem).toHaveBeenCalledWith('user-font', 'lg');
      expect(mockDocumentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'light');
      expect(mockDocumentElement.setAttribute).toHaveBeenCalledWith('data-font', 'lg');
    });

    it('should reset font size to md', () => {
      
      service.setFontSize('xl');
      mockDocumentElement.setAttribute.calls.reset();
      
      service.resetFontSize();
      
      expect(service.fontSize()).toBe('md');
      expect(localStorage.setItem).toHaveBeenCalledWith('user-font', 'md');
      expect(mockDocumentElement.setAttribute).toHaveBeenCalledWith('data-font', 'md');
    });

    it('should handle all valid font sizes', () => {
      const sizes: FontSize[] = ['sm', 'md', 'lg', 'xl'];
      
      sizes.forEach(size => {
        service.setFontSize(size);
        expect(service.fontSize()).toBe(size);
        expect(localStorage.setItem).toHaveBeenCalledWith('user-font', size);
      });
    });
  });

  describe('Font Size Adjustment', () => {
    beforeEach(() => {
      service = TestBed.inject(ThemeState);
      mockDocumentElement.setAttribute.calls.reset();
    });

    it('should increase font size from sm to md', () => {
      service.setFontSize('sm');
      service.adjustFontSize('increase');
      
      expect(service.fontSize()).toBe('md');
    });

    it('should increase font size from md to lg', () => {
      service.setFontSize('md');
      service.adjustFontSize('increase');
      
      expect(service.fontSize()).toBe('lg');
    });

    it('should increase font size from lg to xl', () => {
      service.setFontSize('lg');
      service.adjustFontSize('increase');
      
      expect(service.fontSize()).toBe('xl');
    });

    it('should not increase font size beyond xl', () => {
      service.setFontSize('xl');
      service.adjustFontSize('increase');
      
      expect(service.fontSize()).toBe('xl');
    });

    it('should decrease font size from xl to lg', () => {
      service.setFontSize('xl');
      service.adjustFontSize('decrease');
      
      expect(service.fontSize()).toBe('lg');
    });

    it('should decrease font size from lg to md', () => {
      service.setFontSize('lg');
      service.adjustFontSize('decrease');
      
      expect(service.fontSize()).toBe('md');
    });

    it('should decrease font size from md to sm', () => {
      service.setFontSize('md');
      service.adjustFontSize('decrease');
      
      expect(service.fontSize()).toBe('sm');
    });

    it('should not decrease font size below sm', () => {
      service.setFontSize('sm');
      service.adjustFontSize('decrease');
      
      expect(service.fontSize()).toBe('sm');
    });

    it('should handle font size adjustment with localStorage and DOM updates', () => {
      service.setFontSize('md');
      mockDocumentElement.setAttribute.calls.reset();
      
      service.adjustFontSize('increase');
      
      expect(service.fontSize()).toBe('lg');
      expect(localStorage.setItem).toHaveBeenCalledWith('user-font', 'lg');
      expect(mockDocumentElement.setAttribute).toHaveBeenCalledWith('data-font', 'lg');
    });
  });

  describe('Signal Reactivity', () => {
    beforeEach(() => {
      service = TestBed.inject(ThemeState);
    });

    it('should provide readonly theme signal', () => {
      expect(service.theme()).toBe('light');
      
      service.setTheme('dark');
      expect(service.theme()).toBe('dark');
    });

    it('should provide readonly fontSize signal', () => {
      expect(service.fontSize()).toBe('md');
      
      service.setFontSize('lg');
      expect(service.fontSize()).toBe('lg');
    });
  });

  describe('Edge Cases', () => {
    it('should use localStorage theme value as-is (no validation)', () => {
      mockLocalStorage['user-theme'] = 'invalid-theme';
      service = TestBed.inject(ThemeState);
      
      expect(service.theme()).toBe('invalid-theme' as ThemeMode);
    });

    it('should use localStorage font value as-is (no validation)', () => {
      mockLocalStorage['user-font'] = 'invalid-font';
      service = TestBed.inject(ThemeState);
      
      expect(service.fontSize()).toBe('invalid-font' as FontSize);
    });

    it('should handle empty localStorage values', () => {
      mockLocalStorage['user-theme'] = '';
      mockLocalStorage['user-font'] = '';
      service = TestBed.inject(ThemeState);
      
      expect(service.theme()).toBe('light');
      expect(service.fontSize()).toBe('md');
    });
  });
});