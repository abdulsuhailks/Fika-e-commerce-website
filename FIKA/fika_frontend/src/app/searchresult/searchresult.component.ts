import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-searchresult',
  templateUrl: './searchresult.component.html',
  styleUrls: ['./searchresult.component.css']
})
export class SearchresultComponent implements OnInit {
  query = '';
  results: any[] = [];
  // router: any;

  constructor(private route: ActivatedRoute, private http: HttpClient, private authService: AuthService, private router: Router ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.query = params['query'] || '';
      if (this.query) {
        this.http.get<any[]>(`http://127.0.0.1:8000/search/?query=${this.query}`)
          .subscribe(data => this.results = data);
      }
    });
  }

   
searchQuery = '';

search() {
  if (this.searchQuery.trim()) {
    console.log('Search query:', this.searchQuery);
    this.http.get<any[]>(`http://127.0.0.1:8000/search/?query=${this.searchQuery}`)
    .subscribe(data => this.results = data);
  }
}



  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }


  viewProduct(id: number): void {
    this.router.navigate(['/product', id]);
  }





  

}
