import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-viewoneproduct',
  templateUrl: './viewoneproduct.component.html',
  styleUrls: ['./viewoneproduct.component.css']
})
export class ViewoneproductComponent implements OnInit {
  Product: any;

  constructor(private route: ActivatedRoute, private http: HttpClient, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.http.get(`http://127.0.0.1:8000/product/${id}`).subscribe((data) => {
      this.Product = data;
      console.log(this.Product);
    });
      const user = this.authService.getUserId();
  console.log('User found:', user);

  }


quantity = 1;

checkAndAddToCart(product: any) {
    const user = this.authService.getUserId();

    const payload = {
      user_id: user,
      product_id: product.id
    };

    // First check product exists in cart
    this.http.post('http://127.0.0.1:8000/check_product_in_cart/', payload)
      .subscribe((res: any) => {

        if (res.exists) {
          // Product already in cart → Redirect to cart page
          alert("Product already in cart. Redirecting to cart...");
          this.router.navigate(['/cart']);
          return;
        }

        // If not exists → Add to cart normally
        this.addtocart(product);
      });
  }

addtocart(product: any) {
  const user = this.authService.getUserId();
  const payload = {
    user_id: user,
    product_id: product.id,
    price: product.price,
    quantity: this.quantity
  };
  console.log('Payload:', payload);
  this.http.post('http://127.0.0.1:8000/add_to_cart', payload).subscribe(
    res => alert(JSON.stringify(res)),
    

    
    err => alert('Failed to add to cart')
  );
}


buyNow(product: any) {
  const user = this.authService.getUserId();
  const payload = {
    user_id: user,
    product_id: product.id,
    price: product.price,
    quantity: this.quantity
  };
  console.log('Payload:', payload);
  this.router.navigate(['/select_address'], { state: { payload } });
}









}