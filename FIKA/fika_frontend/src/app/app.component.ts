import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { ThemeService } from './theme.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'fika_frontend';


constructor(private themeService: ThemeService) {}

toggleTheme() {
  this.themeService.toggleTheme();
}

}
