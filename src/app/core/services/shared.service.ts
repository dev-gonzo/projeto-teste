import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private readonly loginSubject = new Subject<void>();
  private readonly registerSubject = new Subject<void>();

  login$: Observable<void> = this.loginSubject.asObservable();
  register$: Observable<void> = this.registerSubject.asObservable();

  constructor() {}

  triggerLoginEvent(): void {
    this.loginSubject.next();
  }

  triggerRegisterEvent(): void {
    this.registerSubject.next();
  }
}
