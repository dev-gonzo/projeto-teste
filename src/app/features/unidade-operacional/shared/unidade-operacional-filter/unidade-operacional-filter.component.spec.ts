import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnidadeOperacionalFilterComponent } from './unidade-operacional-filter.component';

describe('UnidadeOperacionalFilterComponent', () => {
  let component: UnidadeOperacionalFilterComponent;
  let fixture: ComponentFixture<UnidadeOperacionalFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnidadeOperacionalFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnidadeOperacionalFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
