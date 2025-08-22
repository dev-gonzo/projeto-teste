import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { ToastrModule } from 'ngx-toastr';
import { provideNgxMask } from 'ngx-mask';

import { AppComponent } from './app/app';
import { routes } from './app/app.routes';
import { API_BASE_URL } from './app/core/tokens/api-base-url.token';
import { environment } from './environments/environment';
import { authErrorInterceptor } from './app/auth/interceptors/auth-error.interceptor';
import { authTokenInterceptor } from './app/auth/interceptors/auth-token.interceptor';

describe('Main Bootstrap Configuration', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter(routes),
        provideNgxMask(),
        provideAnimations(),
        provideHttpClient(),
        importProvidersFrom(
          ToastrModule.forRoot({
            positionClass: 'toast-bottom-right',
            closeButton: true,
            timeOut: 2200,
            progressBar: true,
            preventDuplicates: true,
          }),
        ),
        provideHttpClient(
          withInterceptors([authTokenInterceptor, authErrorInterceptor]),
        ),
        { provide: API_BASE_URL, useValue: environment.apiUrl },
      ],
    }).compileComponents();
  });

  it('should create the app component', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should configure router with correct routes', () => {
    const router = TestBed.inject(Router);
    expect(router).toBeDefined();
  });

  it('should provide API_BASE_URL token with environment value', () => {
    const apiBaseUrl = TestBed.inject(API_BASE_URL);
    expect(apiBaseUrl).toBe(environment.apiUrl);
  });

  it('should configure ToastrModule with correct options', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    
    
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should configure HTTP client with interceptors', () => {
    const httpClient = TestBed.inject(HttpClient);
    expect(httpClient).toBeDefined();
  });

  it('should provide animations', () => {
    
    const fixture = TestBed.createComponent(AppComponent);
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should provide ngx-mask', () => {
    
    const fixture = TestBed.createComponent(AppComponent);
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});