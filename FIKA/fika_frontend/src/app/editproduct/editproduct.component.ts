import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-editproduct',
  templateUrl: './editproduct.component.html',
  styleUrls: ['./editproduct.component.css']
})
export class EditproductComponent implements OnInit {
  [x: string]: any;
  product: any = {
    name: '',
    category: '',
    description: '',
    price: 0,
    stock: 0,
    size: '',
    image: ''
  };

  id: number = 0;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.http.get(`http://127.0.0.1:8000/editproduct/${this.id}`).subscribe(
      (res: any) => {
        this.product = res;
      },
      (err) => {
        console.error('Failed to load product:', err);
      }
    );
  }



  onSubmit(): void {
    console.log(this.product);
    console.log(this.product.name);
    const data = {
      name: this.product.name,
      category: this.product.category,
      description: this.product.description,
      price: this.product.price,
      stock: this.product.stock,
      size: this.product.size.toString(),
    }
    this.http.put(`http://127.0.0.1:8000/updateproduct/${this.id}`, data).subscribe(
      (res: any) => {
        alert('Product updated successfully!');
        this.router.navigate(['/view_product']);
      },
      (err) => {
        console.error('Failed to update product:', err);
        alert('Failed to update!');
      }
    );
  }

  cancel(): void {
    this.router.navigate(['/view_product']);
  }
}