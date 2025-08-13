import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { interval, Subscription } from 'rxjs';
import { ERROR_MESSAGES } from '../../constants/mensagens';

const ONE_SECOND_IN_MS = 1000;
const HOME_ROUTE = 'home';

@Component({
  selector: 'app-erro',
  standalone: true,
  templateUrl: './erro.component.html',
  styleUrl: './erro.component.scss'
})
export class ErroComponent implements OnInit, OnDestroy {
  messages = ERROR_MESSAGES.INTERNAL_SERVER_ERROR;
  cooldownTime = 10;
  private cooldownSubscription?: Subscription;

  constructor(private router: Router, private location: Location) {}

  ngOnInit(): void {
    this.startCooldown();
  }

  ngOnDestroy(): void {
    this.cooldownSubscription?.unsubscribe();
  }

  startCooldown() {
    this.cooldownSubscription = interval(ONE_SECOND_IN_MS).subscribe(() => {
      this.cooldownTime--;
      if (this.cooldownTime <= 0) {
        this.cooldownSubscription?.unsubscribe();
        this.router.navigate([HOME_ROUTE]);
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
