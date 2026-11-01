import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

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
import { RazorpayComponent } from './razorpay/razorpay.component';
import { SuccessComponent } from './success/success.component';
import { SoldproductsComponent } from './soldproducts/soldproducts.component';
import { NavbarComponent } from './navbar/navbar.component';

const routes: Routes = [
  { path:"register",component:RegisterComponent },
  { path:"login",component:LoginsComponent },
  { path: 'admin', component: AdminhomeComponent },
  { path: 'user', component: UserhomeComponent },
  { path: 'add_product', component: AddProductComponent },
  { path: 'view_product', component: ViewproductComponent },
  { path: 'editproduct/:id', component: EditproductComponent },
  { path: 'productsbycategory/:category',component: ProductsbycategoryComponent },
  { path: 'search', component: SearchresultComponent },
  { path: 'product/:id', component: ViewoneproductComponent },
  { path: 'viewcart', component: ViewcartComponent },
  { path: 'add_address', component: AddaddressComponent },
  { path: 'select_address', component: SelectaddressComponent },
  { path: 'payment', component: PaymentComponent },
  { path: 'view_edit_product', component: VieweditprofileComponent },
  { path: 'view_orders', component: ViewordersComponent },
  { path: 'razorpay', component: RazorpayComponent },
  { path: 'success', component: SuccessComponent },
  { path: 'sold_products', component: SoldproductsComponent },
  { path: 'navbar', component: NavbarComponent },






  { path: '', redirectTo: 'login', pathMatch: 'full' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
