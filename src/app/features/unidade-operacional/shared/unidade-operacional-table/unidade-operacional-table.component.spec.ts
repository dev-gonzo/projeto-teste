import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnidadeOperacionalTableComponent } from './unidade-operacional-table.component';

describe('UnidadeOperacionalTableComponent', () => {
  let component: UnidadeOperacionalTableComponent;
  let fixture: ComponentFixture<UnidadeOperacionalTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnidadeOperacionalTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnidadeOperacionalTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
