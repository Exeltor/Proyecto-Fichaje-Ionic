import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  private user: string;

  constructor() { }

  setUser(username: string) {
    this.user = username;
  }

  getUser() {
    return this.user;
  }
}
