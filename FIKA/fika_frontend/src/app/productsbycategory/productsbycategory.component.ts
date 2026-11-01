import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-productsbycategory',
  templateUrl: './productsbycategory.component.html',
  styleUrls: ['./productsbycategory.component.css']
})
export class ProductsbycategoryComponent implements OnInit {
  category = '';
  products: any[] = [];
  

  constructor(private route: ActivatedRoute, private http: HttpClient, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.category = this.route.snapshot.paramMap.get('category') || '';
    console.log(this.category);
    this.http.get<any>(`http://127.0.0.1:8000/products_by_category/${this.category}`).subscribe(
      res => this.products = res.products,
      err => console.error(err)
    );
  }

  searchQuery = '';

search() {
  if (this.searchQuery.trim()) {
    console.log('Search query:', this.searchQuery);
    this.router.navigate(['/search'], { queryParams: { query: this.searchQuery } });
  }
}

  viewProduct(id: number): void {
    this.router.navigate(['/product', id]);
  }






}









