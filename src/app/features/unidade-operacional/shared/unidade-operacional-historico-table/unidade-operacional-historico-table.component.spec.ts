import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnidadeOperacionalHistoricoTableComponent } from './unidade-operacional-historico-table.component';

describe('UnidadeOperacionalHistoricoTableComponent', () => {
  let component: UnidadeOperacionalHistoricoTableComponent;
  let fixture: ComponentFixture<UnidadeOperacionalHistoricoTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnidadeOperacionalHistoricoTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnidadeOperacionalHistoricoTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
