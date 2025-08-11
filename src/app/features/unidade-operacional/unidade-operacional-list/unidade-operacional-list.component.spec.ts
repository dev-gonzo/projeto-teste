import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnidadeOperacionalListComponent } from './unidade-operacional-list.component';

describe('UnidadeOperacionalListComponent', () => {
  let component: UnidadeOperacionalListComponent;
  let fixture: ComponentFixture<UnidadeOperacionalListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnidadeOperacionalListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnidadeOperacionalListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
