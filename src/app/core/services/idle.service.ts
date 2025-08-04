import { Injectable, NgZone } from '@angular/core';
import { Subject, Subscription, timer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IdleService {
  private idleTime = 0;
  private warningTime = 50 * 60;
  private logoutTime = 60 * 60;
  private timerSub? : Subscription;

  public onWarning = new Subject<number>();
  public onLogout = new Subject<void>();
  public onActive = new Subject<void>();

  constructor(private ngZone: NgZone) { }

  startWatching() {
    this.ngZone.runOutsideAngular(() => {
      document.addEventListener('mousemove', this.reset.bind(this));
      document.addEventListener('keydown', this.reset.bind(this));
      document.addEventListener('click', this.reset.bind(this));
      document.addEventListener('touchstart', this.reset.bind(this));
    });
    this.idleTime = 0;
    this.startTimer();
  }

  stopWatching() {
    window.removeEventListener('mousemove', this.reset.bind(this));
    window.removeEventListener('keydown', this.reset.bind(this));
    window.removeEventListener('mousedown', this.reset.bind(this));
    window.removeEventListener('touchstart', this.reset.bind(this));
    this.timerSub?.unsubscribe();
  }

  private startTimer(){
    this.timerSub = timer(0, 1000).subscribe(() => {
      this.idleTime++;
      if(this.idleTime === this.warningTime){
        this.onWarning.next(this.logoutTime - this.idleTime);
      }
      if(this.idleTime > this.warningTime && this.idleTime < this.logoutTime){
        this.onWarning.next(this.logoutTime - this.idleTime);
      }
      if(this.idleTime >= this.logoutTime){
        this.onLogout.next();
        this.stopWatching();
      }
    });
  }

  private reset(){
    if(this.idleTime >= this.warningTime){
      this.onWarning.next(this.logoutTime - this.idleTime);
    }

    if(this.idleTime >= this.warningTime){
      this.onActive.next(); 
    }
    this.idleTime = 0;
  }
}
