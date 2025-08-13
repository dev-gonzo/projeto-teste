import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NaoAutorizadoComponent } from './nao-autorizado.component';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

describe('NaoAutorizadoComponent', () => {
  let component: NaoAutorizadoComponent;
  let fixture: ComponentFixture<NaoAutorizadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NaoAutorizadoComponent, RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(NaoAutorizadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the unauthorized access message', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('p')?.textContent)
      .toContain('Acesso não autorizado');
  });

  it('should display the unauthorized image', () => {
    const img = fixture.debugElement.query(By.css('img')).nativeElement as HTMLImageElement;
    expect(img.src).toContain('assets/img/usuario-nao-autorizado.jpg');
    expect(img.alt).toBe('Ilustração do erro não autorizado');
  });

  it('should have a button with routerLink to /home', () => {
    const button = fixture.debugElement.query(By.css('button')).nativeElement as HTMLButtonElement;
    expect(button.getAttribute('ng-reflect-router-link')).toBe('/home');
    expect(button.textContent?.trim()).toBe('Voltar para a Home');
  });
});
