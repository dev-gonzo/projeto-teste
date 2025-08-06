import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnidadeOperacionalHistoricoFilterComponent } from './unidade-operacional-historico-filter.component';

describe('UnidadeOperacionalHistoricoFilterComponent', () => {
  let component: UnidadeOperacionalHistoricoFilterComponent;
  let fixture: ComponentFixture<UnidadeOperacionalHistoricoFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnidadeOperacionalHistoricoFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnidadeOperacionalHistoricoFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
