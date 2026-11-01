import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-viewcart',
  templateUrl: './viewcart.component.html',
  styleUrls: ['./viewcart.component.css']
})
export class ViewcartComponent implements OnInit, OnDestroy {
  cartItems: any[] = [];
  totalPrice: number = 0;
  private routerSub: Subscription | null = null;

  constructor(private http: HttpClient, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // initial load
    this.loadCart();

    // reload cart whenever navigation ends on this route (handles returning from payment)
    this.routerSub = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((ev) => {
      // if current url ends with viewcart, reload
      if (this.router.url.includes('/viewcart')) {
        this.loadCart();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.routerSub) {
      this.routerSub.unsubscribe();
      this.routerSub = null;
    }
  }

  loadCart(): void {
    const userId = this.authService.getUserId();
    if (!userId) return;
    this.http.get<any[]>(`http://127.0.0.1:8000/view_cart/${userId}/`).subscribe(
      data => {
        this.cartItems = data || [];
        this.totalPrice = this.cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      },
      err => {
        console.error('Error loading cart:', err);
      }
    );
  }

  viewProduct(id: number): void {
    this.router.navigate(['/product', id]);
  }

  removeFromCart(cartItemId: number): void {
  if (confirm("Are you sure you want to delete this item?")) {
    this.http.delete(`http://127.0.0.1:8000/delete_cart_item/${cartItemId}`).subscribe(
      (res: any) => {
        alert("Item deleted successfully!");

        this.cartItems = this.cartItems.filter(item => item.id !== cartItemId);

        this.totalPrice = this.cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      },
      (err) => {
        console.error("Failed to delete cart item", err);
        alert("Error deleting item.");
      }
    );
  }
}

  incrementQuantity(item: any): void {
    const cartId = item.id;
    this.http.put<any>(`http://127.0.0.1:8000/update_cart_item/${cartId}/`, { delta: 1 }).subscribe(
      res => {
        // If backend returns deleted, remove from local list
        if (res && (res.deleted === true)) {
          this.cartItems = this.cartItems.filter(ci => ci.id !== cartId);
        } else {
          // update returned item
          const updated = res;
          this.cartItems = this.cartItems.map(ci => ci.id === updated.id ? updated : ci);
        }
        this.totalPrice = this.cartItems.reduce((acc, it) => acc + (it.price * it.quantity), 0);
      },
      err => {
        console.error('Failed to increment quantity', err);
        alert('Failed to update cart');
      }
    );
  }

  decrementQuantity(item: any): void {
    const cartId = item.id;
    this.http.put<any>(`http://127.0.0.1:8000/update_cart_item/${cartId}/`, { delta: -1 }).subscribe(
      res => {
        if (res && (res.deleted === true)) {
          this.cartItems = this.cartItems.filter(ci => ci.id !== cartId);
        } else {
          const updated = res;
          this.cartItems = this.cartItems.map(ci => ci.id === updated.id ? updated : ci);
        }
        this.totalPrice = this.cartItems.reduce((acc, it) => acc + (it.price * it.quantity), 0);
      },
      err => {
        console.error('Failed to decrement quantity', err);
        alert('Failed to update cart');
      }
    );
  }

  buyNow(item: any): void {
      const user = this.authService.getUserId();
  const payload = {
    user_id: user,
    product_id: item.product,
    price: item.price,
    quantity: item.quantity
  };
  console.log('Payload:', payload);
  this.router.navigate(['/select_address'], { state: { payload } });
}


buyallNow(cartItems: any[]): void {
  const user = this.authService.getUserId();

  const payload = cartItems.map(item => ({
    user_id: user,
    product_id: item.product,
    price: item.price,
    quantity: item.quantity
  }));

  console.log("Buy All Payload:", payload);

  this.router.navigate(['/select_address'], { state: { payload } });
}





}






