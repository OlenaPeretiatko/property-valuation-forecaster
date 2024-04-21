import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private activeRequests = 0;
  private isLoading = new BehaviorSubject<boolean>(false);
  public readonly isLoading$ = this.isLoading.asObservable();

  requests: { url: string; count: number }[] = [];

  constructor() {}

  show(url: string) {
    this.activeRequests++;
    this.isLoading.next(this.activeRequests > 0);
  }

  hide(url: string) {
    console.log('hide');
    this.activeRequests--;

    if (this.activeRequests === 0) {
      this.isLoading.next(false);
    }
  }
}
