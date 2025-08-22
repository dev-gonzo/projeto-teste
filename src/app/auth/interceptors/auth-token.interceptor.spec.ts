import { TestBed } from '@angular/core/testing';
import { HttpRequest, HttpHandlerFn, HttpResponse } from '@angular/common/http';
import { authTokenInterceptor } from './auth-token.interceptor';
import { of } from 'rxjs';

describe('authTokenInterceptor', () => {
  let mockNext: jasmine.Spy<HttpHandlerFn>;
  let mockRequest: HttpRequest<unknown>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    
    mockNext = jasmine.createSpy('HttpHandlerFn').and.returnValue(of(new HttpResponse({ status: 200 })));
    mockRequest = new HttpRequest('GET', '/api/test');
    
    
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(authTokenInterceptor).toBeTruthy();
  });

  it('should pass request unchanged when no token exists', () => {
    
    localStorage.removeItem('auth-token');

    
    TestBed.runInInjectionContext(() => {
      authTokenInterceptor(mockRequest, mockNext);
    });

    
    expect(mockNext).toHaveBeenCalledWith(mockRequest);
    expect(mockNext).toHaveBeenCalledTimes(1);
  });

  it('should pass request unchanged when token is null', () => {
    
    spyOn(localStorage, 'getItem').and.returnValue(null);

    
    TestBed.runInInjectionContext(() => {
      authTokenInterceptor(mockRequest, mockNext);
    });

    
    expect(mockNext).toHaveBeenCalledWith(mockRequest);
    expect(mockNext).toHaveBeenCalledTimes(1);
  });

  it('should pass request unchanged when token is empty string', () => {
    
    localStorage.setItem('auth-token', '');

    
    TestBed.runInInjectionContext(() => {
      authTokenInterceptor(mockRequest, mockNext);
    });

    
    expect(mockNext).toHaveBeenCalledWith(mockRequest);
    expect(mockNext).toHaveBeenCalledTimes(1);
  });

  it('should add Authorization header when token exists', () => {
    
    const testToken = 'test-jwt-token';
    localStorage.setItem('auth-token', testToken);
    let capturedRequest: HttpRequest<unknown>;
    mockNext.and.callFake((req: HttpRequest<unknown>) => {
      capturedRequest = req;
      return of(new HttpResponse({ status: 200 }));
    });

    
    TestBed.runInInjectionContext(() => {
      authTokenInterceptor(mockRequest, mockNext);
    });

    
    expect(mockNext).toHaveBeenCalledTimes(1);
    expect(capturedRequest!).toBeDefined();
    expect(capturedRequest!.headers.get('Authorization')).toBe(`Bearer ${testToken}`);
    expect(capturedRequest!.url).toBe(mockRequest.url);
    expect(capturedRequest!.method).toBe(mockRequest.method);
  });

  it('should clone request with Authorization header when token exists', () => {
    
    const testToken = 'another-test-token';
    localStorage.setItem('auth-token', testToken);
    let capturedRequest: HttpRequest<unknown>;
    mockNext.and.callFake((req: HttpRequest<unknown>) => {
      capturedRequest = req;
      return of(new HttpResponse({ status: 200 }));
    });

    
    TestBed.runInInjectionContext(() => {
      authTokenInterceptor(mockRequest, mockNext);
    });

    
    expect(capturedRequest!).not.toBe(mockRequest); 
    expect(capturedRequest!.headers.get('Authorization')).toBe(`Bearer ${testToken}`);
  });

  it('should preserve existing headers when adding Authorization', () => {
    
    const testToken = 'test-token-with-headers';
    const requestWithHeaders = mockRequest.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        'X-Custom-Header': 'custom-value'
      }
    });
    localStorage.setItem('auth-token', testToken);
    let capturedRequest: HttpRequest<unknown>;
    mockNext.and.callFake((req: HttpRequest<unknown>) => {
      capturedRequest = req;
      return of(new HttpResponse({ status: 200 }));
    });

    
    TestBed.runInInjectionContext(() => {
      authTokenInterceptor(requestWithHeaders, mockNext);
    });

    
    expect(capturedRequest!.headers.get('Authorization')).toBe(`Bearer ${testToken}`);
    expect(capturedRequest!.headers.get('Content-Type')).toBe('application/json');
    expect(capturedRequest!.headers.get('X-Custom-Header')).toBe('custom-value');
  });

  it('should handle different HTTP methods with token', () => {
    
    const testToken = 'method-test-token';
    const postRequest = new HttpRequest('POST', '/api/data', { data: 'test' });
    localStorage.setItem('auth-token', testToken);
    let capturedRequest: HttpRequest<unknown>;
    mockNext.and.callFake((req: HttpRequest<unknown>) => {
      capturedRequest = req;
      return of(new HttpResponse({ status: 200 }));
    });

    
    TestBed.runInInjectionContext(() => {
      authTokenInterceptor(postRequest, mockNext);
    });

    
    expect(capturedRequest!.method).toBe('POST');
    expect(capturedRequest!.headers.get('Authorization')).toBe(`Bearer ${testToken}`);
    expect(capturedRequest!.body).toEqual({ data: 'test' });
  });
});