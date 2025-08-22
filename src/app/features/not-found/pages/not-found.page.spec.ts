import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

import { NotFoundPage } from './not-found.page';

describe('NotFoundPage', () => {
  let component: NotFoundPage;
  let fixture: ComponentFixture<NotFoundPage>;
  let mockFaIconLibrary: jasmine.SpyObj<FaIconLibrary>;

  beforeEach(async () => {
    const faIconLibrarySpy = jasmine.createSpyObj('FaIconLibrary', [
      'addIcons', 
      'getIconDefinition',
      'addIconPacks',
      'addIcon'
    ]);
    
    
    faIconLibrarySpy.getIconDefinition.and.returnValue({
      prefix: 'fas',
      iconName: 'exclamation-triangle',
      icon: [512, 512, [], 'f071', 'M256 40c118.621 0 216 96.075 216 216 0 119.291-96.61 216-216 216-119.244 0-216-96.562-216-216 0-119.203 96.602-216 216-216M119.107 206.107l-14.5 87c-.231 1.39.69 2.893 2.08 2.893h158.626c1.39 0 2.311-1.502 2.08-2.893l-14.5-87c-.231-1.39-1.311-2.107-2.7-2.107H121.807c-1.39 0-2.469.717-2.7 2.107zM256 352c17.673 0 32-14.327 32-32s-14.327-32-32-32-32 14.327-32 32 14.327 32 32 32z']
    });
    faIconLibrarySpy.addIcons.and.stub();
    faIconLibrarySpy.addIconPacks.and.stub();
    faIconLibrarySpy.addIcon.and.stub();

    await TestBed.configureTestingModule({
      imports: [NotFoundPage, FontAwesomeModule],
      providers: [
        { provide: FaIconLibrary, useValue: faIconLibrarySpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NotFoundPage);
    component = fixture.componentInstance;
    mockFaIconLibrary = TestBed.inject(FaIconLibrary) as jasmine.SpyObj<FaIconLibrary>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should inject FaIconLibrary and add exclamation triangle icon', () => {
    expect(mockFaIconLibrary.addIcons).toHaveBeenCalledWith(faExclamationTriangle);
  });

  it('should render main container with correct CSS classes', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const container = compiled.querySelector('.p-4.text-center.d-flex.gap-4.flex-column');
    expect(container).toBeTruthy();
  });

  it('should render heading with correct text', () => {
    fixture.detectChanges();
    const heading = fixture.nativeElement.querySelector('h1');
    expect(heading).toBeTruthy();
    expect(heading.textContent?.trim()).toBe('OPS.');
  });

  it('should render paragraph with correct text', () => {
    fixture.detectChanges();
    const paragraph = fixture.nativeElement.querySelector('p');
    expect(paragraph).toBeTruthy();
    expect(paragraph.textContent?.trim()).toBe('Página não existe!');
  });
});