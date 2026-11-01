import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-adminhome',
  templateUrl: './adminhome.component.html',
  styleUrls: ['./adminhome.component.css']
})
export class AdminhomeComponent {

  constructor(private router: Router, private authService: AuthService) { }

  addproduct() {
    this.router.navigate(['/add_product']);
  }

  viewproduct() {
    this.router.navigate(['/view_product']);
  }

 View_sold_products(){
    this.router.navigate(['/sold_products']);
  }

  logout(){
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  
}
