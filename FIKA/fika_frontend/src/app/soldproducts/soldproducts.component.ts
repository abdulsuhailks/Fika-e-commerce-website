import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-soldproducts',
  templateUrl: './soldproducts.component.html',
  styleUrls: ['./soldproducts.component.css']
})
export class SoldproductsComponent implements OnInit {

  soldProducts: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadSoldProducts();
  }

loadSoldProducts() {
  this.http.get('http://127.0.0.1:8000/sold_products/')
    .subscribe(
      (res: any) => {
        this.soldProducts = res.orders;   // ✅ FIXED
      },
      (err) => {
        console.log("Error loading sold products", err);
      }
    );
}

deliverOrder(orderId: number) {
  if (!confirm('Mark this order as dispatched?')) return;
  this.http.put(`http://127.0.0.1:8000/deliver_order/${orderId}/`, {}).subscribe(
    (res: any) => {
      console.log('Order dispatched:', res);
      const updated = res.order || res;
      this.soldProducts = this.soldProducts.map(o => o.id === updated.id ? updated : o);
    },
    (err) => {
      console.error('Failed to mark order dispatched', err);
      alert('Failed to mark order dispatched');
    }
  );
}


}