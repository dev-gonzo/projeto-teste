import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnidadeOperacionalNewComponent } from './unidade-operacional-new.component';

describe('UnidadeOperacionalNewComponent', () => {
  let component: UnidadeOperacionalNewComponent;
  let fixture: ComponentFixture<UnidadeOperacionalNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnidadeOperacionalNewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnidadeOperacionalNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
