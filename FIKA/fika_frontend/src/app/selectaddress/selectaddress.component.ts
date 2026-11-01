import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-selectaddress',
  templateUrl: './selectaddress.component.html',
  styleUrls: ['./selectaddress.component.css']
})
export class SelectaddressComponent implements OnInit {
  payload = history.state.payload;
  addresses: any[] = [];
  user: any = '';

  address = {
    user: '',
    address_line: '',
    city: '',
    state: '',
    postal_code: '',
    country: ''
  };

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {
    this.user = this.authService.getUserId();
    this.address.user = this.user;
    console.log('User ID in constructor:',history.state.payload);
  }

  ngOnInit(): void {
    console.log('Payload:', this.payload);
    console.log('User found:', this.user);
    this.fetchAddresses();
  }

  fetchAddresses() {
    this.http.get<any[]>(`http://127.0.0.1:8000/get_address/${this.user}/`).subscribe(
      (response) => {
        console.log('Addresses:', response);
        this.addresses = response;
      },
      (error) => {
        console.error('Error fetching addresses:', error);
      }
    );
  }

selectAddress(address: any) {
  // Check if payload is an array (Buy All) or single item (Buy Now)
  const isMultipleItems = Array.isArray(this.payload);
  console.log("Is Multiple Items:", isMultipleItems);
  console.log("Payload:", this.payload);

  if (isMultipleItems) {
    // Handle multiple items (Buy All Now)
    const payload1 = {
      user_id: this.user,
      items: this.payload.map((item: any) => ({
        product_id: item.product_id,
        price: item.price,
        quantity: item.quantity
      })),
      address_id: address.id
    };

    console.log("Multiple Items Payload:", payload1);

    this.http.post('http://127.0.0.1:8000/place_bulk_order/', payload1).subscribe(
      (res: any) => {
        console.log('Bulk orders placed successfully', res);
        this.router.navigate(['/payment'], { state: { order: res } });
      },
      (err) => {
        console.error('Error placing bulk order:', err);
        alert('Failed to place bulk order');
      }
    );
  } else {
    // Handle single item (Buy Now)
    const item = this.payload;
    const payload1 = {
      user_id: this.user,
      product_id: item.product_id,
      price: item.price,
      quantity: item.quantity,
      address_id: address.id
    };

    console.log("Single Item Payload:", payload1);

    this.http.post('http://127.0.0.1:8000/place_order/', payload1).subscribe(
      (res: any) => {
        console.log('Order placed successfully', res);
        this.router.navigate(['/payment'], { state: { order: res } });
      },
      (err) => {
        console.error('Error placing order:', err);
        alert('Failed to place order');
      }
    );
  }
}



  submitAddress() {
    this.address.user = this.user;
    this.http.post('http://127.0.0.1:8000/add_address/', this.address).subscribe(
      (res) => {
        console.log('Address added successfully', res);
        this.fetchAddresses();  // Refresh the address list after submission

        // Optionally clear form fields
        this.address = {
          user: this.user,
          address_line: '',
          city: '',
          state: '',
          postal_code: '',
          country: ''
        };
      },
      (err) => {
        console.error('Failed to add address', err);
        alert('Failed to add address');
      }
    );
  }
}
