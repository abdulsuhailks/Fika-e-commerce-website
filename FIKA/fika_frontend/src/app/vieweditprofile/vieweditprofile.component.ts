import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-vieweditprofile',
  templateUrl: './vieweditprofile.component.html',
  styleUrls: ['./vieweditprofile.component.css']
})
export class VieweditprofileComponent implements OnInit {
  [x: string]: any;
  addresses: any[] = [];
  userprofile: any = {
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    gender: '',
    phone_number: '',


  };


  id: number = 0;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const user_id = this.authService.getUserId();
    console.log('User ID:', user_id);
    this.http.get(`http://127.0.0.1:8000/edit_profile/${user_id}`).subscribe({
      next: (res: any) => {
        this.userprofile = res;
        console.log('User profile loaded:', this.userprofile);
      },
      error: (err) => {
        console.error('Failed to load user:', err);
      }
    });


    
        this.http.get<any[]>(`http://127.0.0.1:8000/get_address/${user_id}/`).subscribe(
      (response) => {
        console.log('Addresses:', response);
        this.addresses = response;
      },
      (error) => {
        console.error('Error fetching addresses:', error);
      }
    );
  }



  onSubmit(): void {
    console.log(this.userprofile);
    const data = {
      username: this.userprofile.username,
      first_name: this.userprofile.first_name,
      last_name: this.userprofile.last_name,
      email: this.userprofile.email,
      gender: this.userprofile.gender,
      phone_number: this.userprofile.phone_number,
    };

    this.http.put(`http://127.0.0.1:8000/update_profile/${this.userprofile.id}`, data).subscribe({
      next: (res) => {
        console.log('Profile updated successfully:', res);
        alert('Profile updated successfully!');
        this.router.navigate(['/user']);
      },
      error: (err) => {
        console.error('Failed to update profile:', err);
      }
    });
  }


  cancel(): void {
    this.router.navigate(['/user']);
  }

  detele_address(addressId: number): void {
    const user_id = this.authService.getUserId();
    this.http.delete(`http://127.0.0.1:8000/delete_address/${user_id}/${addressId}/`).subscribe({
      next: (res) => {
        console.log('Address deleted successfully:', res);
        alert('Address deleted successfully!');
        this.addresses = this.addresses.filter(address => address.id !== addressId);
      },
      error: (err) => {
        console.error('Failed to delete address:', err);
      }
    });
  }

}