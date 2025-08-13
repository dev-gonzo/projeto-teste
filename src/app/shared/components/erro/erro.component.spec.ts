import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ErroComponent } from './erro.component';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { of } from 'rxjs';

describe('ErroComponent', () => {
  let component: ErroComponent;
  let fixture: ComponentFixture<ErroComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let locationSpy: jasmine.SpyObj<Location>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    locationSpy = jasmine.createSpyObj('Location', ['back']);

    await TestBed.configureTestingModule({
      imports: [ErroComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: Location, useValue: locationSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ErroComponent);
    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve exibir o valor inicial do cooldown no template', () => {
    component.cooldownTime = 5;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('p.text-sm')?.textContent)
      .toContain('5 segundos');
  });

  it('deve decrementar o cooldown a cada segundo e redirecionar quando chegar a zero', fakeAsync(() => {
    component.cooldownTime = 3;
    fixture.detectChanges();
    component.startCooldown();

    tick(1000);
    expect(component.cooldownTime).toBe(2);

    tick(1000);
    expect(component.cooldownTime).toBe(1);

    tick(1000);
    expect(component.cooldownTime).toBe(0);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['home']);
  }));

  it('deve chamar location.back() quando goBack() é acionado e houver histórico', () => {
    (window.history as any).length = 2;
    component.goBack();
    expect(locationSpy.back).toHaveBeenCalled();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('deve navegar para home quando goBack() é acionado e não houver histórico', () => {
    (window.history as any).length = 1;
    component.goBack();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['home']);
    expect(locationSpy.back).not.toHaveBeenCalled();
  });
});
