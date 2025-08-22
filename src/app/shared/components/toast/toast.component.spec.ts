import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { signal } from '@angular/core';

import { ToastComponent } from './toast.component';
import { ToastService, ToastType } from './toast.service';
import { ScrollService } from '../../services/scroll.service';

describe('ToastComponent', () => {
  let component: ToastComponent;
  let fixture: ComponentFixture<ToastComponent>;
  let mockToastService: jasmine.SpyObj<ToastService>;
  let mockScrollService: jasmine.SpyObj<ScrollService>;

  beforeEach(async () => {
    
    mockToastService = jasmine.createSpyObj('ToastService', ['show', 'success', 'error', 'info', 'warning'], {
      message: signal<string | null>(null),
      type: signal<ToastType>('info'),
      visible: signal(false)
    });

    mockScrollService = jasmine.createSpyObj('ScrollService', ['scrollToTop', 'scrollToElement']);

    await TestBed.configureTestingModule({
      imports: [ToastComponent, CommonModule],
      providers: [
        { provide: ToastService, useValue: mockToastService },
        { provide: ScrollService, useValue: mockScrollService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ToastComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should inject ToastService and ScrollService', () => {
    expect(component.toast).toBe(mockToastService);
    expect(component.scrollService).toBe(mockScrollService);
  });

  describe('Template Rendering', () => {
    it('should not render toast when not visible', () => {
      mockToastService.visible.set(false);
      fixture.detectChanges();

      const toastElement = fixture.debugElement.query(By.css('.position-fixed'));
      expect(toastElement).toBeNull();
    });

    it('should render toast when visible', () => {
      mockToastService.visible.set(true);
      mockToastService.message.set('Test message');
      fixture.detectChanges();

      const toastElement = fixture.debugElement.query(By.css('.position-fixed'));
      expect(toastElement).toBeTruthy();
    });

    it('should display the correct message', () => {
      const testMessage = 'Test toast message';
      mockToastService.visible.set(true);
      mockToastService.message.set(testMessage);
      fixture.detectChanges();

      const messageElement = fixture.debugElement.query(By.css('.px-4'));
      expect(messageElement.nativeElement.textContent.trim()).toBe(testMessage);
    });

    it('should have correct container classes', () => {
      mockToastService.visible.set(true);
      mockToastService.message.set('Test message');
      fixture.detectChanges();

      const containerElement = fixture.debugElement.query(By.css('.position-fixed'));
      expect(containerElement.nativeElement.classList.contains('position-fixed')).toBe(true);
      expect(containerElement.nativeElement.classList.contains('w-100')).toBe(true);
      expect(containerElement.nativeElement.classList.contains('d-flex')).toBe(true);
      expect(containerElement.nativeElement.classList.contains('justify-content-center')).toBe(true);
    });

    it('should have correct toast message classes', () => {
      mockToastService.visible.set(true);
      mockToastService.message.set('Test message');
      fixture.detectChanges();

      const messageElement = fixture.debugElement.query(By.css('.px-4'));
      expect(messageElement.nativeElement.classList.contains('px-4')).toBe(true);
      expect(messageElement.nativeElement.classList.contains('py-2')).toBe(true);
      expect(messageElement.nativeElement.classList.contains('rounded')).toBe(true);
      expect(messageElement.nativeElement.classList.contains('shadow')).toBe(true);
    });

    it('should have correct inline styles', () => {
      mockToastService.visible.set(true);
      mockToastService.message.set('Test message');
      fixture.detectChanges();

      const containerElement = fixture.debugElement.query(By.css('.position-fixed'));
      const style = containerElement.nativeElement.style;
      expect(style.bottom).toBe('16px');
      expect(style.zIndex).toBe('1050');
    });
  });

  describe('CSS Classes Computed Property', () => {
    it('should return bg-success class for success type', () => {
      mockToastService.type.set('success');
      fixture.detectChanges();

      const cssClass = component.cssClass();
      expect(cssClass['bg-success']).toBe(true);
      expect(cssClass['bg-danger']).toBe(false);
      expect(cssClass['bg-info']).toBe(false);
      expect(cssClass['bg-warning']).toBe(false);
    });

    it('should return bg-danger class for error type', () => {
      mockToastService.type.set('error');
      fixture.detectChanges();

      const cssClass = component.cssClass();
      expect(cssClass['bg-success']).toBe(false);
      expect(cssClass['bg-danger']).toBe(true);
      expect(cssClass['bg-info']).toBe(false);
      expect(cssClass['bg-warning']).toBe(false);
    });

    it('should return bg-info class for info type', () => {
      mockToastService.type.set('info');
      fixture.detectChanges();

      const cssClass = component.cssClass();
      expect(cssClass['bg-success']).toBe(false);
      expect(cssClass['bg-danger']).toBe(false);
      expect(cssClass['bg-info']).toBe(true);
      expect(cssClass['bg-warning']).toBe(false);
    });

    it('should return bg-warning class for warning type', () => {
      mockToastService.type.set('warning');
      fixture.detectChanges();

      const cssClass = component.cssClass();
      expect(cssClass['bg-success']).toBe(false);
      expect(cssClass['bg-danger']).toBe(false);
      expect(cssClass['bg-info']).toBe(false);
      expect(cssClass['bg-warning']).toBe(true);
    });
  });

  describe('Text Color Classes', () => {
    it('should apply text-white class for success type', () => {
      mockToastService.visible.set(true);
      mockToastService.type.set('success');
      mockToastService.message.set('Success message');
      fixture.detectChanges();

      const messageElement = fixture.debugElement.query(By.css('.px-4'));
      expect(messageElement.nativeElement.classList.contains('text-white')).toBe(true);
      expect(messageElement.nativeElement.classList.contains('text-dark')).toBe(false);
    });

    it('should apply text-white class for error type', () => {
      mockToastService.visible.set(true);
      mockToastService.type.set('error');
      mockToastService.message.set('Error message');
      fixture.detectChanges();

      const messageElement = fixture.debugElement.query(By.css('.px-4'));
      expect(messageElement.nativeElement.classList.contains('text-white')).toBe(true);
      expect(messageElement.nativeElement.classList.contains('text-dark')).toBe(false);
    });

    it('should apply text-dark class for warning type', () => {
      mockToastService.visible.set(true);
      mockToastService.type.set('warning');
      mockToastService.message.set('Warning message');
      fixture.detectChanges();

      const messageElement = fixture.debugElement.query(By.css('.px-4'));
      expect(messageElement.nativeElement.classList.contains('text-dark')).toBe(true);
      expect(messageElement.nativeElement.classList.contains('text-white')).toBe(false);
    });

    it('should apply text-dark class for info type', () => {
      mockToastService.visible.set(true);
      mockToastService.type.set('info');
      mockToastService.message.set('Info message');
      fixture.detectChanges();

      const messageElement = fixture.debugElement.query(By.css('.px-4'));
      expect(messageElement.nativeElement.classList.contains('text-dark')).toBe(true);
      expect(messageElement.nativeElement.classList.contains('text-white')).toBe(false);
    });
  });

  describe('Dynamic CSS Classes Application', () => {
    it('should apply correct background class for success type', () => {
      mockToastService.visible.set(true);
      mockToastService.type.set('success');
      mockToastService.message.set('Success message');
      fixture.detectChanges();

      const messageElement = fixture.debugElement.query(By.css('.px-4'));
      expect(messageElement.nativeElement.classList.contains('bg-success')).toBe(true);
    });

    it('should apply correct background class for error type', () => {
      mockToastService.visible.set(true);
      mockToastService.type.set('error');
      mockToastService.message.set('Error message');
      fixture.detectChanges();

      const messageElement = fixture.debugElement.query(By.css('.px-4'));
      expect(messageElement.nativeElement.classList.contains('bg-danger')).toBe(true);
    });

    it('should apply correct background class for info type', () => {
      mockToastService.visible.set(true);
      mockToastService.type.set('info');
      mockToastService.message.set('Info message');
      fixture.detectChanges();

      const messageElement = fixture.debugElement.query(By.css('.px-4'));
      expect(messageElement.nativeElement.classList.contains('bg-info')).toBe(true);
    });

    it('should apply correct background class for warning type', () => {
      mockToastService.visible.set(true);
      mockToastService.type.set('warning');
      mockToastService.message.set('Warning message');
      fixture.detectChanges();

      const messageElement = fixture.debugElement.query(By.css('.px-4'));
      expect(messageElement.nativeElement.classList.contains('bg-warning')).toBe(true);
    });
  });

  describe('Integration with ToastService', () => {
    it('should react to service visibility changes', () => {
      
      mockToastService.visible.set(false);
      fixture.detectChanges();
      let toastElement = fixture.debugElement.query(By.css('.position-fixed'));
      expect(toastElement).toBeNull();

      
      mockToastService.visible.set(true);
      mockToastService.message.set('Test message');
      fixture.detectChanges();
      toastElement = fixture.debugElement.query(By.css('.position-fixed'));
      expect(toastElement).toBeTruthy();

      
      mockToastService.visible.set(false);
      fixture.detectChanges();
      toastElement = fixture.debugElement.query(By.css('.position-fixed'));
      expect(toastElement).toBeNull();
    });

    it('should react to service message changes', () => {
      mockToastService.visible.set(true);
      
      
      mockToastService.message.set('Initial message');
      fixture.detectChanges();
      let messageElement = fixture.debugElement.query(By.css('.px-4'));
      expect(messageElement.nativeElement.textContent.trim()).toBe('Initial message');

      
      mockToastService.message.set('Updated message');
      fixture.detectChanges();
      messageElement = fixture.debugElement.query(By.css('.px-4'));
      expect(messageElement.nativeElement.textContent.trim()).toBe('Updated message');
    });

    it('should react to service type changes', () => {
      mockToastService.visible.set(true);
      mockToastService.message.set('Test message');
      
      
      mockToastService.type.set('success');
      fixture.detectChanges();
      let messageElement = fixture.debugElement.query(By.css('.px-4'));
      expect(messageElement.nativeElement.classList.contains('bg-success')).toBe(true);
      expect(messageElement.nativeElement.classList.contains('text-white')).toBe(true);

      
      mockToastService.type.set('warning');
      fixture.detectChanges();
      messageElement = fixture.debugElement.query(By.css('.px-4'));
      expect(messageElement.nativeElement.classList.contains('bg-warning')).toBe(true);
      expect(messageElement.nativeElement.classList.contains('text-dark')).toBe(true);
      expect(messageElement.nativeElement.classList.contains('bg-success')).toBe(false);
      expect(messageElement.nativeElement.classList.contains('text-white')).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('should handle null message gracefully', () => {
      mockToastService.visible.set(true);
      mockToastService.message.set(null);
      fixture.detectChanges();

      const messageElement = fixture.debugElement.query(By.css('.px-4'));
      expect(messageElement.nativeElement.textContent.trim()).toBe('');
    });

    it('should handle empty message', () => {
      mockToastService.visible.set(true);
      mockToastService.message.set('');
      fixture.detectChanges();

      const messageElement = fixture.debugElement.query(By.css('.px-4'));
      expect(messageElement.nativeElement.textContent.trim()).toBe('');
    });

    it('should handle very long messages', () => {
      const longMessage = 'A'.repeat(1000);
      mockToastService.visible.set(true);
      mockToastService.message.set(longMessage);
      fixture.detectChanges();

      const messageElement = fixture.debugElement.query(By.css('.px-4'));
      expect(messageElement.nativeElement.textContent.trim()).toBe(longMessage);
    });
  });

  describe('Component Structure', () => {
    it('should be a standalone component', () => {
      expect(ToastComponent).toBeDefined();
      const componentDef = (ToastComponent as unknown as { ɵcmp: { standalone: boolean } }).ɵcmp;
      expect(componentDef.standalone).toBe(true);
    });

    it('should import CommonModule', () => {
      expect(() => fixture.detectChanges()).not.toThrow();
    });

    it('should have correct selector', () => {
      const componentDef = (ToastComponent as unknown as { ɵcmp: { selectors: string[][] } }).ɵcmp;
      expect(componentDef.selectors[0][0]).toBe('app-toast');
    });
  });
});