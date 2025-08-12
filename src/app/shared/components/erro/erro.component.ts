import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-erro',
  standalone: true,
  templateUrl: './erro.component.html',
  styleUrl: './erro.component.scss'
})
export class ErroComponent implements OnInit, OnDestroy {
  cooldownTime = 5;
  private intervalId?: any;

  constructor(private router: Router, private location: Location) {}

  ngOnInit(): void {
    this.startCooldown();
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  startCooldown() {
    this.intervalId = setInterval(() => {
      this.cooldownTime--;

      if (this.cooldownTime <= 0) {
        clearInterval(this.intervalId);
        this.router.navigate(['home']);
      }
    }, 1000);
  }

  goBack() {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['home']);
    }
  }
}
