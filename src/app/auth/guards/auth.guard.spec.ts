import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: typeof AuthGuard;
  let router: jasmine.SpyObj<Router>;
  let localStorageSpy: jasmine.Spy;
  let mockRoute: ActivatedRouteSnapshot;
  let mockState: RouterStateSnapshot;
  let _dateNowSpy: jasmine.Spy;

  beforeEach(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerSpy }
      ]
    });

    guard = AuthGuard;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    
    mockRoute = {} as ActivatedRouteSnapshot;
    mockState = {} as RouterStateSnapshot;

    
    localStorageSpy = spyOn(localStorage, 'getItem');
    spyOn(localStorage, 'removeItem');
    
    
    _dateNowSpy = spyOn(Date, 'now').and.returnValue(1000000 * 1000);
  });

  describe('when token is missing', () => {
    it('should redirect to login and return false when no token in localStorage', () => {
      localStorageSpy.and.returnValue(null);

      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));

      expect(result).toBe(false);
      expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
    });

    it('should redirect to login and return false when token is empty string', () => {
      localStorageSpy.and.returnValue('');

      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));

      expect(result).toBe(false);
      expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
    });
  });

  describe('when token is present', () => {
    it('should return true for valid JWT token without expiration', () => {
      
      const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
      localStorageSpy.and.returnValue(validToken);

      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));

      expect(result).toBe(true);
      expect(localStorageSpy).toHaveBeenCalledWith('auth-token');
    });

    it('should return true for valid JWT token with future expiration', () => {
      
      const futureToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiZXhwIjoyMDAwMDAwfQ.Cpnz6c7L4QnOhJzL-wkL5Jz9X8X9X8X9X8X9X8X9X8X';
      localStorageSpy.and.returnValue(futureToken);

      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));

      expect(result).toBe(true);
    });

    it('should redirect to login and return false for expired JWT token', () => {
      
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiZXhwIjo1MDAwMDB9.Cpnz6c7L4QnOhJzL-wkL5Jz9X8X9X8X9X8X9X8X9X8Y';
      localStorageSpy.and.returnValue(expiredToken);

      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));

      expect(result).toBe(false);
      expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
      expect(localStorage.removeItem).toHaveBeenCalledWith('auth-token');
    });

    it('should redirect to login and return false for token expiring exactly now', () => {
      
      
      
      
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiZXhwIjo5OTk5OTl9.Cpnz6c7L4QnOhJzL-wkL5Jz9X8X9X8X9X8X9X8X9X8Z';
      localStorageSpy.and.returnValue(expiredToken);

      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));

      expect(result).toBe(false);
      expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
      expect(localStorage.removeItem).toHaveBeenCalledWith('auth-token');
    });

    it('should redirect to login and return false for invalid JWT token format', () => {
      localStorageSpy.and.returnValue('invalid-token-format');

      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));

      expect(result).toBe(false);
      expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
      expect(localStorage.removeItem).toHaveBeenCalledWith('auth-token');
    });

    it('should redirect to login and return false for malformed JWT token', () => {
      localStorageSpy.and.returnValue('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid-payload.signature');

      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));

      expect(result).toBe(false);
      expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
      expect(localStorage.removeItem).toHaveBeenCalledWith('auth-token');
    });
  });
});