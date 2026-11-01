import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RegisterComponent } from './register/register.component';
import { LoginsComponent } from './logins/logins.component';
import { AdminhomeComponent } from './adminhome/adminhome.component';
import { UserhomeComponent } from './userhome/userhome.component';
import { AddProductComponent } from './add-product/add-product.component';
import { ViewproductComponent } from './viewproduct/viewproduct.component';
import { EditproductComponent } from './editproduct/editproduct.component';
import { ProductsbycategoryComponent } from './productsbycategory/productsbycategory.component';
import { SearchresultComponent } from './searchresult/searchresult.component';
import { ViewoneproductComponent } from './viewoneproduct/viewoneproduct.component';
import { ViewcartComponent } from './viewcart/viewcart.component';
import { AddaddressComponent } from './addaddress/addaddress.component';
import { SelectaddressComponent } from './selectaddress/selectaddress.component';
import { PaymentComponent } from './payment/payment.component';
import { VieweditprofileComponent } from './vieweditprofile/vieweditprofile.component';
import { ViewordersComponent } from './vieworders/vieworders.component';
import { SoldproductsComponent } from './soldproducts/soldproducts.component';
import { NavbarComponent } from './navbar/navbar.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginsComponent,
    AdminhomeComponent,
    UserhomeComponent,
    AddProductComponent,
    ViewproductComponent,
    EditproductComponent,
    ProductsbycategoryComponent,
    SearchresultComponent,
    ViewoneproductComponent,
    ViewcartComponent,
    AddaddressComponent,
    SelectaddressComponent,
    PaymentComponent,
    VieweditprofileComponent,
    ViewordersComponent,
    SoldproductsComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
