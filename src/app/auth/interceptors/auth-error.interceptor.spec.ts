import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { HttpRequest, HttpHandlerFn, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { authErrorInterceptor } from './auth-error.interceptor';
import { of, throwError } from 'rxjs';

describe('authErrorInterceptor', () => {
  let mockRouter: jasmine.SpyObj<Router>;
  let mockNext: jasmine.Spy<HttpHandlerFn>;
  let mockRequest: HttpRequest<unknown>;

  beforeEach(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerSpy }
      ]
    });
    
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    mockNext = jasmine.createSpy('HttpHandlerFn');
    mockRequest = new HttpRequest('GET', '/api/test');
    
    
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(authErrorInterceptor).toBeTruthy();
  });

  it('should pass successful requests unchanged', (done) => {
    
    const successResponse = new HttpResponse({ status: 200, body: { data: 'success' } });
    mockNext.and.returnValue(of(successResponse));

    
    TestBed.runInInjectionContext(() => {
      const result = authErrorInterceptor(mockRequest, mockNext);
      
      
      result.subscribe({
        next: (response) => {
          expect(response).toBe(successResponse);
          expect(mockRouter.navigate).not.toHaveBeenCalled();
          expect(localStorage.getItem('auth-token')).toBeNull();
          done();
        },
        error: () => {
          fail('Should not have errored');
          done();
        }
      });
    });
  });

  it('should handle 401 error by removing token and redirecting to login', (done) => {
    
    localStorage.setItem('auth-token', 'test-token');
    const error401 = new HttpErrorResponse({
      status: 401,
      statusText: 'Unauthorized',
      url: '/api/test'
    });
    mockNext.and.returnValue(throwError(() => error401));

    
    TestBed.runInInjectionContext(() => {
      const result = authErrorInterceptor(mockRequest, mockNext);
      
      
      result.subscribe({
        next: () => {
          fail('Should have errored');
          done();
        },
        error: (error) => {
          expect(error).toBe(error401);
          expect(localStorage.getItem('auth-token')).toBeNull();
          expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/login']);
          expect(mockRouter.navigate).toHaveBeenCalledTimes(1);
          done();
        }
      });
    });
  });

  it('should handle 403 error by removing token and redirecting to login', (done) => {
    
    localStorage.setItem('auth-token', 'test-token');
    const error403 = new HttpErrorResponse({
      status: 403,
      statusText: 'Forbidden',
      url: '/api/test'
    });
    mockNext.and.returnValue(throwError(() => error403));

    
    TestBed.runInInjectionContext(() => {
      const result = authErrorInterceptor(mockRequest, mockNext);
      
      
      result.subscribe({
        next: () => {
          fail('Should have errored');
          done();
        },
        error: (error) => {
          expect(error).toBe(error403);
          expect(localStorage.getItem('auth-token')).toBeNull();
          expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/login']);
          expect(mockRouter.navigate).toHaveBeenCalledTimes(1);
          done();
        }
      });
    });
  });

  it('should not handle 400 error (should pass through)', (done) => {
    
    localStorage.setItem('auth-token', 'test-token');
    const error400 = new HttpErrorResponse({
      status: 400,
      statusText: 'Bad Request',
      url: '/api/test'
    });
    mockNext.and.returnValue(throwError(() => error400));

    
    TestBed.runInInjectionContext(() => {
      const result = authErrorInterceptor(mockRequest, mockNext);
      
      
      result.subscribe({
        next: () => {
          fail('Should have errored');
          done();
        },
        error: (error) => {
          expect(error).toBe(error400);
          expect(localStorage.getItem('auth-token')).toBe('test-token'); 
          expect(mockRouter.navigate).not.toHaveBeenCalled();
          done();
        }
      });
    });
  });

  it('should not handle 500 error (should pass through)', (done) => {
    
    localStorage.setItem('auth-token', 'test-token');
    const error500 = new HttpErrorResponse({
      status: 500,
      statusText: 'Internal Server Error',
      url: '/api/test'
    });
    mockNext.and.returnValue(throwError(() => error500));

    
    TestBed.runInInjectionContext(() => {
      const result = authErrorInterceptor(mockRequest, mockNext);
      
      
      result.subscribe({
        next: () => {
          fail('Should have errored');
          done();
        },
        error: (error) => {
          expect(error).toBe(error500);
          expect(localStorage.getItem('auth-token')).toBe('test-token'); 
          expect(mockRouter.navigate).not.toHaveBeenCalled();
          done();
        }
      });
    });
  });

  it('should handle 401 error even when no token exists in localStorage', (done) => {
    
    const error401 = new HttpErrorResponse({
      status: 401,
      statusText: 'Unauthorized',
      url: '/api/test'
    });
    mockNext.and.returnValue(throwError(() => error401));

    
    TestBed.runInInjectionContext(() => {
      const result = authErrorInterceptor(mockRequest, mockNext);
      
      
      result.subscribe({
        next: () => {
          fail('Should have errored');
          done();
        },
        error: (error) => {
          expect(error).toBe(error401);
          expect(localStorage.getItem('auth-token')).toBeNull();
          expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/login']);
          expect(mockRouter.navigate).toHaveBeenCalledTimes(1);
          done();
        }
      });
    });
  });

  it('should handle 403 error even when no token exists in localStorage', (done) => {
    
    const error403 = new HttpErrorResponse({
      status: 403,
      statusText: 'Forbidden',
      url: '/api/test'
    });
    mockNext.and.returnValue(throwError(() => error403));

    
    TestBed.runInInjectionContext(() => {
      const result = authErrorInterceptor(mockRequest, mockNext);
      
      
      result.subscribe({
        next: () => {
          fail('Should have errored');
          done();
        },
        error: (error) => {
          expect(error).toBe(error403);
          expect(localStorage.getItem('auth-token')).toBeNull();
          expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/login']);
          expect(mockRouter.navigate).toHaveBeenCalledTimes(1);
          done();
        }
      });
    });
  });

  it('should handle network errors (non-HTTP errors) by passing them through', (done) => {
    
    localStorage.setItem('auth-token', 'test-token');
    const networkError = new Error('Network connection failed');
    mockNext.and.returnValue(throwError(() => networkError));

    
    TestBed.runInInjectionContext(() => {
      const result = authErrorInterceptor(mockRequest, mockNext);
      
      
      result.subscribe({
        next: () => {
          fail('Should have errored');
          done();
        },
        error: (error) => {
          expect(error).toBe(networkError);
          expect(localStorage.getItem('auth-token')).toBe('test-token'); 
          expect(mockRouter.navigate).not.toHaveBeenCalled();
          done();
        }
      });
    });
  });
});