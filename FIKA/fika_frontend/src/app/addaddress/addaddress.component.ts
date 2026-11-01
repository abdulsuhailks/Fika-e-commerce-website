import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-addaddress',
  templateUrl: './addaddress.component.html',
  styleUrls: ['./addaddress.component.css']
})
export class AddaddressComponent {

user: any = '';


address = {
    user: '',
    address_line: '',
    city: '',
    state: '',
    postal_code: '',
    country: ''
  };

  constructor(private http: HttpClient, private authService: AuthService, private router: Router) {
    this.user = this.authService.getUserId(); // ensure user ID is set
    this.address.user = this.user;
  }

  submitAddress() {
    this.http.post('http://127.0.0.1:8000/add_address/', this.address).subscribe(
      res => alert('Address added successfully'),
      err => alert('Failed to add address')
    );
    
    this.router.navigate(['/user']);

  }
}