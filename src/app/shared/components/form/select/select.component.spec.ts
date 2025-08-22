import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { SelectComponent, SelectOption } from './select.component';
import { WrapperComponent } from '../wrapper/wrapper.component';

describe('SelectComponent', () => {
  let component: SelectComponent;
  let fixture: ComponentFixture<SelectComponent>;
  let mockOptions: SelectOption[];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectComponent, WrapperComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectComponent);
    component = fixture.componentInstance;

    mockOptions = [
      { label: 'Opção 1', value: 'opt1' },
      { label: 'Opção 2', value: 'opt2' },
      { label: 'Opção 3', value: 3 }
    ];

    component.control = new FormControl('');
    component.options = mockOptions;
    component.label = 'Test Select';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Properties', () => {
    it('should have default values for inputs', () => {
      const newComponent = TestBed.createComponent(SelectComponent).componentInstance;
      newComponent.control = new FormControl('');
      
      expect(newComponent.label).toBe('');
      expect(newComponent.options).toEqual([]);
      expect(newComponent.placeholder).toBe('Selecione');
      expect(newComponent.id).toBeUndefined();
      expect(newComponent.showDropdown).toBe(false);
    });

    it('should accept custom input values', () => {
      component.label = 'Custom Label';
      component.placeholder = 'Custom Placeholder';
      component.id = 'custom-id';
      component.options = mockOptions;

      expect(component.label).toBe('Custom Label');
      expect(component.placeholder).toBe('Custom Placeholder');
      expect(component.id).toBe('custom-id');
      expect(component.options).toEqual(mockOptions);
    });
  });

  describe('selectId getter', () => {
    it('should return custom id when provided', () => {
      component.id = 'custom-select-id';
      expect(component.selectId).toBe('custom-select-id');
    });

    it('should generate id from label when no custom id provided', () => {
      component.id = undefined;
      component.label = 'Test Label';
      expect(component.selectId).toBe('select-test-label');
    });

    it('should handle labels with multiple spaces', () => {
      component.id = undefined;
      component.label = 'Test   Multiple   Spaces';
      expect(component.selectId).toBe('select-test-multiple-spaces');
    });

    it('should handle empty label', () => {
      component.id = undefined;
      component.label = '';
      expect(component.selectId).toBe('select-');
    });
  });

  describe('error getter', () => {
    it('should return null when control is not touched', () => {
      component.control = new FormControl('', Validators.required);
      expect(component.error).toBeNull();
    });

    it('should return null when control has no errors', () => {
      component.control = new FormControl('valid-value');
      component.control.markAsTouched();
      expect(component.error).toBeNull();
    });

    it('should return error message when control has errors and is touched', () => {
      component.control = new FormControl('', Validators.required);
      component.control.setErrors({ message: 'Campo obrigatório' });
      component.control.markAsTouched();
      expect(component.error).toBe('Campo obrigatório');
    });

    it('should return null when error message is not a string', () => {
      component.control = new FormControl('', Validators.required);
      component.control.setErrors({ message: 123 });
      component.control.markAsTouched();
      expect(component.error).toBeNull();
    });

    it('should return null when control is null', () => {
      component.control = null as unknown as FormControl;
      expect(component.error).toBeNull();
    });
  });

  describe('displayValue getter', () => {
    it('should return empty string when no option is selected', () => {
      component.control.setValue(null);
      expect(component.displayValue).toBe('');
    });

    it('should return label of selected option', () => {
      component.control.setValue('opt1');
      expect(component.displayValue).toBe('Opção 1');
    });

    it('should return label for numeric value', () => {
      component.control.setValue(3);
      expect(component.displayValue).toBe('Opção 3');
    });

    it('should return empty string for non-existent option', () => {
      component.control.setValue('non-existent');
      expect(component.displayValue).toBe('');
    });
  });

  describe('ColumnHostClass inheritance', () => {
    it('should inherit col property', () => {
      component.col = 6;
      expect(component.col).toBe(6);
    });

    it('should inherit colMd property', () => {
      component.colMd = 4;
      expect(component.colMd).toBe(4);
    });

    it('should inherit colLg property', () => {
      component.colLg = 3;
      expect(component.colLg).toBe(3);
    });

    it('should inherit colXl property', () => {
      component.colXl = 2;
      expect(component.colXl).toBe(2);
    });

    it('should inherit hostClass property', () => {
      
      component.col = 6;
      component.colMd = 4;
      expect(component.hostClass).toContain('col-6');
      expect(component.hostClass).toContain('col-md-4');
    });
  });

  describe('Template Rendering', () => {
    it('should render wrapper component with correct inputs', () => {
      const wrapperElement = fixture.debugElement.query(By.directive(WrapperComponent));
      const wrapperComponent = wrapperElement.componentInstance;

      expect(wrapperComponent.label).toBe('Test Select');
      expect(wrapperComponent.inputId).toBe(component.selectId);
    });

    it('should render select element with correct attributes', () => {
      const selectElement = fixture.debugElement.query(By.css('.custom-select'));
      
      expect(selectElement.nativeElement.id).toBe(component.selectId);
      expect(selectElement.nativeElement.tabIndex).toBe(0);
    });

    it('should display placeholder when no value selected', () => {
      component.control.setValue(null);
      component.placeholder = 'Choose an option';
      fixture.detectChanges();

      const valueSpan = fixture.debugElement.query(By.css('.select-value'));
      expect(valueSpan.nativeElement.textContent.trim()).toBe('Choose an option');
    });

    it('should display selected option label', () => {
      component.control.setValue('opt2');
      fixture.detectChanges();

      const valueSpan = fixture.debugElement.query(By.css('.select-value'));
      expect(valueSpan.nativeElement.textContent.trim()).toBe('Opção 2');
    });

    it('should show dropdown when showDropdown is true', () => {
      component.showDropdown = true;
      fixture.detectChanges();

      const dropdown = fixture.debugElement.query(By.css('.custom-select-dropdown'));
      expect(dropdown).toBeTruthy();
    });

    it('should hide dropdown when showDropdown is false', () => {
      component.showDropdown = false;
      fixture.detectChanges();

      const dropdown = fixture.debugElement.query(By.css('.custom-select-dropdown'));
      expect(dropdown).toBeFalsy();
    });

    it('should render all options in dropdown', () => {
      component.showDropdown = true;
      fixture.detectChanges();

      const optionElements = fixture.debugElement.queryAll(By.css('.custom-select-option'));
      expect(optionElements.length).toBe(3);
      expect(optionElements[0].nativeElement.textContent.trim()).toBe('Opção 1');
      expect(optionElements[1].nativeElement.textContent.trim()).toBe('Opção 2');
      expect(optionElements[2].nativeElement.textContent.trim()).toBe('Opção 3');
    });

    it('should apply selected class to current option', () => {
      component.control.setValue('opt1');
      component.showDropdown = true;
      fixture.detectChanges();

      const optionElements = fixture.debugElement.queryAll(By.css('.custom-select-option'));
      expect(optionElements[0].nativeElement.classList.contains('selected')).toBe(true);
      expect(optionElements[1].nativeElement.classList.contains('selected')).toBe(false);
    });
  });

  describe('Dropdown Behavior', () => {
    it('should toggle dropdown when toggleDropdown is called', () => {
      expect(component.showDropdown).toBe(false);
      
      component.toggleDropdown();
      expect(component.showDropdown).toBe(true);
      
      component.toggleDropdown();
      expect(component.showDropdown).toBe(false);
    });

    it('should toggle dropdown when select element is clicked', () => {
      const selectElement = fixture.debugElement.query(By.css('.custom-select'));
      
      selectElement.nativeElement.click();
      expect(component.showDropdown).toBe(true);
      
      selectElement.nativeElement.click();
      expect(component.showDropdown).toBe(false);
    });

    it('should close dropdown and mark as touched on blur', (done) => {
      component.showDropdown = true;
      const selectElement = fixture.debugElement.query(By.css('.custom-select'));
      
      selectElement.triggerEventHandler('blur', null);
      
      setTimeout(() => {
        expect(component.showDropdown).toBe(false);
        expect(component.control.touched).toBe(true);
        done();
      }, 200);
    });

    it('should close dropdown when clicking outside', () => {
      component.showDropdown = true;
      
      const outsideElement = document.createElement('div');
      document.body.appendChild(outsideElement);
      
      const event = new MouseEvent('click', { bubbles: true });
      Object.defineProperty(event, 'target', { value: outsideElement });
      
      component.onDocumentClick(event);
      
      expect(component.showDropdown).toBe(false);
      
      document.body.removeChild(outsideElement);
    });

    it('should not close dropdown when clicking inside select', () => {
      component.showDropdown = true;
      fixture.detectChanges();
      
      const selectElement = fixture.debugElement.query(By.css('.custom-select')).nativeElement;
      selectElement.classList.add('custom-select');
      
      const event = new MouseEvent('click', { bubbles: true });
      Object.defineProperty(event, 'target', { value: selectElement });
      
      component.onDocumentClick(event);
      
      expect(component.showDropdown).toBe(true);
    });
  });

  describe('FormControl Integration', () => {
    it('should set control value when option is selected', () => {
      const option = mockOptions[1];
      component.selectOption(option);
      
      expect(component.control.value).toBe('opt2');
    });

    it('should mark control as touched when option is selected', () => {
      const option = mockOptions[0];
      component.selectOption(option);
      
      expect(component.control.touched).toBe(true);
    });

    it('should close dropdown when option is selected', () => {
      component.showDropdown = true;
      const option = mockOptions[0];
      
      component.selectOption(option);
      
      expect(component.showDropdown).toBe(false);
    });

    it('should handle numeric values', () => {
      const option = mockOptions[2]; 
      component.selectOption(option);
      
      expect(component.control.value).toBe(3);
    });

    it('should trigger option selection when clicking on option element', () => {
      component.showDropdown = true;
      fixture.detectChanges();
      
      const optionElements = fixture.debugElement.queryAll(By.css('.custom-select-option'));
      optionElements[1].nativeElement.click();
      
      expect(component.control.value).toBe('opt2');
      expect(component.showDropdown).toBe(false);
    });
  });

  describe('CSS Classes', () => {
    it('should apply text-muted class when no value and no error', () => {
      component.control.setValue(null);
      component.control.setErrors(null);
      fixture.detectChanges();
      
      const selectElement = fixture.debugElement.query(By.css('.custom-select'));
      expect(selectElement.nativeElement.classList.contains('text-muted')).toBe(true);
    });

    it('should apply is-invalid class when there is an error', () => {
      component.control.setErrors({ message: 'Error' });
      component.control.markAsTouched();
      fixture.detectChanges();
      
      const selectElement = fixture.debugElement.query(By.css('.custom-select'));
      expect(selectElement.nativeElement.classList.contains('is-invalid')).toBe(true);
    });

    it('should apply show class when dropdown is open', () => {
      component.showDropdown = true;
      fixture.detectChanges();
      
      const selectElement = fixture.debugElement.query(By.css('.custom-select'));
      expect(selectElement.nativeElement.classList.contains('show')).toBe(true);
    });

    it('should apply rotated class to arrow when dropdown is open', () => {
      component.showDropdown = true;
      fixture.detectChanges();
      
      const arrowElement = fixture.debugElement.query(By.css('.select-arrow'));
      expect(arrowElement.nativeElement.classList.contains('rotated')).toBe(true);
    });
  });
});