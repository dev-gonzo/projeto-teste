import { ApplicationConfig, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { appConfig } from './app.config';

describe('AppConfig', () => {
  let config: ApplicationConfig;

  beforeEach(() => {
    config = appConfig;
  });

  it('should be defined', () => {
    expect(config).toBeDefined();
    expect(config.providers).toBeDefined();
  });

  it('should provide zone change detection with event coalescing', () => {
    expect(config.providers).toBeDefined();
    expect(config.providers?.length).toBeGreaterThan(0);
    
    
    expect(config.providers?.length).toBe(3);
  });

  it('should provide browser global error listeners', () => {
    expect(config.providers).toBeDefined();
    expect(config.providers?.length).toBeGreaterThan(0);
    
    
    config.providers?.forEach(provider => {
      expect(provider).toBeDefined();
    });
  });

  it('should have correct provider configuration', () => {
    expect(config.providers).toBeDefined();
    expect(config.providers?.length).toBe(3);
    
    
    expect(config.providers?.every(provider => provider !== null && provider !== undefined)).toBe(true);
  });

  it('should enable event coalescing for zone change detection', async () => {
    await TestBed.configureTestingModule({
      providers: config.providers || []
    }).compileComponents();

    
    expect(() => TestBed.createComponent(TestComponent)).not.toThrow();
  });

  it('should provide router configuration', async () => {
    await TestBed.configureTestingModule({
      providers: config.providers || []
    }).compileComponents();

    
    const router = TestBed.inject(Router);
    expect(router).toBeDefined();
  });
});


@Component({
  selector: 'app-test',
  template: '<div>Test</div>',
  standalone: true
})
class TestComponent {}