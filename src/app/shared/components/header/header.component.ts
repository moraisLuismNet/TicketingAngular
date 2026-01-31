import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { User, UserRole } from '../../../core/models/user.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  currentUser: User | null = null;

  constructor(
    public authService: AuthService,
    private router: Router
  ) {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  logout(): void {
    this.authService.logout();
  }

  formatRole(role: UserRole | undefined): string {
    if (role === undefined) return '';
    
    // Convert to number if it's a string (sometimes an issue with JS/TS enums)
    const roleNum = Number(role);
    
    switch (roleNum) {
      case UserRole.Admin: return 'Admin';
      case UserRole.Agent: return 'Agent';
      case UserRole.Customer: return 'User';
      default: return 'User';
    }
  }

  getInitials(fullName: string): string {
    return fullName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }
}
