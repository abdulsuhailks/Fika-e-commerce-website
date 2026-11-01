import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

declare var Razorpay: any;

@Component({
  selector: 'app-razorpay',
  templateUrl: './razorpay.component.html',
  styleUrls: ['./razorpay.component.css']
})
export class RazorpayComponent {

  name = '';
  email = '';
  amount = 0;

  constructor(private http: HttpClient) {}

  pay() {
    const paymentData = {
      name: this.name,
      email: this.email,
      amount: this.amount
    };

    this.http.post<any>('http://127.0.0.1:8000/api/create-payment/', paymentData)
      .subscribe(data => {
        const options = {
          key: data.key,
          amount: data.amount,
          currency: data.currency,
          name: "Turf Booking",
          description: "Thanks for payment.",
          order_id: data.order_id,   // Razorpay order_id
          handler: (response: any) => {
            // Send all required details to backend for verification
            this.http.post('http://127.0.0.1:8000/api/payment-success/', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              order_id: data.db_order_id  // your DB order id from backend (if you add it)
            }).subscribe({
              next: () => alert('Payment Successful!'),
              error: () => alert('Payment verification failed!')
            });
          },
          prefill: {
            name: data.name,
            email: data.email,
          },
          theme: {
            color: "#F37254"
          }
        };

        const rzp = new Razorpay(options);
        rzp.open();
      });
  }
}

