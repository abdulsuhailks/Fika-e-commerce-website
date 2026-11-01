// import { Component } from '@angular/core';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-payment',
//   templateUrl: './payment.component.html',
//   styleUrls: ['./payment.component.css']
// })
// export class PaymentComponent {
// orderData: any;

//   constructor(private router: Router) {
//     const navigation = this.router.getCurrentNavigation();
// this.orderData = navigation?.extras.state?.['order'];
//   }

//   ngOnInit(): void {
//     console.log('Received Order Data:', this.orderData);
//     // You can now use orderData.product, orderData.total_price, etc. in the template
//   }
// }




import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

declare var Razorpay: any;

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  orderData: any;

  constructor(private router: Router, private http: HttpClient) {
    const navigation = this.router.getCurrentNavigation();
    this.orderData = navigation?.extras.state?.['order'];
  }

  ngOnInit(): void {
    console.log('Received Order Data:', this.orderData);
  }

payNow(): void {
  if (!this.orderData) {
    alert('Order data not available.');
    return;
  }

  // Handle both single order and bulk orders
  const isBulkOrder = Array.isArray(this.orderData.orders);
  const orders = isBulkOrder ? this.orderData.orders : [this.orderData.order];
  const totalAmount = isBulkOrder ? this.orderData.total_price : parseFloat(this.orderData.order.total_price);
  
  // Get first order for user details
  const firstOrder = orders[0];
  const amount = totalAmount * 100; 

  this.http.post<any>('http://127.0.0.1:8000/api/create-payment/', {
    amount: totalAmount,
    order_ids: orders.map((o: any) => o.id).join(','),
    name: firstOrder.user?.username || 'Test User',
    email: firstOrder.user?.email || 'test@example.com'
  }).subscribe(data => {
    const options = {
      key: data.key,
      amount: data.amount,
      currency: 'INR',
      name: 'Turf Store',
      description: isBulkOrder ? `Bulk Order - ${orders.length} items` : 'Order Payment',
      order_id: data.order_id,
      handler: (response: any) => {
        // Update payment status for all orders
        orders.forEach((order: any) => {
          this.http.post<any>('http://127.0.0.1:8000/api/payment-success/', {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            order_id: order.id
          }).subscribe((res) => {
            console.log('Order payment updated:', res);
          }, err => {
            console.error("Payment success callback failed:", err);
          });
        });

        alert("Payment successful!");
        console.log(response, "/////////////////////")

        this.router.navigate(['/viewcart'], {
          state: { paymentStatus: 'Paid' }
        });
      },
      prefill: {
        name: firstOrder.user?.username || 'Test User',
        email: firstOrder.user?.email || 'test@example.com'
      },
      theme: {
        color: '#3399cc'

        
      }
    };

    const rzp = new Razorpay(options);
    rzp.open();
  }, err => {
    console.error('Error creating Razorpay order:', err);
    alert('Failed to initiate payment. Try again later.');
  });
}
}
