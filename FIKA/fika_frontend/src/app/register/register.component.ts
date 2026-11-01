import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  [x: string]: any;

  username: String="";
  first_name: String="";
  last_name: String="";
  email: String="";
  gender: String="";
  password: String="";
  phone_number: number=0;

  registerdata(data:any){
    console.log(data);
    console.log(data.username);

    
    const s_data = {
      username: data.username,
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      gender: data.gender,
      password: data.password,
      phone_number: data.phone_number

    };


    this.h.post('http://127.0.0.1:8000/register',s_data).subscribe(
      (res)=>{
        console.log(res);
        alert("success")
        this.router.navigate(['/login']);
        }
    )

  }
  constructor(private h:HttpClient , private router: Router) {}
  logs() {
    this.router.navigate(['/login']);
  }

}
