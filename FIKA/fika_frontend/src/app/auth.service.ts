import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {}


  login(token: string, userId: number, isAdmin: boolean = false): void {
    localStorage.setItem('token', token);
    localStorage.setItem('user_id', userId.toString());
    localStorage.setItem('is_admin', isAdmin ? 'true' : 'false');
    console.log('User logged in with token:', token, 'isAdmin:', isAdmin);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('is_admin');
  }
  isAdmin(): boolean {
    return localStorage.getItem('is_admin') === 'true';
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserId(): string | null {
    return localStorage.getItem('user_id');
  }

  checkProductInCart(data: any) {
    return this.http.post('http://127.0.0.1:8000/check_product_in_cart/', data);
  }
}

