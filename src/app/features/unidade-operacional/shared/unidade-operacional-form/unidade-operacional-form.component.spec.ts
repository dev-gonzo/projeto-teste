import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnidadeOperacionalFormComponent } from './unidade-operacional-form.component';

describe('UnidadeOperacionalFormComponent', () => {
  let component: UnidadeOperacionalFormComponent;
  let fixture: ComponentFixture<UnidadeOperacionalFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnidadeOperacionalFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnidadeOperacionalFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
