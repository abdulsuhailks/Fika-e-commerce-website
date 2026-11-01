import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-vieworders',
  templateUrl: './vieworders.component.html',
  styleUrls: ['./vieworders.component.css']
})
export class ViewordersComponent implements OnInit {
  orders: any[] = [];
  quantity: any;
  // router: any;

  constructor(private http: HttpClient , private router: Router, private authService: AuthService) { }
  
  ngOnInit(): void {
    const userId = this.authService.getUserId();
    this.http.get<any>(`http://127.0.0.1:8000/get_orders/${userId}/`).subscribe(
      res => {
        console.log('Orders:', res.orders);
        this.orders = res.orders;
      },
      err => {
        console.error('Error fetching orders:', err);
      }
    );
  }

  cancel_order(orderId: number): void {
    console.log('Cancelling order with ID:', orderId);
    this.http.put(`http://127.0.0.1:8000/cancel_order/${orderId}/`, {}).subscribe(
      res => {
        console.log('Order cancelled:', res);
        // Update the cancelled order in-place so it remains visible with updated status
        const updatedOrder = (res as any).order || (res as any);
        this.orders = this.orders.map(order => {
          if (order.id === updatedOrder.id) {
            return updatedOrder;
          }
          return order;
        });
      },
      err => {
        console.error('Error cancelling order:', err);
      }
    );
  }



paynow(orderId: any) {
  const user = this.authService.getUserId();
  const payload = {
    user_id: user,
    product_id: orderId,
    price: this.orders.find(order => order.id === orderId)?.price || 0,
    quantity: this.orders.find(order => order.id === orderId)?.quantity || 1
  };

  console.log('Navigating to select_address with payload:', payload);
  this.router.navigate(['/select_address'], { state: { payload } });
}

  
}