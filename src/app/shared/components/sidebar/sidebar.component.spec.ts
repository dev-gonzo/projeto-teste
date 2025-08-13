import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SidebarComponent } from './sidebar.component';
import { AuthService } from '../../../core/services';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate'], { url: '/home' });
    mockAuthService = jasmine.createSpyObj('AuthService', ['logout']);

    await TestBed.configureTestingModule({
      declarations: [SidebarComponent],
      imports: [FontAwesomeModule],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve ser criado com sucesso', () => {
    expect(component).toBeTruthy();
  });

  it('deve inicializar com a rota atual fornecida pelo Router', () => {
    expect(component.currentRoute).toBe('/home');
  });

  it('deve alternar a visibilidade da sidebar e emitir o evento collapseChange', () => {
    spyOn(component.collapseChange, 'emit');

    expect(component.isCollapsed).toBe(false);

    component.toggleCollapse();
    expect(component.isCollapsed).toBe(true);
    expect(component.collapseChange.emit).toHaveBeenCalledWith(true);

    component.toggleCollapse();
    expect(component.isCollapsed).toBe(false);
    expect(component.collapseChange.emit).toHaveBeenCalledWith(false);
  });

  it('deve atualizar a propriedade currentRoute', () => {
    component.updateRoute('/upload');
    expect(component.currentRoute).toBe('/upload');
  });

  describe('método open()', () => {
    it('deve expandir o menu e emitir o evento quando estiver colapsado', () => {
      spyOn(component.collapseChange, 'emit');
      component.isCollapsed = true; 

      component.open(0); 

      expect(component.isCollapsed).toBe(false);
      expect(component.collapseChange.emit).toHaveBeenCalledWith(false);
    });

    it('não deve fazer nada se o menu já estiver expandido', () => {
      spyOn(component.collapseChange, 'emit');
      component.isCollapsed = false;  

      component.open(0);

      expect(component.isCollapsed).toBe(false);
      expect(component.collapseChange.emit).not.toHaveBeenCalled();
    });
  });

  it('deve emitir o evento para abrir o modal de logout ao chamar confirmLogout', () => {
    spyOn(component.openLogoutModal, 'emit');
    component.confirmLogout();
    expect(component.openLogoutModal.emit).toHaveBeenCalled();
  });

  it('deve chamar o logout do serviço e navegar para a tela de login', () => {
    component.logout();

    expect(mockAuthService.logout).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/login']);
  });

  it('deve conter os links principais e de configuração corretamente', () => {
    expect(component.sidebarRoutes.length).toBe(4);
    expect(component.sidebarRoutes[0].title).toBe('Dashboard');

    expect(component.sidebarDownRoutes).toEqual([
      {
        icon: faGear,
        title: 'Configurações',
        url: '/configuracoes',
      },
    ]);
  });
});