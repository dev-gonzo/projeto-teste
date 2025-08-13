import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NaoEncontradaComponent } from './nao-encontrada.component';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  template: `<p>Home Page</p>`
})
class DummyHomeComponent {}

describe('NaoEncontradaComponent', () => {
  let component: NaoEncontradaComponent;
  let fixture: ComponentFixture<NaoEncontradaComponent>;
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'home', component: DummyHomeComponent }
        ]),
        NaoEncontradaComponent
      ],
      declarations: [DummyHomeComponent]
    }).compileComponents();

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    fixture = TestBed.createComponent(NaoEncontradaComponent);
    component = fixture.componentInstance;
    router.initialNavigation();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the "404: Página não encontrada" message', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('404: Página não encontrada');
  });

  it('should have a button with routerLink="/home"', () => {
    const button = fixture.debugElement.query(By.css('button'));
    expect(button).toBeTruthy();
    const routerLink = button.attributes['ng-reflect-router-link'];
    expect(routerLink).toBe('/home');
  });

  it('should navigate to /home when the button is clicked', async () => {
    const button = fixture.debugElement.query(By.css('button')).nativeElement;
    button.click();
    await fixture.whenStable();
    expect(location.path()).toBe('/home');
  });
});
