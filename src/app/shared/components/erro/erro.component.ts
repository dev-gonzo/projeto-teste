import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-erro',
  standalone: true,
  templateUrl: './erro.component.html',
  styleUrl: './erro.component.scss'
})
export class ErroComponent implements OnInit, OnDestroy {
  cooldownTime = 5;
  private cooldownSubscription?: Subscription;

  constructor(private router: Router, private location: Location) {}

  ngOnInit(): void {
    this.startCooldown();
  }

  ngOnDestroy(): void {
    this.cooldownSubscription?.unsubscribe();
  }

  startCooldown() {
    this.cooldownSubscription = interval(1000).subscribe(() => {
      this.cooldownTime--;
      if (this.cooldownTime <= 0) {
        this.cooldownSubscription?.unsubscribe();
        this.router.navigate(['home']);
      }
    });
  }

  goBack() {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['home']);
    }
  }
}
