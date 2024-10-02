import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-protected',
  templateUrl: './protected.component.html',
  styleUrls: ['./protected.component.css']
})
export class ProtectedComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    // Check if the user is authenticated
    if (!this.authService.isAuthenticated()) {
      // Redirect to login page
      this.authService.logout();
      console.log('You are not authenticated');
    }
  }

}