import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';



@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent {
  [x: string]: any;

  @ViewChild('productForm') form: any;
  @ViewChild('fileInput')
  fileInput!: ElementRef;

  name: string = "";
  category: string = "";
  product_id_no: string = "";
  description: string = "";
  price: number = 0;
  stock: number = 0;
  size: string = "";
  image: File | null = null;

  constructor(private h: HttpClient, private router: Router) {}

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.image = event.target.files[0];
    }
  }

  onSubmit(data: any) {
    console.log(data);
    console.log(data.name);

    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('category', data.category);
    formData.append('product_id_no', data.product_id_no);
    formData.append('description', data.description);
    formData.append('price', data.price);
    formData.append('stock', data.stock);
    formData.append('size', data.size || '');
    if (this.image) {
      formData.append('image', this.image);
    }

    this.h.post('http://127.0.0.1:8000/addproduct', formData).subscribe(
      (res) => {
        console.log(res);
        alert("Product added successfully!");

        this.form.resetForm();
        this.fileInput.nativeElement.value = '';
        this.image = null;

      },
      (err) => {
        console.error('Error response:', err.error); 
        alert("Failed to add product!");
      }
    );
  }

}