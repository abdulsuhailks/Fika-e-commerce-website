// Removed stray getter and moved admin navigation methods inside the class
import { Component, ElementRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  adminHome() {
    this.router.navigate(['/admin']);
  }
  adminAddProduct() {
    this.router.navigate(['/add_product']);
  }
  adminViewProduct() {
    this.router.navigate(['/view_product']);
  }
  adminSoldProducts() {
    this.router.navigate(['/sold_products']);
  }

  constructor(private router: Router, private authService: AuthService, private elementRef: ElementRef) {}

  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  viewcart(): void {
    this.router.navigate(['/viewcart']);
  }

  addaddress(): void {
    this.router.navigate(['/add_address']);
  }

  isSidebarOpen = false;
  searchQuery = '';

  search() {
    const query = this.searchQuery.trim();
    if (query) {
      this.router.navigate(['/search'], { queryParams: { query } });
    }
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  // Close sidebar when clicking outside the component
  @HostListener('document:click', ['$event'])
  handleDocumentClick(event: MouseEvent) {
    // If sidebar is closed, nothing to do
    if (!this.isSidebarOpen) return;

    // If click occurred inside this component, do nothing
    if (this.elementRef.nativeElement.contains(event.target)) return;

    // Otherwise close the sidebar
    this.isSidebarOpen = false;
  }

  viewProfile(): void {
    this.router.navigate(['/view_edit_product']);
  }

  orders(): void {
    this.router.navigate(['/view_orders']);
  }

  Logout(){
    this.authService.logout();
    this.router.navigate(['/login']);
    console.log('User logged out');
  }

  home(){
    this.router.navigate(['/user']);
  }

}
