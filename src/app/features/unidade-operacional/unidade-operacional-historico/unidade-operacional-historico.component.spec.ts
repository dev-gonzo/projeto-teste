import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnidadeOperacionalHistoricoComponent } from './unidade-operacional-historico.component';

describe('UnidadeOperacionalHistoricoComponent', () => {
  let component: UnidadeOperacionalHistoricoComponent;
  let fixture: ComponentFixture<UnidadeOperacionalHistoricoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnidadeOperacionalHistoricoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnidadeOperacionalHistoricoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
