import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-viewproduct',
  templateUrl: './viewproduct.component.html',
  styleUrls: ['./viewproduct.component.css']
})
export class ViewproductComponent {
  product: any;

  getdata(){
    this.h.get('http://127.0.0.1:8000/viewproduct').subscribe(
      (result:any)=>{
        console.log(result);
        this.product=result;
        }
    )
  }
  
  constructor(private h: HttpClient, private router: Router) { 
    this.getdata();
  }

  editProduct(id:any){
    console.log('Editing product with ID:', id);
    this.router.navigate(['/editproduct', id]);


  }


  deleteProduct(id:any){
    console.log('Deleting product with ID:', id);
      this.h.delete(`http://127.0.0.1:8000/deleteproduct/${id}`).subscribe((res) => {
        alert('Product deleted successfully!');
        this.getdata();
      });
  
}

  addproduct() {
    this.router.navigate(['/add_product']);
  }






}
