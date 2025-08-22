import { TestBed } from '@angular/core/testing';
import { fakeAsync, tick } from '@angular/core/testing';

import { ToastService, ToastType } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Initial State', () => {
    it('should have initial signal values', () => {
      expect(service.message()).toBeNull();
      expect(service.type()).toBe('info');
      expect(service.visible()).toBe(false);
    });
  });

  describe('show method', () => {
    it('should set message, type, and visibility', () => {
      const testMessage = 'Test message';
      const testType: ToastType = 'success';

      service.show(testMessage, testType);

      expect(service.message()).toBe(testMessage);
      expect(service.type()).toBe(testType);
      expect(service.visible()).toBe(true);
    });

    it('should default to info type when no type provided', () => {
      const testMessage = 'Test message';

      service.show(testMessage);

      expect(service.message()).toBe(testMessage);
      expect(service.type()).toBe('info');
      expect(service.visible()).toBe(true);
    });

    it('should hide toast after 4000ms for first time showing a type', fakeAsync(() => {
      service.show('Test message', 'success');
      expect(service.visible()).toBe(true);

      tick(3999);
      expect(service.visible()).toBe(true);

      tick(1);
      expect(service.visible()).toBe(false);
    }));

    it('should hide toast after 2000ms for repeated type', fakeAsync(() => {
      
      service.show('First message', 'success');
      tick(4000);
      expect(service.visible()).toBe(false);

      
      service.show('Second message', 'success');
      expect(service.visible()).toBe(true);

      tick(1999);
      expect(service.visible()).toBe(true);

      tick(1);
      expect(service.visible()).toBe(false);
    }));

    it('should use 4000ms duration when switching to different type', fakeAsync(() => {
      
      service.show('First message', 'success');
      tick(4000);
      expect(service.visible()).toBe(false);

      
      service.show('Second message', 'error');
      expect(service.visible()).toBe(true);

      tick(3999);
      expect(service.visible()).toBe(true);

      tick(1);
      expect(service.visible()).toBe(false);
    }));
  });

  describe('success method', () => {
    it('should call show with success type', () => {
      spyOn(service, 'show');
      const testMessage = 'Success message';

      service.success(testMessage);

      expect(service.show).toHaveBeenCalledWith(testMessage, 'success');
    });

    it('should set correct values when called directly', () => {
      const testMessage = 'Success message';

      service.success(testMessage);

      expect(service.message()).toBe(testMessage);
      expect(service.type()).toBe('success');
      expect(service.visible()).toBe(true);
    });
  });

  describe('error method', () => {
    it('should call show with error type', () => {
      spyOn(service, 'show');
      const testMessage = 'Error message';

      service.error(testMessage);

      expect(service.show).toHaveBeenCalledWith(testMessage, 'error');
    });

    it('should set correct values when called directly', () => {
      const testMessage = 'Error message';

      service.error(testMessage);

      expect(service.message()).toBe(testMessage);
      expect(service.type()).toBe('error');
      expect(service.visible()).toBe(true);
    });
  });

  describe('info method', () => {
    it('should call show with info type', () => {
      spyOn(service, 'show');
      const testMessage = 'Info message';

      service.info(testMessage);

      expect(service.show).toHaveBeenCalledWith(testMessage, 'info');
    });

    it('should set correct values when called directly', () => {
      const testMessage = 'Info message';

      service.info(testMessage);

      expect(service.message()).toBe(testMessage);
      expect(service.type()).toBe('info');
      expect(service.visible()).toBe(true);
    });
  });

  describe('warning method', () => {
    it('should call show with warning type', () => {
      spyOn(service, 'show');
      const testMessage = 'Warning message';

      service.warning(testMessage);

      expect(service.show).toHaveBeenCalledWith(testMessage, 'warning');
    });

    it('should set correct values when called directly', () => {
      const testMessage = 'Warning message';

      service.warning(testMessage);

      expect(service.message()).toBe(testMessage);
      expect(service.type()).toBe('warning');
      expect(service.visible()).toBe(true);
    });
  });

  describe('Signal Reactivity', () => {
    it('should update signals reactively', () => {
      const messageValues: (string | null)[] = [];
      const typeValues: ToastType[] = [];
      const visibleValues: boolean[] = [];

      
      const messageEffect = () => messageValues.push(service.message());
      const typeEffect = () => typeValues.push(service.type());
      const visibleEffect = () => visibleValues.push(service.visible());

      
      messageEffect();
      typeEffect();
      visibleEffect();

      service.show('Test message', 'success');
      
      messageEffect();
      typeEffect();
      visibleEffect();

      expect(messageValues).toEqual([null, 'Test message']);
      expect(typeValues).toEqual(['info', 'success']);
      expect(visibleValues).toEqual([false, true]);
    });
  });

  describe('Multiple Toast Scenarios', () => {
    it('should handle rapid successive calls', fakeAsync(() => {
      service.show('First message', 'info');
      expect(service.message()).toBe('First message');
      expect(service.type()).toBe('info');

      tick(1000);
      service.show('Second message', 'error');
      expect(service.message()).toBe('Second message');
      expect(service.type()).toBe('error');
      expect(service.visible()).toBe(true);

      tick(4000);
      expect(service.visible()).toBe(false);
    }));

    it('should handle all toast types in sequence', fakeAsync(() => {
      const types: ToastType[] = ['success', 'error', 'info', 'warning'];
      
      types.forEach((type, index) => {
        service.show(`Message ${index + 1}`, type);
        expect(service.type()).toBe(type);
        expect(service.visible()).toBe(true);
        tick(4000);
        expect(service.visible()).toBe(false);
      });
    }));
  });

  describe('Edge Cases', () => {
    it('should handle empty message', () => {
      service.show('', 'info');
      
      expect(service.message()).toBe('');
      expect(service.type()).toBe('info');
      expect(service.visible()).toBe(true);
    });

    it('should handle very long message', () => {
      const longMessage = 'A'.repeat(1000);
      service.show(longMessage, 'warning');
      
      expect(service.message()).toBe(longMessage);
      expect(service.type()).toBe('warning');
      expect(service.visible()).toBe(true);
    });

    it('should maintain lastType state correctly', fakeAsync(() => {
      
      service.show('Success 1', 'success');
      tick(4000);
      
      
      service.show('Success 2', 'success');
      tick(2000);
      expect(service.visible()).toBe(false);
      
      
      service.show('Error 1', 'error');
      tick(3999);
      expect(service.visible()).toBe(true);
      tick(1);
      expect(service.visible()).toBe(false);
    }));
  });
});