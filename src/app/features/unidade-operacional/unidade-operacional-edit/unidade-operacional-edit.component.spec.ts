import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnidadeOperacionalEditComponent } from './unidade-operacional-edit.component';

describe('UnidadeOperacionalEditComponent', () => {
  let component: UnidadeOperacionalEditComponent;
  let fixture: ComponentFixture<UnidadeOperacionalEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnidadeOperacionalEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnidadeOperacionalEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
