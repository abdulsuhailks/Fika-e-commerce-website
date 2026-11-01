import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import * as $ from 'jquery';
import { count } from 'rxjs';

@Component({
  selector: 'app-userhome',
  templateUrl: './userhome.component.html',
  styleUrls: ['./userhome.component.css']
})
export class UserhomeComponent implements OnInit {
  products: any[] = [];
  


  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.http.get<any[]>('http://127.0.0.1:8000/one_product_per_category').subscribe(
      res => this.products = res,
      err => console.error(err)
    );
    
  const user = this.authService.getUserId();
  console.log('User found:', user);


  }

  viewCategory(category: string): void {
    this.router.navigate(['/productsbycategory', category]);
  }

  
  searchQuery = '';

  search() {
    if (this.searchQuery.trim()) {
      console.log('Search query:', this.searchQuery);
      this.router.navigate(['/search'], { queryParams: { query: this.searchQuery } });
    }
  }


  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }


  viewcart(): void {
    this.router.navigate(['/viewcart']);

  }


  addaddress(): void {
    this.router.navigate(['/add_address']);
  }


  isSidebarOpen = false;

toggleSidebar() {
  this.isSidebarOpen = !this.isSidebarOpen;
}

viewProfile(): void {
  this.router.navigate(['/view_edit_product']);

}

orders(): void {
  this.router.navigate(['/view_orders']);
}


Logout(){
  this.authService.logout();
  this.router.navigate(['/login']);
  console.log('User logged out');
}



}
