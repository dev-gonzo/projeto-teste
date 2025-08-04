import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';

describe('NavbarComponent', () => {
  let component: NavbarComponent;

  beforeEach(() => {
    component = new NavbarComponent();
  });

  it('deve ser criado', () => {
    expect(component).toBeTruthy();
  });

  it('deve ter o nome do usuário definido', () => {
    expect(component.usuario).toBe('Nome do Usuário');
  });

  it('deve ter a unidade operacional definida', () => {
    expect(component.unidade_operacional).toBe('Unidade Operacional');
  });

  it('deve ter a unidade operacional atual definida', () => {
    expect(component.unidade_operacional_atual).toBe('70 DP Tatuapé');
  });
});
