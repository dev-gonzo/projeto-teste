import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnidadeOperacionalUploadComponent } from './unidade-operacional-upload.component';

describe('UnidadeOperacionalUploadComponent', () => {
  let component: UnidadeOperacionalUploadComponent;
  let fixture: ComponentFixture<UnidadeOperacionalUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnidadeOperacionalUploadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnidadeOperacionalUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
