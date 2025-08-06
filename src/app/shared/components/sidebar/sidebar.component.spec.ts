import { SidebarComponent } from './sidebar.component';
import { Router } from '@angular/router';
import { faGear } from '@fortawesome/free-solid-svg-icons';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let mockRouter: any;

  beforeEach(() => {
    mockRouter = { url: '/home' };
    component = new SidebarComponent(mockRouter as Router);
  });

  it('deve inicializar com a rota atual do router', () => {
    expect(component.currentRoute).toBe('/home');
  });

  it('deve alternar a visibilidade da sidebar e emitir o evento', () => {
    spyOn(component.collapseChange, 'emit');

    expect(component.isCollapsed).toBe(false);

    component.toggleCollapse();

    expect(component.isCollapsed).toBe(true);
    expect(component.collapseChange.emit).toHaveBeenCalledWith(true);
  });

  it('deve atualizar a rota atual', () => {
    component.updateRoute('/upload');
    expect(component.currentRoute).toBe('/upload');
  });

  it('deve expandir o menu quando estiver colapsado', () => {
    spyOn(component.collapseChange, 'emit');

    component.isCollapsed = true;
    component.open(0);

    expect(component.isCollapsed).toBe(false);
    expect(component.collapseChange.emit).toHaveBeenCalledWith(false);
  });

  it('não deve emitir evento se o menu não estiver colapsado', () => {
    spyOn(component.collapseChange, 'emit');

    component.isCollapsed = false;
    component.open(0);

    expect(component.collapseChange.emit).not.toHaveBeenCalled();
  });

  it('deve conter os links principais e de configuração', () => {
    expect(component.sidebarRoutes.length).toBeGreaterThan(0);
    expect(component.sidebarDownRoutes).toEqual([
      {
        icon: faGear,
        title: 'Configurações',
        url: '/',
      },
    ]);
  });
});
