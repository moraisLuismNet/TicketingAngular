import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../core/services/user.service';
import { User, UserRole } from '../../../core/models/user.model';

@Component({
  selector: 'app-clients-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="clients-container">
      <div class="clients-header">
        <div class="header-content">
          <h1>Clients Management</h1>
          <p>View and manage all registered customers in the system.</p>
        </div>
      </div>

      <div *ngIf="isLoading" class="loading-container">
        <div class="spinner"></div>
      </div>

      <div *ngIf="errorMessage" class="alert alert-error">
        {{ errorMessage }}
      </div>

      <div class="clients-table" *ngIf="!isLoading && !errorMessage">
        <table>
          <thead>
            <tr>
              <th>Joined Date</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let client of clients" class="client-row">
              <td>{{ formatDate(client.createdAt) }}</td>
              <td class="client-name">{{ client.fullName }}</td>
              <td>{{ client.email }}</td>
              <td>
                <span class="badge" [ngClass]="client.isActive ? 'badge-active' : 'badge-inactive'">
                  {{ client.isActive ? 'Active' : 'Inactive' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>

        <div *ngIf="clients.length === 0" class="empty-state">
          <p>No clients found</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .clients-container {
      max-width: 1400px;
      margin: 0 auto;
    }

    .clients-header {
      margin-bottom: var(--spacing-xl);
      .header-content {
        h1 {
          font-size: var(--font-size-2xl);
          font-weight: 700;
          color: var(--color-gray-900);
          margin-bottom: var(--spacing-xs);
        }
        p {
          font-size: var(--font-size-sm);
          color: var(--color-gray-600);
        }
      }
    }

    .loading-container {
      display: flex;
      justify-content: center;
      padding: var(--spacing-2xl);
    }

    .clients-table {
      background: var(--color-white);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-md);
      overflow: hidden;

      table {
        width: 100%;
        border-collapse: collapse;

        thead {
          background-color: var(--color-gray-50);
          border-bottom: 1px solid var(--color-gray-200);

          th {
            padding: var(--spacing-md);
            text-align: left;
            font-size: var(--font-size-sm);
            font-weight: 600;
            color: var(--color-gray-700);
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
        }

        tbody {
          tr.client-row {
            border-bottom: 1px solid var(--color-gray-200);
            transition: background-color var(--transition-fast);

            &:hover {
              background-color: var(--color-gray-50);
            }

            &:last-child {
              border-bottom: none;
            }
          }

          td {
            padding: var(--spacing-md);
            font-size: var(--font-size-sm);
            color: var(--color-gray-800);

            &.client-name {
              font-weight: 500;
            }
          }
        }
      }
    }

    .badge {
      padding: 0.25rem 0.75rem;
      border-radius: var(--radius-full);
      font-size: var(--font-size-xs);
      font-weight: 600;
    }

    .badge-active {
      background-color: #ecfdf5;
      color: #059669;
    }

    .badge-inactive {
      background-color: #fef2f2;
      color: #dc2626;
    }

    .empty-state {
      padding: var(--spacing-2xl);
      text-align: center;
      color: var(--color-gray-600);
    }

    .alert-error {
      background-color: #fef2f2;
      color: #dc2626;
      padding: var(--spacing-md);
      border-radius: var(--radius-md);
      margin-bottom: var(--spacing-lg);
    }
  `]
})
export class ClientsListComponent implements OnInit {
  clients: User[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.userService.getUsers(UserRole.Customer).subscribe({
      next: (users) => {
        // Double check filtering on frontend for security/reliability
        this.clients = users.filter(u => u.role === UserRole.Customer);
        this.isLoading = false;
      },

      error: (error) => {
        this.errorMessage = error.message || 'Failed to load clients';
        this.isLoading = false;
      }
    });
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
}

