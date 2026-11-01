import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-logins',
  templateUrl: './logins.component.html',
  styleUrls: ['./logins.component.css']
})
export class LoginsComponent {
  username: String="";
  password: String="";
  
  logindata(data:any){
    console.log(data);

    const s_data = {
      username: data.username,
      password: data.password
    };
    console.log(s_data);

    this.http.post('http://127.0.0.1:8000/logins', data).subscribe(
      (res: any) => {
        console.log("Login response:", res);
        const token = res.token;
        const userId = res.user_id
        if (token) {
          const isAdmin = res.message === "Admin Login successful";
          this.authService.login(token, userId, isAdmin);
          if (isAdmin) {
            this.router.navigate(['/admin']);
          } else if (res.message === "User Login successful") {
            this.router.navigate(['/user']);
          } else {
            alert("Unknown login response");
          }
        }
      },
      (err) => {
        console.error("Login error:", err);
        alert(err.error?.error || "Login failed");
      }
    );
  }


constructor(
  private http: HttpClient,
  private router: Router,
  private authService: AuthService
) {}
  
  forgot() {
    this.router.navigate(['/forgot']);
  }

  reg() {
    this.router.navigate(['/register']);
  }
}
